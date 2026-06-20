/* =====================================================================
   わたしのお庭（育成・あつ森風）
   - 提出が進むほど「お店」が育ち、お庭に葉っぱが増え、どうぶつが集まる
   - すべてSVG（チープなAI絵文字は不使用）。色はMeroneパステル
   依存: app-core.js（RECHE）
   ===================================================================== */
(function (global) {
  "use strict";

  /* ---- お店の成長段階（レベル1〜6に対応） ---- */
  const HOUSE_NAMES = ["ふたば畑","小さな鉢","フリマテント","木のお店","Re:cheショップ","にぎわう本店"];
  function houseSvg(lv){
    const L = Math.max(1, Math.min(6, lv));
    const awn = `<g>
      <rect x="26" y="60" width="48" height="34" rx="5" fill="#FBF1E6" stroke="#E2C9B2"/>
      <rect x="22" y="52" width="56" height="12" rx="4" fill="#C25B3F"/>
      <g fill="#E8A293"><rect x="26" y="52" width="8" height="12"/><rect x="42" y="52" width="8" height="12"/><rect x="58" y="52" width="8" height="12"/></g>
      <rect x="44" y="74" width="12" height="20" rx="2" fill="#E2C9B2"/>
      <circle cx="36" cy="78" r="4" fill="#7FB7A7"/></g>`;
    const stages = {
      1:`<g><ellipse cx="50" cy="92" rx="20" ry="7" fill="#C9956B"/>
           <path d="M50 86c-6-2-10-7-9-13 5 1 8 5 9 9 1-5 4-9 9-10 1 7-3 12-9 14z" fill="#7FB7A7"/>
           <rect x="49" y="86" width="2" height="8" fill="#6AA48F"/></g>`,
      2:`<g><path d="M40 94l3-16h14l3 16z" fill="#E2C9B2" stroke="#CBB199"/>
           <circle cx="50" cy="70" r="13" fill="#7FB7A7"/><circle cx="41" cy="76" r="8" fill="#9ECBBA"/>
           <circle cx="59" cy="76" r="8" fill="#9ECBBA"/><path d="M50 70v18" stroke="#6AA48F" stroke-width="2"/></g>`,
      3:`<g><path d="M28 64l22-12 22 12v30H28z" fill="#FBF1E6" stroke="#E2C9B2"/>
           <path d="M24 64l26-14 26 14" fill="none" stroke="#C25B3F" stroke-width="6" stroke-linejoin="round"/>
           <rect x="44" y="76" width="12" height="18" rx="2" fill="#E8A293"/></g>`,
      4:`<g><rect x="30" y="60" width="40" height="34" rx="4" fill="#FBF1E6" stroke="#E2C9B2"/>
           <path d="M26 60l24-16 24 16" fill="#C25B3F"/><rect x="44" y="74" width="12" height="20" rx="2" fill="#B98A5E"/>
           <rect x="35" y="66" width="9" height="9" rx="2" fill="#9ECBBA"/><rect x="56" y="66" width="9" height="9" rx="2" fill="#9ECBBA"/></g>`,
      5:awn,
      6:`<g>${awn}<path d="M80 40v22" stroke="#B98A5E" stroke-width="2"/><path d="M80 40l14 4-14 5z" fill="#C25B3F"/>
           <circle cx="20" cy="84" r="5" fill="#E8A293"/><circle cx="82" cy="86" r="4" fill="#7FB7A7"/></g>`
    };
    return `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">${stages[L]}</svg>`;
  }

  /* ---- どうぶつ（提出数で集まる） ---- */
  const ANIMALS = [
    { id:"kotori", name:"ことり",   need:1,  svg:`<g><ellipse cx="20" cy="22" rx="13" ry="11" fill="#9ECBBA"/><circle cx="26" cy="18" r="7" fill="#9ECBBA"/><circle cx="28" cy="17" r="1.6" fill="#43362E"/><path d="M33 18l6-2-5 4z" fill="#E8A24C"/><path d="M14 22q6 6 12 0z" fill="#7FB7A7"/></g>` },
    { id:"usagi",  name:"うさぎ",   need:3,  svg:`<g><ellipse cx="20" cy="26" rx="12" ry="11" fill="#F3E3DA"/><circle cx="20" cy="16" r="8" fill="#F3E3DA"/><rect x="14" y="2" width="4" height="13" rx="2" fill="#F3E3DA"/><rect x="22" y="2" width="4" height="13" rx="2" fill="#F3E3DA"/><rect x="15" y="4" width="2" height="9" rx="1" fill="#E8A293"/><rect x="23" y="4" width="2" height="9" rx="1" fill="#E8A293"/><circle cx="17" cy="16" r="1.4" fill="#43362E"/><circle cx="23" cy="16" r="1.4" fill="#43362E"/><circle cx="20" cy="18" r="1.2" fill="#E8A293"/></g>` },
    { id:"neko",   name:"ねこ",     need:7,  svg:`<g><ellipse cx="20" cy="26" rx="13" ry="11" fill="#E8C39A"/><circle cx="20" cy="16" r="8" fill="#E8C39A"/><path d="M13 10l3 6-6-1z" fill="#E8C39A"/><path d="M27 10l-3 6 6-1z" fill="#E8C39A"/><circle cx="17" cy="16" r="1.4" fill="#43362E"/><circle cx="23" cy="16" r="1.4" fill="#43362E"/><path d="M20 18l-2 2h4z" fill="#C25B3F"/><path d="M31 24q8 0 9-8" stroke="#E8C39A" stroke-width="4" fill="none" stroke-linecap="round"/></g>` },
    { id:"risu",   name:"りす",     need:12, svg:`<g><path d="M30 28q14 2 8-16-8 2-10 10z" fill="#D9A066"/><ellipse cx="18" cy="26" rx="11" ry="10" fill="#E0AE78"/><circle cx="18" cy="17" r="7" fill="#E0AE78"/><circle cx="15" cy="16" r="1.3" fill="#43362E"/><circle cx="21" cy="16" r="1.3" fill="#43362E"/><path d="M18 18l-1.5 1.5h3z" fill="#8a5a3a"/></g>` },
    { id:"hitsuji",name:"ひつじ",   need:18, svg:`<g><circle cx="13" cy="24" r="5" fill="#F5EEE6"/><circle cx="27" cy="24" r="5" fill="#F5EEE6"/><circle cx="20" cy="16" r="6" fill="#F5EEE6"/><circle cx="20" cy="28" r="6" fill="#F5EEE6"/><ellipse cx="20" cy="22" rx="11" ry="9" fill="#FFFDF9"/><ellipse cx="20" cy="22" rx="6" ry="5.5" fill="#E8D7C7"/><circle cx="18" cy="21" r="1.2" fill="#43362E"/><circle cx="22" cy="21" r="1.2" fill="#43362E"/></g>` },
    { id:"kuma",   name:"こぐま",   need:25, svg:`<g><circle cx="11" cy="13" r="5" fill="#C79B73"/><circle cx="29" cy="13" r="5" fill="#C79B73"/><ellipse cx="20" cy="24" rx="13" ry="12" fill="#D6AC83"/><circle cx="15" cy="22" r="1.5" fill="#43362E"/><circle cx="25" cy="22" r="1.5" fill="#43362E"/><circle cx="20" cy="27" r="4" fill="#F1E0CE"/><circle cx="20" cy="26" r="1.4" fill="#43362E"/></g>` },
    { id:"panda",  name:"ぱんだ",   need:30, svg:`<g><circle cx="11" cy="13" r="5" fill="#43362E"/><circle cx="29" cy="13" r="5" fill="#43362E"/><circle cx="20" cy="24" r="13" fill="#FFFDF9" stroke="#E2D6C8"/><ellipse cx="14" cy="22" rx="3.5" ry="4.5" fill="#43362E"/><ellipse cx="26" cy="22" rx="3.5" ry="4.5" fill="#43362E"/><circle cx="14" cy="22" r="1.2" fill="#fff"/><circle cx="26" cy="22" r="1.2" fill="#fff"/><circle cx="20" cy="27" r="1.6" fill="#43362E"/></g>` }
  ];
  // お庭に置く配置（%）
  const ANIMAL_POS = [
    {x:14,y:60},{x:78,y:64},{x:30,y:74},{x:64,y:50},{x:46,y:78},{x:84,y:46},{x:8,y:78}
  ];
  const PLANT_POS = [
    {x:6,y:84},{x:22,y:88},{x:38,y:84},{x:70,y:86},{x:88,y:82},{x:54,y:88},
    {x:16,y:72},{x:92,y:70},{x:4,y:66},{x:34,y:66},{x:74,y:72},{x:60,y:66},{x:48,y:62},{x:26,y:58}
  ];
  function leafSvg(kind){
    if(kind===0) return `<svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 18c-4-2-7-6-6-12 5 1 8 4 9 8 1-4 4-8 9-9 1 7-4 12-9 13z" fill="#7FB7A7"/></svg>`;
    if(kind===1) return `<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="11" r="4" fill="#E8A293"/><g fill="#F0C0B5"><circle cx="10" cy="6" r="2.4"/><circle cx="6" cy="9" r="2.4"/><circle cx="14" cy="9" r="2.4"/><circle cx="7.5" cy="14" r="2.4"/><circle cx="12.5" cy="14" r="2.4"/></g><circle cx="10" cy="11" r="2" fill="#D9A441"/></svg>`;
    return `<svg viewBox="0 0 24 24" width="24" height="24"><rect x="11" y="13" width="2.4" height="9" fill="#B98A5E"/><circle cx="12" cy="9" r="7" fill="#7FB7A7"/><circle cx="7" cy="12" r="5" fill="#9ECBBA"/><circle cx="17" cy="12" r="5" fill="#9ECBBA"/></svg>`;
  }

  function unlockedAnimals(done){ return ANIMALS.filter(a=>done>=a.need); }
  function nextAnimal(done){ return ANIMALS.find(a=>done<a.need) || null; }

  function render(state){
    const done = RECHE.doneCount(state);            // 課題提出数で成長
    const stage = Math.min(6, Math.floor(done / 5) + 1); // 5提出ごとにお店ランクUP
    const got  = unlockedAnimals(done);
    const next = nextAnimal(done);

    // 葉っぱ（提出数ぶん。配置上限まで、提出が進むほど花や木に育つ）
    const plantN = Math.min(done, PLANT_POS.length);
    let plants = "";
    for (let i=0;i<plantN;i++){
      const kind = i>=11 ? 2 : (i%4===3 ? 1 : 0);   // 葉→ときどき花→後半は木
      const p = PLANT_POS[i];
      plants += `<div class="g-plant" style="left:${p.x}%;top:${p.y}%;animation-delay:${(i%6)*0.3}s">${leafSvg(kind)}</div>`;
    }
    // どうぶつ
    let animals = got.map((a,i)=>{
      const p = ANIMAL_POS[i % ANIMAL_POS.length];
      return `<div class="g-animal" title="${RECHE.esc(a.name)}" style="left:${p.x}%;top:${p.y}%;animation-delay:${(i%5)*0.25}s">
        <svg viewBox="0 0 40 40" width="46" height="46">${a.svg}</svg></div>`;
    }).join("");

    // どうぶつ図鑑（コレクション）
    const dex = ANIMALS.map(a=>{
      const on = done>=a.need;
      return `<div class="dex ${on?"on":""}" title="${on?RECHE.esc(a.name):("提出 "+a.need+"日であそびに来ます")}">
        <div class="dex-ic"><svg viewBox="0 0 40 40" width="34" height="34">${a.svg}</svg></div>
        <div class="dex-nm">${on?RECHE.esc(a.name):"？"}</div></div>`;
    }).join("");

    const hint = next
      ? `あと <b>${next.need-done}日</b> で「<b>${RECHE.esc(next.name)}</b>」がお庭にあそびに来ます`
      : `すべてのおともだちが集まりました。ありがとう♡`;

    return `
      <div class="garden">
        <div class="g-scene">
          <div class="g-sky"></div>
          <div class="g-ground"></div>
          <div class="g-house">${houseSvg(stage)}</div>
          ${plants}
          ${animals}
          <div class="g-name">${RECHE.esc(state.nick)}のお庭</div>
        </div>
        <div class="g-meta">
          <span class="g-stat">お店：<b>${RECHE.esc(HOUSE_NAMES[stage-1])}</b></span>
          <span class="g-stat">提出 <b>${done}</b></span>
          <span class="g-stat">おともだち <b>${got.length}</b>／${ANIMALS.length}</span>
        </div>
        <div class="g-hint">${hint}</div>
        <div class="dex-strip">${dex}</div>
      </div>`;
  }

  global.GARDEN = { render, unlockedAnimals, nextAnimal, ANIMALS, HOUSE_NAMES };
})(window);
