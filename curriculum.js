/* =====================================================================
   Re:che 30日間プログラム  カリキュラムデータ
   出典: 2月後半入会同期グループ LINE（Day1〜30）から抽出・再構成
   ---------------------------------------------------------------------
   各日のオブジェクト構造:
   {
     day:      Number   通し番号 1-30
     stage:    String   章（準備/数字/仕入れ/基礎/振り返り/出品WEEK/飛躍）
     voice:    String   今日のひとこと（毎朝のボイスメッセージ・テーマ）
     title:    String   課題タイトル（1通1アクション）
     detail:   String   やること（250-300字・小学生でもわかる粒度）
     type:     String   'submit'(テキスト/URL) | 'quiz' | 'calc' | 'report' | 'action'
     points:   Number   クリア基礎ポイント
     badge:    String|null  この日クリアで獲得するバッジ名
     quiz?:    Array    type==='quiz' のとき設問
     calc?:    Object   type==='calc' のとき計算機の定義
     report?:  Array    type==='report' のとき入力項目
   }
   ===================================================================== */

const RECHE_CURRICULUM = [
  /* ---------- STAGE 1 準備編（マインド×目標） ---------- */
  {
    day: 1, stage: "準備編", voice: "ようこそRe:cheへ",
    title: "いまのライフスタイルを書き出そう",
    detail: "まずは1週間のルーティン（平日・休日）を書き出します。起きる時間から寝るまでをざっくりでOK。その中から「メルカリにあてられそうな時間（すきま時間）」に印をつけてみましょう。所要時間：約15分。",
    type: "submit", points: 100, badge: null,
    placeholder: "例）平日 6:00起床 / 通勤7:30〜8:00 / 21:30〜22:00 がすきま時間…"
  },
  {
    day: 2, stage: "準備編", voice: "理想の人生を追求する",
    title: "出品作業の時間を割りあてよう",
    detail: "昨日のスケジュールを見ながら、出品作業を入れる時間を決めます。作業は「①撮影・加工 ②商品リサーチ ③タイトル・説明文作成 ④出品」。すきま時間にどれを入れるか、1日のどこでやるかを書き出しましょう。所要時間：約10分。",
    type: "submit", points: 100, badge: null,
    placeholder: "例）通勤中=リサーチ / 昼休み=加工 / 夜22:00=出品 …"
  },
  {
    day: 3, stage: "準備編", voice: "与える人である",
    title: "目標金額と目的を決めよう",
    detail: "「何のために・いくら欲しいか」を具体的に書きます。①目的（例：習い事代/自分へのご褒美/繰上げ返済）②必要な金額 ③そのために断つムダ遣い。ふわっとではなく数字で。例）習い事2万＋自己投資3万＝月5万の利益目標。所要時間：約10分。",
    type: "submit", points: 120, badge: "はじめの一歩",
    placeholder: "例）目的=◯◯ / 月の利益目標=50,000円 / 断つもの=◯◯ …"
  },

  /* ---------- STAGE 2 数字編 ---------- */
  {
    day: 4, stage: "数字編", voice: "素直誠実である",
    title: "販売率と利益率クイズ（全3問）",
    detail: "数字を味方にする回。販売率＝販売数÷出品数×100。利益率＝利益額÷売上額×100。下の3問に答えてね。電卓OK！全問正解でボーナスポイント。",
    type: "quiz", points: 150, badge: "数字に強い",
    quiz: [
      {
        q: "A子さんは月17万円が利益目標。在庫20万円分を何%の利益率で売ればいい？",
        unit: "%", answer: 85, tolerance: 1,
        hint: "利益率 = 目標利益 ÷ 在庫(売上) × 100",
        solution: "17万 ÷ 20万 × 100 ＝ 85%"
      },
      {
        q: "B男さんは毎日9品ずつ30日出品し、98品売れました。販売率は何%？（小数第1位）",
        unit: "%", answer: 36.3, tolerance: 1.0,
        hint: "販売率 = 販売数 ÷ 出品数 × 100（出品数は 9×30）",
        solution: "98 ÷ 270 × 100 ＝ 約36.3%"
      },
      {
        q: "目標利益17万円・利益率50%のとき、必要な売上は何万円？",
        unit: "万円", answer: 34, tolerance: 1,
        hint: "売上 = 利益 ÷ 利益率 × 100",
        solution: "17万 ÷ 50 × 100 ＝ 34万円"
      }
    ]
  },

  /* ---------- STAGE 3 仕入れ編 ---------- */
  {
    day: 5, stage: "仕入れ編", voice: "行動の基準値を上げる",
    title: "仕入れをしてみよう（スマセル登録）",
    detail: "まずは不用品からでOK。仕入れの第一歩として、仕入れサイトに会員登録します。登録できたら「登録済み」にチェック。すでに不用品がある人は、それを出品準備に回しましょう。所要時間：約10分。",
    type: "action", points: 120, badge: null,
    checklabel: "仕入れサイトに登録できた／不用品を出品準備した"
  },
  {
    day: 6, stage: "数字編", voice: "僻まない",
    title: "必要な出品数を計算しよう",
    detail: "目標から逆算します。下の計算機に「月の目標利益・利益率・1品の平均単価」を入れると、必要な出品総額と1日あたりの出品数が出ます。出た数字を心に留めて出品していきましょう。",
    type: "calc", points: 150, badge: null,
    calc: {
      inputs: [
        { key: "profit", label: "月の目標利益", unit: "円", value: 50000 },
        { key: "rate",   label: "利益率",       unit: "%", value: 40 },
        { key: "price",  label: "1品の平均販売単価", unit: "円", value: 1500 }
      ],
      // 出品総額 = 目標利益 ÷ 利益率 ; 1日出品数 = 出品総額 ÷ 30 ÷ 平均単価
      outputs: [
        { label: "必要な出品総額（目安）", formula: "profit / (rate/100)", unit: "円" },
        { label: "1日あたりの出品数（30日）", formula: "(profit / (rate/100)) / 30 / price", unit: "品", ceil: true }
      ]
    }
  },

  /* ---------- STAGE 4 出品の基礎 ---------- */
  {
    day: 7, stage: "基礎編", voice: "モチベーションの保ち方",
    title: "プロフィールを作ろう",
    detail: "アカウントの「お顔」＝プロフィールを整えます。①あいさつ ②取引のスタンス ③発送・返品/キャンセル対応 ④喫煙/ペットの有無。冒頭1〜2行に安心ワードを。完成したらプロフィールURLを貼って提出。所要時間：約15分。",
    type: "submit", points: 120, badge: "お店オープン",
    placeholder: "プロフィールURL（例：https://jp.mercari.com/user/profile/…）"
  },
  {
    day: 8, stage: "基礎編", voice: "スクールの歩き方",
    title: "出品にかかる時間を計ろう①",
    detail: "実際に商品を出品し、1品にかかった時間（撮影〜加工〜リサーチ〜説明文〜出品まで）を計ります。完璧を目指さず、まず出すのが大事。1品の平均時間を提出しましょう。",
    type: "submit", points: 120, badge: null,
    placeholder: "例）1品あたり 約40分（撮影10/加工10/リサーチ10/説明文10）"
  },
  {
    day: 9, stage: "基礎編", voice: "質問の仕方",
    title: "出品にかかる時間を計ろう②",
    detail: "昨日の続き。今日も出品して、1品あたりの平均出品時間を提出します。繰り返すほどスピードは上がります。昨日との差も書いてみてね。",
    type: "submit", points: 120, badge: null,
    placeholder: "例）1品あたり 約30分（昨日より10分短縮）"
  },
  {
    day: 10, stage: "基礎編", voice: "価値観を変えないと結果は変わらない",
    title: "1時間で何品出せるかチャレンジ",
    detail: "タイマーを1時間にセット！その中で何品出品できるかに挑戦します。スピードを知ると、次に進む目安になります。出せた品数を提出してね。",
    type: "submit", points: 150, badge: "スピードアップ",
    placeholder: "例）1時間で 3品 出品できた！"
  },
  {
    day: 11, stage: "基礎編", voice: "頭を使おう",
    title: "在庫管理表を作ってみよう",
    detail: "売上管理と在庫管理は別もの。①商品が探しやすい ②売れ残りが防げる ③次の仕入れ計画が立つ。配布テンプレをコピーして、今ある仕入れ品・不用品を記入してみましょう。まずは作るのが目標。",
    type: "action", points: 120, badge: null,
    checklabel: "在庫管理表テンプレをコピーして記入を始めた"
  },
  {
    day: 12, stage: "基礎編", voice: "応援される人になる",
    title: "在庫管理表を提出（添削あり）",
    detail: "在庫管理表を仕上げて提出します。チェック：予想売価はリサーチ済み？／販売価格は売れた額？／仕入れ値・出品中の商品も記入した？ できたらスプレッドシートURLを貼ってね。本日中の提出が添削対象。",
    type: "submit", points: 150, badge: "在庫マスター",
    placeholder: "在庫管理表のURL（Googleスプレッドシート）"
  },
  {
    day: 13, stage: "基礎編", voice: "誰のために頑張るのか？動機を沢山作ろう",
    title: "在庫のトータル金額を計算",
    detail: "①在庫の仕入れ原価トータル（出品中も含む。不用品は0円でOK）②メルカリで販売中の商品トータル金額。この2つを出すと、資産と売上予想が見えます。下に2つの金額を入力。",
    type: "report", points: 150, badge: null,
    report: [
      { key: "stockCost", label: "在庫の原価トータル", unit: "円" },
      { key: "listing",   label: "販売中商品のトータル", unit: "円" }
    ]
  },

  /* ---------- STAGE 5 振り返り＆改善 ---------- */
  {
    day: 14, stage: "振り返り編", voice: "ぬるま湯は人をダメにする",
    title: "中間報告（数字を出す）",
    detail: "ここまでの数字を棚卸し。売上・利益・出品数・販売数を入れると、利益率・販売率・平均単価が自動で出ます。現状を正確に掴むのが次の一手の地図になります。",
    type: "report", points: 200, badge: "折り返し地点",
    report: [
      { key: "sales",  label: "売上額", unit: "円" },
      { key: "profit", label: "利益額", unit: "円" },
      { key: "listed", label: "出品数", unit: "品" },
      { key: "sold",   label: "販売数", unit: "品" }
    ],
    auto: [
      { label: "利益率", formula: "profit / sales * 100", unit: "%" },
      { label: "販売率", formula: "sold / listed * 100", unit: "%" },
      { label: "平均出品単価", formula: "sales / sold", unit: "円" }
    ]
  },
  {
    day: 15, stage: "振り返り編", voice: "ごめんなさいではなく、ありがとうを",
    title: "自分の課題と改善点を上げる",
    detail: "11〜14日の数字から、いま詰まっている所を言葉に。よくあるのは「出品数が足りない」「出品金額が少ない」「在庫が足りない」。目標とのギャップを見て、課題と改善策を1つ提出しましょう。",
    type: "submit", points: 150, badge: null,
    placeholder: "例）課題=出品数が足りない / 改善=リサーチを10分に短縮し1日3品出す"
  },
  {
    day: 16, stage: "振り返り編", voice: "感情ではなく数字で語ろう",
    title: "数字に強くなる勉強会（アウトプット）",
    detail: "配布の勉強会動画を見て、①気づいたこと ②明日から実践すること を書きます。数字を知れば売上が見え、数字を使えば未来が変わる。学びを言葉にして提出してね。",
    type: "submit", points: 150, badge: null,
    placeholder: "気づき：… ／ 明日からやること：…"
  },
  {
    day: 17, stage: "基礎編", voice: "不安の正体",
    title: "出品の基本作業を身につける",
    detail: "配布の「基本の作業項目」を確認しながら、商品ページを1つ作ります。写真・タイトル・説明文・価格の流れを、手順どおりに。明日の提出に向けた練習です。",
    type: "action", points: 120, badge: null,
    checklabel: "基本作業項目を見ながら商品ページを1つ作った"
  },
  {
    day: 18, stage: "基礎編", voice: "成長曲線",
    title: "商品ページを提出（添削あり）",
    detail: "「1番高く売れた／1番高い金額で出品中」の商品ページURLと、閲覧数・いいね数・検索数の3つを提出。写真→タイトル→説明文→価格の順でブラッシュアップしていきます。本日中の提出が添削対象。",
    type: "submit", points: 180, badge: "出品の型",
    placeholder: "商品URL ／ 閲覧数◯ いいね◯ 検索数◯"
  },

  /* ---------- STAGE 6 出品WEEK（7日チャレンジ） ---------- */
  {
    day: 19, stage: "出品WEEK", voice: "感謝の威力",
    title: "出品WEEK 1日目｜準備8割",
    detail: "1週間で30品チャレンジ開始！カギは準備8割・行動2割。①今週のスケジュール確認 ②1日どの時間を出品にあてるか ③出品する商品候補をストック。今日の出品数も記録してね。",
    type: "submit", points: 150, badge: "出品WEEK突入",
    placeholder: "今日の出品数◯品／累計◯品／気づき…"
  },
  {
    day: 20, stage: "出品WEEK", voice: "当たり前の事を異常値でやれ",
    title: "出品WEEK 2日目｜写真で9割",
    detail: "今日のテーマは写真。1枚目（トップ画像）で印象が決まります。明るさ・背景・角度・映りを意識。「欲しい！」と思える1枚を。今日の出品数を記録して提出。",
    type: "submit", points: 150, badge: null,
    placeholder: "今日の出品数◯品／累計◯品／写真の工夫…"
  },
  {
    day: 21, stage: "出品WEEK", voice: "リフレーミング",
    title: "出品WEEK 3日目｜タイトル&説明文",
    detail: "検索に引っかかるキーワードを。タイトルは40文字を埋める意識で（ブランド・サイズ・色・状態）。説明文はシンプルで親切に。今日の出品数を記録して提出。",
    type: "submit", points: 150, badge: null,
    placeholder: "今日の出品数◯品／累計◯品／使ったキーワード…"
  },
  {
    day: 22, stage: "出品WEEK", voice: "アソシエイト、ディソシエイト",
    title: "出品WEEK 4日目｜価格は戦略",
    detail: "相場をリサーチし、利益を残しつつ売れる価格帯に。値下げ交渉を想定して少し上から設定するのもコツ。今日の出品数を記録して提出。",
    type: "submit", points: 150, badge: null,
    placeholder: "今日の出品数◯品／累計◯品／価格の根拠…"
  },
  {
    day: 23, stage: "出品WEEK", voice: "正しい努力をすること",
    title: "出品WEEK 5日目｜一軍・二軍",
    detail: "一軍＝利益が見込める/季節物/人気/きれいな商品。二軍＝回転重視・在庫整理向け。毎日全部に全力ではなくバランスを。今日の出品数を記録して提出。",
    type: "submit", points: 150, badge: null,
    placeholder: "今日の出品数◯品／累計◯品／一軍・二軍の振り分け…"
  },
  {
    day: 24, stage: "出品WEEK", voice: "負け癖をつけるな",
    title: "出品WEEK 6日目｜70点で出す",
    detail: "完璧主義で止まらないこと。70%の出来でOK、まず出す。1つでも前進すれば昨日の自分を超えています。今日の出品数を記録して提出。",
    type: "submit", points: 150, badge: null,
    placeholder: "今日の出品数◯品／累計◯品／今日の前進…"
  },
  {
    day: 25, stage: "出品WEEK", voice: "全て自己責任である",
    title: "出品WEEK 7日目｜ラストスパート",
    detail: "いよいよ最終日！一軍・二軍のバランスを意識して出し切ろう。1週間の合計出品数を振り返って提出。走り切った自分をねぎらってね。",
    type: "submit", points: 200, badge: "30品チャレンジ完走",
    placeholder: "1週間の合計出品数◯品／やり切った感想…"
  },
  {
    day: 26, stage: "出品WEEK", voice: "テクニックに頼るな",
    title: "出品WEEKを振り返る",
    detail: "1週間の結果を数字で確認。①出品できた数 ②売れた数 ③気づいた勝ちパターン。続けられる仕組み（出品の習慣化）を1つ決めて提出しましょう。",
    type: "submit", points: 150, badge: null,
    placeholder: "出品◯／販売◯／勝ちパターン…／続ける仕組み…"
  },

  /* ---------- STAGE 7 飛躍編 ---------- */
  {
    day: 27, stage: "飛躍編", voice: "多面的に考える",
    title: "勉強会のアウトプット",
    detail: "配布動画を見て、①気づき ②明日から実践すること を提出。一つひとつの作業を「ムダなく・流れで」。学びを行動に変えるのが飛躍の入口です。",
    type: "submit", points: 150, badge: null,
    placeholder: "気づき：… ／ 明日からやること：…"
  },
  {
    day: 28, stage: "飛躍編", voice: "whyからはじめよ",
    title: "月報を出す（数字＋3ヶ月計画）",
    detail: "1ヶ月の振り返り。売上・利益・利益率・出品数・販売数を入れて、できたこと/できなかったことを言葉に。さらに3ヶ月後のマイルストーンを1ヶ月ごとに書きましょう。",
    type: "report", points: 220, badge: "1ヶ月完走",
    report: [
      { key: "sales",  label: "今月の売上額", unit: "円" },
      { key: "profit", label: "今月の利益額", unit: "円" },
      { key: "listed", label: "今月の出品数", unit: "品" },
      { key: "sold",   label: "今月の販売数", unit: "品" }
    ],
    auto: [
      { label: "利益率", formula: "profit / sales * 100", unit: "%" },
      { label: "販売率", formula: "sold / listed * 100", unit: "%" }
    ]
  },
  {
    day: 29, stage: "飛躍編", voice: "事実と感情を切り分けよう",
    title: "成果を記録して提出",
    detail: "月報フォームに沿って数字を提出します。予定（行動）と成果（数字）を結びつけて見ると、次の改善点がクリアに。毎月の振り返りが、卒業後も伸び続ける自走力になります。",
    type: "submit", points: 150, badge: null,
    placeholder: "提出メモ：今月の振り返り・来月の目標…"
  },
  {
    day: 30, stage: "飛躍編", voice: "Re:cheで活躍する為に",
    title: "卒業｜次の一歩を宣言",
    detail: "30日間、本当におつかれさま！基礎の力はしっかり身につきました。最後に「次の3ヶ月で達成したい目標」を具体的に宣言しましょう。書き出すほど、現実になります。ここからが本番です。",
    type: "submit", points: 300, badge: "Re:che 30DAYS 完走",
    placeholder: "次の3ヶ月の目標：… ／ そのための行動：…"
  }
];

