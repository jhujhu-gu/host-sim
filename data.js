/* =========================================================
   關主模擬器｜句子與題卡資料
   想修改句子：直接改這個檔案的 en（英文）和 zh（中文）。
   type: 'base' = ⭐ 基本句，'ext' = 💬 延伸句
   ========================================================= */

// 顏色（與手環配色卡、題卡背面一致）
const COLORS = {
  w: { hex: '#F5F0E6', en: 'white',  zh: '白' },
  r: { hex: '#E53935', en: 'red',    zh: '紅' },
  b: { hex: '#1E50C8', en: 'blue',   zh: '藍' },
  g: { hex: '#1B5E20', en: 'green',  zh: '綠' },
  y: { hex: '#FDD835', en: 'yellow', zh: '黃' },
  k: { hex: '#212121', en: 'black',  zh: '黑' },
  o: { hex: '#FB8C00', en: 'orange', zh: '橘' },
  n: { hex: '#9C6B45', en: 'brown',  zh: '咖啡' },
};

// 手環配色建議卡（每人一或兩色）
const BAND_CARDS = {
  4: ['rn', 'wo', 'ky', 'bg'],
  5: ['r', 'w', 'kb', 'go', 'yn'],
};

// 題卡（round: W 熱身 / 1 二色 / 2 三～四色 / 3 四～六色）
// say: 念品牌時的英文；alts: 也算對的說法
const CARDS = [
  { code: 'W-1', round: 'W', zh: '熊本北高中', say: 'Kumamoto Kita High School', alts: ['Kumamoto Kita', 'your school'], colors: 'wb', fact: 'Our friends from Kumamoto! Welcome to Zhong Li Commercial High School.' },
  { code: 'W-2', round: 'W', zh: '熊本熊', say: 'Kumamon', alts: ['Kumamoto'], colors: 'kwr', fact: 'Kumamon is the mascot of Kumamoto. His red cheeks are famous!' },
  { code: '1-1', round: '1', zh: 'OVAL 歐文', say: 'OVAL', alts: ['oval'], colors: 'wg', fact: "A Taiwanese stationery brand. Its correction tape is very popular, and it is today's prize!" },
  { code: '1-2', round: '1', zh: '龍情花生糖', say: 'Lung Ching', alts: ['Lung Ching peanut candy', 'Long Ching'], colors: 'rn', fact: 'A snack brand from Taoyuan. Its peanut candy is crunchy and not sticky.' },
  { code: '1-3', round: '1', zh: '三商巧福', say: 'Sansyou Koufuku', alts: ['San Shang Qiao Fu', 'Sanshang'], colors: 'wo', fact: 'A Taiwanese beef noodle restaurant chain. It also has a shop in Tokyo!' },
  { code: '1-4', round: '1', zh: 'IKEA 宜家家居', say: 'IKEA', alts: ['Ikea'], colors: 'by', fact: 'IKEA comes from Sweden. Blue and yellow are the colors of the Swedish flag.' },
  { code: '2-1', round: '2', zh: '全聯', say: 'PX Mart', alts: ['PX mart', 'P X Mart'], colors: 'wrb', fact: 'A supermarket chain. You can find it all over Taiwan.' },
  { code: '2-2', round: '2', zh: '台積電', say: 'TSMC', alts: ['T S M C', 'Taiwan Semiconductor'], colors: 'wrk', fact: 'A Taiwanese chip maker. It also has a factory in Kikuyo, Kumamoto!' },
  { code: '2-3', round: '2', zh: '7-ELEVEN', say: '7-Eleven', alts: ['Seven Eleven', '7 Eleven'], colors: 'rgo', fact: 'You can find 7-ELEVEN on almost every street in Taiwan.' },
  { code: '2-4', round: '2', zh: '喔熊', say: 'OhBear', alts: ['Oh Bear', 'O Bear'], colors: 'kwon', fact: 'Taiwan\'s tourism mascot. He is a Formosan black bear with a white "V" on his chest.' },
  { code: '3-1', round: '3', zh: '雄獅文具', say: 'SIMBALION', alts: ['Simba Lion', 'Simbalion'], colors: 'wryn', fact: 'An old Taiwanese stationery brand. Its mascot is a cute lion.' },
  { code: '3-2', round: '3', zh: '中壢高商', say: 'our school', alts: ['ZLCHS', 'Zhong Li Commercial High School', 'our school ZLCHS'], colors: 'kyrg', fact: "That's our school! Thank you for visiting us today." },
  { code: '3-3', round: '3', zh: '奧林匹克運動會', say: 'the Olympic Games', alts: ['the Olympics', 'Olympic Games', 'Olympics'], colors: 'bkryg', fact: 'The five rings stand for the five continents, united by sports.' },
  { code: '3-4', round: '3', zh: '唐吉訶德', say: 'Don Quijote', alts: ['Don Quixote', 'Donki', 'Don Don Donki'], colors: 'wrgkyb', fact: 'A Japanese discount store. People in Japan call it "Donki". In Taiwan, its shops are called DON DON DONKI.' },
];

