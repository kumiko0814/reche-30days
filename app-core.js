/* =====================================================================
   Re:che 30DAYS  共通コア（保存 / 採点 / 解放 / フィードバック / 連携）
   依存: curriculum.js（RECHE_CURRICULUM, RECHE_BADGES, RECHE_LEVELS）
   保存先: localStorage（単一ブラウザ内で完結。GAS連携時はpublish/importを差し替え）
   ===================================================================== */
(function (global) {
  "use strict";

  const KEY_STATE    = "reche30_state";     // 本人の進捗
  const KEY_ROSTER   = "reche30_roster";    // 全メンバーのスナップショット（管理者用）
  const KEY_FEEDBACK = "reche30_feedback";  // { nick: { day: "コメント" } }
  const TOTAL = 30;

  /* ---------- low level ---------- */
  function read(key, fallback){
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  }
  function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
  function daysBetween(aISO, bISO){
    const a=new Date(aISO+"T00:00:00"), b=new Date(bISO+"T00:00:00");
    return Math.round((b-a)/86400000);
  }

  /* ---------- state ---------- */
  function defaultState(nick){
    return {
      nick: nick || "",
      startDate: todayISO(),
      mode: "date",          // "date"=日付で1日1解放 / "free"=全解放
      progress: {},          // { [day]: { done, value, report, quiz:{score,total}, doneAt } }
      createdAt: new Date().toISOString()
    };
  }
  function getState(){ return read(KEY_STATE, null); }
  function saveState(s){ write(KEY_STATE, s); publish(s); }
  function hasAccount(){ const s=getState(); return !!(s && s.nick); }
  function startAccount(nick, mode){
    const s = defaultState(nick);
    if (mode) s.mode = mode;
    saveState(s);
    return s;
  }

  /* ---------- 解放ロジック ---------- */
  // 当日まで解放。過去の未提出は「あとから提出（キャッチアップ）」可、未来はロック。
  function unlockedThrough(s){
    if (!s) return 1;
    if (s.mode === "free") return TOTAL;
    const elapsed = daysBetween(s.startDate, todayISO()); // 0=初日
    return Math.max(1, Math.min(TOTAL, elapsed + 1));
  }
  function dayStatus(s, day){
    if (s && s.progress[day] && s.progress[day].done) return "done";
    const u = unlockedThrough(s);
    if (day > u) return "locked";
    if (day === u) return "today";
    return "open"; // 過去・未提出（キャッチアップ）
  }

  /* ---------- 採点 / レベル ---------- */
  function dayDef(day){ return RECHE_CURRICULUM.find(d => d.day === day); }

  function dayPoints(s, day){
    const p = s.progress[day]; if (!p || !p.done) return 0;
    const def = dayDef(day); let pts = def.points || 0;
    if (p.quiz && p.quiz.total){ // クイズ正答ボーナス（1問+20、全問+50）
      pts += p.quiz.score * 20;
      if (p.quiz.score === p.quiz.total) pts += 50;
    }
    return pts;
  }
  function totalPoints(s){
    if (!s) return 0;
    const base = RECHE_CURRICULUM.reduce((sum,d)=> sum + dayPoints(s, d.day), 0);
    return base + streakBonus(s);
  }
  function doneCount(s){
    if (!s) return 0;
    return Object.values(s.progress).filter(p=>p.done).length;
  }
  function level(points){
    let cur = RECHE_LEVELS[0];
    for (const L of RECHE_LEVELS){ if (points >= L.min) cur = L; }
    const idx = RECHE_LEVELS.indexOf(cur);
    const next = RECHE_LEVELS[idx+1] || null;
    return { ...cur, next, toNext: next ? next.min - points : 0 };
  }
  function earnedBadges(s){
    return RECHE_BADGES.filter(b => s && s.progress[b.day] && s.progress[b.day].done).map(b=>b.id);
  }
  // 連続提出（Day1から連続でdoneしている数）と 提出数
  function streak(s){
    if (!s) return 0; let n=0;
    for (let d=1; d<=TOTAL; d++){ if (s.progress[d] && s.progress[d].done) n++; else break; }
    return n;
  }
  // 連続提出ボーナス（マイルストーン到達でポイント加算）
  const STREAK_MILESTONES = [
    { n:3,  bonus:50  }, { n:7,  bonus:150 }, { n:14, bonus:300 },
    { n:21, bonus:500 }, { n:30, bonus:800 }
  ];
  function streakBonus(s){
    const st = streak(s);
    return STREAK_MILESTONES.filter(m=>st>=m.n).reduce((a,m)=>a+m.bonus,0);
  }
  function streakInfo(s){
    const st = streak(s);
    const next = STREAK_MILESTONES.find(m=>st<m.n) || null;
    return { streak:st, next: next?next.n:null, toNext: next?(next.n-st):0,
             nextBonus: next?next.bonus:0, hit: STREAK_MILESTONES.filter(m=>st>=m.n).map(m=>m.n) };
  }

  // 同期ランキング（ロスターをポイント降順）
  function ranking(){
    return Object.values(roster()).sort((a,b)=> (b.points||0)-(a.points||0));
  }
  function myRank(nick){
    const list = ranking();
    const i = list.findIndex(r=>r.nick===nick);
    return { rank: i>=0 ? i+1 : null, total: list.length, list };
  }

  /* ---------- 提出 ---------- */
  // payload: { value?, report?, quiz?:{score,total} }
  function submitDay(day, payload){
    const s = getState(); if (!s) return null;
    const beforeLv = level(totalPoints(s)).lv;
    const beforeBadges = earnedBadges(s);
    const beforeStreakHit = streakInfo(s).hit;
    s.progress[day] = Object.assign({}, payload, { done:true, doneAt:new Date().toISOString() });
    saveState(s);
    const afterLv = level(totalPoints(s)).lv;
    const newBadges = earnedBadges(s).filter(b => !beforeBadges.includes(b));
    const afterStreakHit = streakInfo(s).hit;
    const gainedStreak = afterStreakHit.filter(n => !beforeStreakHit.includes(n));
    const newStreakMilestone = gainedStreak.length ? Math.max(...gainedStreak) : null;
    return { state:s, leveledUp: afterLv>beforeLv, newLevel: level(totalPoints(s)),
             newBadges, newStreakMilestone };
  }
  function clearDay(day){
    const s=getState(); if(!s) return; delete s.progress[day]; saveState(s);
  }

  /* ---------- 計算式の安全評価 ---------- */
  function evalFormula(formula, vars){
    const keys = Object.keys(vars), vals = keys.map(k=>Number(vars[k])||0);
    try { return Function(...keys, "return ("+formula+");")(...vals); }
    catch(e){ return NaN; }
  }

  /* ---------- ロスター（管理者集計用スナップショット） ---------- */
  function publish(s){
    if (!s || !s.nick) return;
    const r = read(KEY_ROSTER, {});
    r[s.nick] = {
      nick: s.nick, startDate: s.startDate, mode: s.mode,
      progress: s.progress, points: totalPoints(s),
      done: doneCount(s), streak: streak(s),
      level: level(totalPoints(s)).name, lv: level(totalPoints(s)).lv,
      updatedAt: new Date().toISOString()
    };
    write(KEY_ROSTER, r);
  }
  function roster(){ return read(KEY_ROSTER, {}); }

  /* ---------- フィードバック ---------- */
  function getFeedback(nick, day){
    const f = read(KEY_FEEDBACK, {});
    return (f[nick] && f[nick][day]) ? f[nick][day] : "";
  }
  function setFeedback(nick, day, text){
    const f = read(KEY_FEEDBACK, {});
    f[nick] = f[nick] || {};
    if (text) f[nick][day] = { text, at: new Date().toISOString() };
    else delete f[nick][day];
    write(KEY_FEEDBACK, f);
  }
  function getFeedbackObj(nick, day){
    const f = read(KEY_FEEDBACK, {});
    return (f[nick] && f[nick][day]) ? f[nick][day] : null;
  }

  /* ---------- export / import（GAS連携・バックアップ用） ---------- */
  function exportState(){
    const s=getState();
    return JSON.stringify({ type:"reche30_user", state:s }, null, 2);
  }
  function importRosterJSON(text){
    const data = JSON.parse(text);
    const r = read(KEY_ROSTER, {});
    const add = (snap)=>{ r[snap.nick] = snap; };
    if (data.type==="reche30_user" && data.state){
      const s=data.state;
      add({ nick:s.nick, startDate:s.startDate, mode:s.mode, progress:s.progress,
            points: totalPoints(s), done: doneCount(s), streak: streak(s),
            level: level(totalPoints(s)).name, lv: level(totalPoints(s)).lv, updatedAt:new Date().toISOString() });
    } else if (Array.isArray(data)) { data.forEach(add); }
    else if (data.roster){ Object.values(data.roster).forEach(add); }
    write(KEY_ROSTER, r);
    return Object.keys(r).length;
  }

  /* ---------- デモデータ（管理者画面を即確認できるよう初回のみ投入） ---------- */
  function seedDemoIfEmpty(){
    const r = read(KEY_ROSTER, {});
    if (Object.keys(r).length) return;
    const mk = (nick, doneDays, sample)=>{
      const prog={};
      doneDays.forEach(d=>{ prog[d]={done:true, value: sample && sample[d] ? sample[d] : "（提出メモ）", doneAt:new Date().toISOString()}; });
      // 仮state→集計
      const fake={ nick, startDate:"2026-03-09", mode:"date", progress:prog };
      return { nick, startDate:"2026-03-09", mode:"date", progress:prog,
        points: totalPoints(fake), done: doneCount(fake), streak: streak(fake),
        level: level(totalPoints(fake)).name, lv: level(totalPoints(fake)).lv, updatedAt:new Date().toISOString() };
    };
    const demo = {
      "ゆうこ":   mk("ゆうこ",   [1,2,3,4,5,6,7,8,9,10,11,12,13,14], {3:"月10万の利益目標！子どもの習い事と自己投資に。"}),
      "のりこ":   mk("のりこ",   [1,2,3,4,5,6,7], {3:"繰上げ返済を早めて投資フェーズへ。月5万目標。"}),
      "まゆみ":   mk("まゆみ",   [1,2,3,4,5,6,7,8,9,10,11,12], {7:"https://jp.mercari.com/user/profile/000"}),
      "さおり":   mk("さおり",   [1,2,3], {1:"出産前後で隙間時間に挑戦します。"})
    };
    write(KEY_ROSTER, demo);
    // デモのフィードバック例
    const f = read(KEY_FEEDBACK, {});
    f["のりこ"] = { 3:{ text:"目的が明確で素敵です。まずは出品数を1日3品から積み上げましょう！", at:new Date().toISOString() } };
    write(KEY_FEEDBACK, f);
  }

  /* ---------- UI helpers ---------- */
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function toast(msg){
    let t=document.querySelector(".toast");
    if(!t){ t=document.createElement("div"); t.className="toast"; document.body.appendChild(t); }
    t.textContent=msg; t.classList.add("show");
    clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove("show"), 2200);
  }
  function confetti(){
    let c=document.querySelector(".confetti");
    if(!c){ c=document.createElement("div"); c.className="confetti"; document.body.appendChild(c); }
    const cols=["#C25B3F","#E8A293","#2E7D6B","#D9A441","#EAC2B8"];
    c.innerHTML="";
    for(let i=0;i<80;i++){ const s=document.createElement("i");
      s.style.left=Math.random()*100+"vw";
      s.style.background=cols[i%cols.length];
      s.style.animationDuration=(2+Math.random()*1.8)+"s";
      s.style.animationDelay=(Math.random()*.5)+"s";
      c.appendChild(s);
    }
    c.classList.add("go");
    setTimeout(()=>c.classList.remove("go"), 3600);
  }

  global.RECHE = {
    TOTAL, KEY_STATE, KEY_ROSTER, KEY_FEEDBACK,
    todayISO, daysBetween,
    getState, saveState, hasAccount, startAccount, defaultState,
    unlockedThrough, dayStatus, dayDef,
    dayPoints, totalPoints, doneCount, level, earnedBadges, streak,
    STREAK_MILESTONES, streakBonus, streakInfo, ranking, myRank,
    submitDay, clearDay, evalFormula,
    publish, roster, getFeedback, getFeedbackObj, setFeedback,
    exportState, importRosterJSON, seedDemoIfEmpty,
    esc, toast, confetti
  };
})(window);