/* バッジ定義（順序＝表示順） */
const RECHE_BADGES = [
  { id: "はじめの一歩",        day: 3,  desc: "目標と目的を決めた" },
  { id: "数字に強い",          day: 4,  desc: "販売率・利益率クイズに挑戦" },
  { id: "お店オープン",        day: 7,  desc: "プロフィールが完成" },
  { id: "スピードアップ",      day: 10, desc: "1時間出品チャレンジ達成" },
  { id: "在庫マスター",        day: 12, desc: "在庫管理表を提出" },
  { id: "折り返し地点",        day: 14, desc: "中間報告を完了" },
  { id: "出品の型",            day: 18, desc: "商品ページを提出" },
  { id: "出品WEEK突入",        day: 19, desc: "30品チャレンジ開始" },
  { id: "30品チャレンジ完走",  day: 25, desc: "出品WEEKを走り切った" },
  { id: "1ヶ月完走",           day: 28, desc: "月報を提出" },
  { id: "Re:che 30DAYS 完走",  day: 30, desc: "30日プログラム卒業" }
];

/* レベル（リッシュランク）しきい値：累計ポイント */
const RECHE_LEVELS = [
  { lv: 1, name: "かけだしセラー",   min: 0 },
  { lv: 2, name: "コツコツセラー",   min: 400 },
  { lv: 3, name: "リサーチャー",     min: 900 },
  { lv: 4, name: "出品マイスター",   min: 1600 },
  { lv: 5, name: "数字マスター",     min: 2400 },
  { lv: 6, name: "Re:che セラー",    min: 3400 }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { RECHE_CURRICULUM, RECHE_BADGES, RECHE_LEVELS };
}