// 固定句（關主 host／小幫手 helper）
// sec: 段落；sit: 情境說明（出現在題目上，不能洩漏答案）
const LINES = {
  // 01 開場與分組
  welcome:   { role: 'host', sec: '01 開場', type: 'base', en: 'Welcome to our game!', zh: '歡迎來玩我們的遊戲！', sit: '熊本北的小動物訪問團來到你的關卡了，先熱情地歡迎他們！' },
  havefun:   { role: 'host', sec: '01 開場', type: 'ext', en: "Let's have fun together!", zh: '我們一起玩得開心吧！', sit: '大家互相說完「よろしくお願いします」，接一句英文讓氣氛熱起來。' },
  playgame:  { role: 'host', sec: '01 開場', type: 'base', en: "Let's play a game!", zh: '我們來玩個遊戲吧！', sit: '告訴大家：我們要開始玩遊戲囉！' },
  teams:     { role: 'host', sec: '01 開場', type: 'base', en: 'This is Team A. This is Team B.', zh: '這邊是 A 隊，這邊是 B 隊。', sit: '分好兩邊了，指著左右兩群告訴他們隊名。' },
  // 02 手環
  helpers:   { role: 'host', sec: '02 手環', type: 'base', en: 'Our helpers will give you wristbands.', zh: '小幫手會發手環給你們。', sit: '接下來要戴手環。告訴大家：小幫手會發手環給他們。' },
  // 03 規則
  gamename:  { role: 'host', sec: '03 規則', type: 'base', en: 'This game is called Brand Color Challenge.', zh: '這個遊戲叫做品牌色彩挑戰。', sit: '開始說明規則。先介紹這個遊戲的名字。' },
  firstlook: { role: 'host', sec: '03 規則', type: 'base', en: 'First, look at the color board and remember the colors.', zh: '先看彩色觀察板，記住顏色。', sit: '說明第一步：先看彩色觀察板，把顏色記起來。' },
  thenbw:    { role: 'host', sec: '03 規則', type: 'base', en: 'Then, look at the black and white logo.', zh: '接著看黑白 Logo。', sit: '說明第二步：接著要看黑白的 Logo。' },
  tellhow:   { role: 'host', sec: '03 規則', type: 'base', en: 'I will tell you how many colors.', zh: '我會告訴你們有幾個顏色。', sit: '告訴大家：你會告訴他們這個 Logo 有幾個顏色。' },
  raisehand: { role: 'host', sec: '03 規則', type: 'base', en: 'Raise the hand with the matching color!', zh: '舉起戴有對應顏色的手！', sit: '說明作答方式：舉起戴著對應顏色手環的那隻手。' },
  onepoint:  { role: 'host', sec: '03 規則', type: 'base', en: 'One point for each correct color!', zh: '每答對一色得 1 分！', sit: '說明計分：每答對一個顏色可以得幾分？' },
  nominus:   { role: 'host', sec: '03 規則', type: 'base', en: 'No minus points!', zh: '錯了不扣分！', sit: '小熊有點緊張。告訴大家：答錯不會扣分！' },
  morewins:  { role: 'host', sec: '03 規則', type: 'base', en: 'The team with more points wins!', zh: '分數高的隊伍獲勝！', sit: '最後說明：怎樣才算贏？' },
  // 04 熱身
  practice:  { role: 'host', sec: '04 熱身', type: 'base', en: "Let's try one practice question!", zh: '我們先練習一題！', sit: '規則說完了，先帶大家練習一題。' },
  nopoints:  { role: 'host', sec: '04 熱身', type: 'base', en: 'No points for this one.', zh: '這題不計分。', sit: '提醒大家：這一題只是練習，不算分。' },
  // 05 觀察
  look20:    { role: 'host', sec: '05 觀察', type: 'base', en: 'Look at this board! You have 20 seconds!', zh: '請看觀察板！你們有 20 秒！', sit: '翻開彩色觀察板，告訴大家看板子，有 20 秒可以記。' },
  left10:    { role: 'host', sec: '05 觀察', type: 'base', en: '10 seconds left!', zh: '還有 10 秒！', sit: '沙漏過了一半，提醒大家剩下的時間。' },
  timesup:   { role: 'host', sec: '05 觀察', type: 'base', en: "Five, four, three, two, one! Time's up!", zh: '五、四、三、二、一！時間到！', sit: '最後 5 秒，帶大家倒數，然後宣布時間到。' },
  harder:    { role: 'host', sec: '05 觀察', type: 'ext', en: 'Next round is harder!', zh: '下一回合比較難喔！', sit: '這回合結束了，預告一下：下一回合會更難喔！' },
  // 06 出題
  sec10:     { role: 'host', sec: '06 出題', type: 'base', en: 'You have 10 seconds!', zh: '你們有 10 秒！', sit: '告訴大家作答時間有多長。' },
  keepup:    { role: 'host', sec: '06 出題', type: 'base', en: 'Three, two, one! Keep your hands up!', zh: '三、二、一！手先不要放下！', sit: '時間快到了，倒數三秒，請大家手先舉著不要放。' },
  toomany:   { role: 'host', sec: '06 出題', type: 'base', en: 'Too many! Put one down.', zh: '太多了！放下一個。', sit: '有一隊舉的手比顏色數多了一隻。請他們放下一隻。' },
  handsdown: { role: 'host', sec: '06 出題', type: 'base', en: 'OK! Hands down.', zh: '好！可以放下了。', sit: '你已經看清楚大家舉的顏色了，請大家把手放下。' },
  think:     { role: 'host', sec: '06 出題', type: 'ext', en: 'Think carefully!', zh: '仔細想想！', sit: '有幾隻小動物還在猶豫，提醒他們仔細想想。' },
  sure:      { role: 'host', sec: '06 出題', type: 'ext', en: 'Are you sure?', zh: '你們確定嗎？', sit: '狐狸舉手的速度超快，故意問一下：確定嗎？' },
  // 07 公布
  check:     { role: 'host', sec: '07 公布', type: 'base', en: "Let's check the answer!", zh: '我們來看答案！', sit: '準備翻開題卡背面，公布答案。' },
  goodjob:   { role: 'host', sec: '07 公布', type: 'ext', en: 'Good job!', zh: '做得好！', sit: '這題大家都答對了，稱讚他們！' },
  nicetry:   { role: 'host', sec: '07 公布', type: 'ext', en: 'Nice try!', zh: '可惜，不錯的嘗試！', sit: '這題有人答錯了，鼓勵一下。' },
  seenjapan: { role: 'host', sec: '07 公布', type: 'ext', en: 'Have you seen this in Japan?', zh: '你們在日本看過嗎？', sit: '這個品牌日本也有，問問他們在日本看過嗎？' },
  knowbrand: { role: 'host', sec: '07 公布', type: 'ext', en: 'Do you know this brand?', zh: '你們認識這個品牌嗎？', sit: '問問大家：認不認識這個品牌？' },
  // 08 計分
  close:     { role: 'host', sec: '08 計分', type: 'ext', en: "It's close!", zh: '好接近喔！', sit: '兩隊分數只差一點點！' },
  // 09 最終
  gameend:   { role: 'host', sec: '09 最終', type: 'base', en: "That's the end of the game!", zh: '遊戲結束！', sit: '三個回合都結束了，宣布遊戲結束。' },
  finalscore:{ role: 'host', sec: '09 最終', type: 'base', en: "Let's check the final score!", zh: '我們來看最後分數！', sit: '走到計分板旁，準備看最後的分數。' },
  tie:       { role: 'host', sec: '09 最終', type: 'base', en: "It's a tie!", zh: '平手！', sit: '兩隊分數一樣！宣布結果。' },
  onemore:   { role: 'host', sec: '09 最終', type: 'base', en: 'One more question!', zh: '再加賽一題！', sit: '平手要決勝負，宣布加賽一題。' },
  ready:     { role: 'host', sec: '09 最終', type: 'base', en: "Ready? Let's go!", zh: '準備好了嗎？開始！', sit: '加賽要開始了，問大家準備好了沒，然後開始！' },
  // 10 頒獎
  pencil:    { role: 'host', sec: '10 頒獎', type: 'base', en: 'Everyone gets a pencil case!', zh: '每個人都有一個筆袋！', sit: '拿出筆袋，告訴大家每個人都有一個。' },
  surprise:  { role: 'host', sec: '10 頒獎', type: 'base', en: 'The winning team gets a special surprise!', zh: '優勝隊伍還有特別驚喜！', sit: '拿出禮物盒：優勝的隊伍還有特別驚喜！' },
  congrats:  { role: 'host', sec: '10 頒獎', type: 'base', en: 'Congratulations!', zh: '恭喜！', sit: '優勝隊伍收到禮物了，恭喜他們！' },
  oval:      { role: 'host', sec: '10 頒獎', type: 'ext', en: 'This is from OVAL, a Taiwanese brand!', zh: '這是台灣品牌歐文的！', sit: '獎品是 OVAL 的立可帶。告訴他們這是台灣品牌 OVAL 的（呼應 1-1 題）。' },
  // 11 道別
  giveback:  { role: 'host', sec: '11 道別', type: 'base', en: 'Please give back the wristbands.', zh: '請把手環還給我們。', sit: '活動結束，請大家把手環還回籃子裡。' },
  thanks:    { role: 'host', sec: '11 道別', type: 'base', en: 'Thank you for playing with us!', zh: '謝謝你們一起玩！', sit: '謝謝大家來玩！' },
  happyhave: { role: 'host', sec: '11 道別', type: 'ext', en: "We're happy to have you here!", zh: '很高興你們來！', sit: '要請他們前往下一關了，告訴他們很高興他們來。' },
  enjoy:     { role: 'host', sec: '11 道別', type: 'base', en: 'Enjoy the rest of your visit!', zh: '祝你們接下來的參訪愉快！', sit: '揮手送他們去下一關，祝他們接下來參訪愉快。' },

  // ===== 小幫手 =====
  line:      { role: 'helper', sec: '排隊', type: 'base', en: 'Please stand in a line.', zh: '請排成一排。', sit: '這一隊圍成一團在看手環。請他們先排成一排。' },
  eachhand:  { role: 'helper', sec: '戴手環', type: 'base', en: 'One on each hand.', zh: '左右手各戴一個。', sit: '他拿著兩個手環，不知道要怎麼戴。告訴他左右手各戴一個。' },
  either:    { role: 'helper', sec: '戴手環', type: 'ext', en: 'Either hand is OK.', zh: '戴哪一手都可以。', sit: '他只有一個手環，問你要戴哪一手。告訴他哪一手都可以。' },
  remember:  { role: 'helper', sec: '戴手環', type: 'ext', en: 'Please remember your colors!', zh: '請記住你的顏色！', sit: '全隊都戴好了。提醒大家記住自己的顏色！' },
  choose:    { role: 'helper', sec: '狀況', type: 'ext', en: 'Please choose your colors together.', zh: '請大家一起決定誰戴哪些顏色。', sit: '這隊想自己分配顏色，請他們一起討論決定。' },
  lookcard:  { role: 'helper', sec: '狀況', type: 'ext', en: 'Look at the color card.', zh: '請看配色卡。', sit: '有人搞不清楚自己該戴哪個顏色。請他看配色卡。' },
};

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const NUM_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
