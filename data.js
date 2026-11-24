/* =========================================================
   關主模擬器｜句子與題卡資料（合併版）
   想修改句子：直接改這個檔案。
   en：建議台詞　zh：中文　alts：也算對的其他說法
   type: 'base' = 基本句，'ext' = 延伸句
   sit：練習時出現的情境說明（不能洩漏答案）
   ========================================================= */

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

const BAND_CARDS = {
  4: ['rn', 'wo', 'ky', 'bg'],
  5: ['r', 'w', 'kb', 'go', 'yn'],
};

// origin: tw 台灣品牌／jp 日本品牌（用在 "It's a Taiwanese brand." 這類句子）
const CARDS = [
  { code: 'W-1', round: 'W', zh: '熊本北高中', say: 'Kumamoto Kita High School', alts: ['Kumamoto Kita', 'your school'], colors: 'wb', fact: 'Our friends from Kumamoto! Welcome to Zhong Li Commercial High School.' },
  { code: 'W-2', round: 'W', zh: '熊本熊', say: 'Kumamon', alts: ['Kumamoto'], colors: 'kwr', fact: 'Kumamon is the mascot of Kumamoto. His red cheeks are famous!' },
  { code: '1-1', round: '1', zh: 'OVAL 歐文', say: 'OVAL', alts: ['oval'], colors: 'wg', origin: 'tw', fact: "A Taiwanese stationery brand. Its correction tape is very popular, and it is today's prize!" },
  { code: '1-2', round: '1', zh: '龍情花生糖', say: 'Lung Ching', alts: ['Lung Ching peanut candy', 'Long Ching'], colors: 'rn', origin: 'tw', fact: 'A snack brand from Taoyuan. Its peanut candy is crunchy and not sticky.' },
  { code: '1-3', round: '1', zh: '三商巧福', say: 'Sansyou Koufuku', alts: ['San Shang Qiao Fu', 'Sanshang'], colors: 'wo', origin: 'tw', fact: 'A Taiwanese beef noodle restaurant chain. It also has a shop in Tokyo!' },
  { code: '1-4', round: '1', zh: 'IKEA 宜家家居', say: 'IKEA', alts: ['Ikea'], colors: 'by', fact: 'IKEA comes from Sweden. Blue and yellow are the colors of the Swedish flag.' },
  { code: '2-1', round: '2', zh: '全聯', say: 'PX Mart', alts: ['PX mart', 'P X Mart'], colors: 'wrb', origin: 'tw', fact: 'A popular supermarket chain. You can find it all over Taiwan.' },
  { code: '2-2', round: '2', zh: '台積電', say: 'TSMC', alts: ['T S M C', 'Taiwan Semiconductor'], colors: 'wrk', origin: 'tw', fact: 'A Taiwanese chip maker. It also has a factory in Kikuyo, Kumamoto!' },
  { code: '2-3', round: '2', zh: '7-ELEVEN', say: '7-Eleven', alts: ['Seven Eleven', '7 Eleven'], colors: 'rgo', fact: 'You can find 7-ELEVEN on almost every street in Taiwan.' },
  { code: '2-4', round: '2', zh: '喔熊', say: 'OhBear', alts: ['Oh Bear', 'O Bear'], colors: 'kwon', origin: 'tw', fact: 'Taiwan\'s tourism mascot. He is a Formosan black bear with a white "V" on his chest.' },
  { code: '3-1', round: '3', zh: '雄獅文具', say: 'SIMBALION', alts: ['Simba Lion', 'Simbalion'], colors: 'wryn', origin: 'tw', fact: 'An old Taiwanese stationery brand. Its mascot is a cute lion.' },
  { code: '3-2', round: '3', zh: '中壢高商', say: 'our school', alts: ['ZLCHS', 'Zhong Li Commercial High School', 'our school ZLCHS'], colors: 'kyrg', fact: "That's our school! Thank you for visiting us today." },
  { code: '3-3', round: '3', zh: '奧林匹克運動會', say: 'the Olympic Games', alts: ['the Olympics', 'Olympic Games', 'Olympics'], colors: 'bkryg', fact: 'The five rings stand for the five continents, united by sports.' },
  { code: '3-4', round: '3', zh: '唐吉訶德', say: 'Don Quijote', alts: ['Don Quixote', 'Donki', 'Don Don Donki'], colors: 'wrgkyb', origin: 'jp', fact: 'A Japanese discount store. People in Japan call it "Donki". In Taiwan, its shops are called DON DON DONKI.' },
];

const LINES = {
  // ===== 01 開場與分組 =====
  hello:     { role: 'host', sec: '01 開場', type: 'base', en: 'Hello, everyone!', zh: '大家好！', sit: '熊本北的小動物訪問團走到你的攤位前了，先跟大家打招呼。' },
  welcome:   { role: 'host', sec: '01 開場', type: 'base', en: 'Welcome to our game!', zh: '歡迎來玩我們的遊戲！', alts: ['Welcome to the Brand Color Challenge!'], sit: '他們來到你的關卡了，熱情地歡迎他們！' },
  havefun:   { role: 'host', sec: '01 開場', type: 'ext', en: "Let's have fun together!", zh: '我們一起玩得開心吧！', alts: ["Let's have some fun!"], sit: '大家互相說完「よろしくお願いします」，接一句英文讓氣氛熱起來。' },
  playgame:  { role: 'host', sec: '01 開場', type: 'base', en: "Let's play a game!", zh: '我們來玩個遊戲吧！', sit: '告訴大家：我們要開始玩遊戲囉！' },
  maketeams: { role: 'host', sec: '01 開場', type: 'base', en: "Let's make two teams.", zh: '我們來分成兩隊。', sit: '要開始分組了，先告訴大家要分成兩隊。' },
  teams:     { role: 'host', sec: '01 開場', type: 'base', en: 'This is Team A. This is Team B.', zh: '這邊是 A 隊，這邊是 B 隊。', alts: ["You're Team A. And you're Team B.", "You're Team A, and you're Team B."], sit: '分好兩邊了，指著左右兩群告訴他們隊名。' },

  // ===== 02 手環 =====
  helpers:   { role: 'host', sec: '02 手環', type: 'base', en: 'Our helpers will give you wristbands.', zh: '小幫手會發手環給你們。', sit: '接下來要戴手環。告訴大家：小幫手會發手環給他們。' },
  ready:     { role: 'host', sec: '02 手環', type: 'base', en: 'Is everyone ready?', zh: '大家都準備好了嗎？', sit: '小幫手發完手環了，問大家準備好了沒。' },
  line:      { role: 'helper', sec: '02 手環', type: 'base', en: 'Please stand in a line.', zh: '請排成一排。', sit: '這一隊圍成一團在看手環。請他們先排成一排。' },
  eachhand:  { role: 'helper', sec: '02 手環', type: 'base', en: 'One on each hand.', zh: '左右手各戴一個。', alts: ['One on each wrist.'], sit: '他拿著兩個手環，不知道要怎麼戴。告訴他左右手各戴一個。' },
  either:    { role: 'helper', sec: '02 手環', type: 'ext', en: 'Either hand is OK.', zh: '戴哪一手都可以。', alts: ['Either wrist is fine.', 'Either hand is fine.'], sit: '他只有一個手環，問你要戴哪一手。告訴他哪一手都可以。' },
  remember:  { role: 'helper', sec: '02 手環', type: 'ext', en: 'Please remember your colors!', zh: '請記住你的顏色！', alts: ['Remember your colors!'], sit: '全隊都戴好了。提醒大家記住自己的顏色！' },
  choose:    { role: 'helper', sec: '02 手環', type: 'ext', en: 'Please choose your colors together.', zh: '請大家一起決定誰戴哪些顏色。', sit: '這隊想自己分配顏色，請他們一起討論決定。' },
  lookcard:  { role: 'helper', sec: '02 手環', type: 'ext', en: 'Look at the color card.', zh: '請看配色卡。', sit: '有人搞不清楚自己該戴哪個顏色。請他看配色卡。' },

  // ===== 03 規則 =====
  showhow:   { role: 'host', sec: '03 規則', type: 'base', en: 'OK! Let me show you how to play.', zh: '好！我來示範怎麼玩。', sit: '準備開始說明規則，先告訴大家你要示範怎麼玩。' },
  gamename:  { role: 'host', sec: '03 規則', type: 'ext', en: 'This game is called Brand Color Challenge.', zh: '這個遊戲叫做品牌色彩挑戰。', sit: '介紹這個遊戲的名字。' },
  firstlook: { role: 'host', sec: '03 規則', type: 'base', en: 'First, look at the color board and remember the colors.', zh: '先看彩色觀察板，記住顏色。', alts: ['First, look at these logos. Try to remember their colors.', 'First, look at these logos and remember their colors.'], sit: '指著彩色觀察板，說明第一步：先看板子上的 Logo，把顏色記起來。' },
  have20:    { role: 'host', sec: '03 規則', type: 'base', en: 'You have twenty seconds.', zh: '你們有 20 秒。', alts: ['You have 20 seconds.'], sit: '比出計時的手勢，說明觀察時間有多長。' },
  thenbw:    { role: 'host', sec: '03 規則', type: 'base', en: 'Then, look at the black and white logo.', zh: '接著看黑白 Logo。', alts: ["Then, I'll show you a black-and-white logo.", "Then, I'll show you a black and white logo."], sit: '拿起黑白題卡，說明第二步：接著要看黑白的 Logo。' },
  tellhow:   { role: 'host', sec: '03 規則', type: 'base', en: 'I will tell you how many colors.', zh: '我會告訴你們有幾個顏色。', alts: ["I'll tell you how many colors there are."], sit: '比出數字，告訴大家：你會告訴他們這個 Logo 有幾個顏色。' },
  raisehand: { role: 'host', sec: '03 規則', type: 'base', en: 'Raise the hand with the matching color!', zh: '舉起戴有對應顏色的手！', alts: ['Raise your hands to show the right colors.'], sit: '示範舉手，說明作答方式：舉起戴著對應顏色手環的手。' },
  bothhands: { role: 'host', sec: '03 規則', type: 'base', en: 'You can raise both hands if both colors are correct.', zh: '如果兩個顏色都正確，可以舉雙手。', sit: '示範舉雙手：如果自己兩個手環的顏色都對，可以兩手都舉。' },
  example:   { role: 'host', sec: '03 規則', type: 'ext', en: 'For example, if the logo has two colors, each team can raise up to two hands.', zh: '例如，如果 Logo 有兩個顏色，每隊最多可以舉兩隻手。', sit: '舉個例子說明舉手的數量限制：兩個顏色的 Logo，每隊最多舉兩隻手。' },
  have10:    { role: 'host', sec: '03 規則', type: 'base', en: 'You have ten seconds to answer.', zh: '你們有 10 秒作答。', alts: ['You have 10 seconds to answer.'], sit: '說明作答時間有多長。' },
  whitecounts:{ role: 'host', sec: '03 規則', type: 'base', en: 'White counts, too!', zh: '白色也算喔！', sit: '指著白色手環提醒大家：白色也算一個顏色！' },
  onepoint:  { role: 'host', sec: '03 規則', type: 'base', en: 'One point for each correct color!', zh: '每答對一色得 1 分！', sit: '指著計分板說明計分：每答對一個顏色可以得幾分？' },
  nominus:   { role: 'host', sec: '03 規則', type: 'base', en: 'No minus points!', zh: '錯了不扣分！', alts: ['No points off for wrong answers.', "Don't worry about mistakes!"], sit: '小熊有點緊張。搖搖手告訴大家：答錯不會扣分！' },
  morewins:  { role: 'host', sec: '03 規則', type: 'base', en: 'The team with more points wins!', zh: '分數高的隊伍獲勝！', sit: '指著兩隊說明：怎樣才算贏？' },
  teamwork:  { role: 'host', sec: '03 規則', type: 'ext', en: 'Work together as a team!', zh: '大家要一起合作喔！', sit: '規則說完了，鼓勵大家要團隊合作。' },

  // ===== 04 熱身 =====
  practice:  { role: 'host', sec: '04 熱身', type: 'base', en: "Let's try one practice question!", zh: '我們先練習一題！', alts: ["Let's practice first!"], sit: '規則說完了，先帶大家練習一題。' },
  justpractice:{ role: 'host', sec: '04 熱身', type: 'ext', en: 'This one is just for practice.', zh: '這題只是練習。', sit: '強調一下：這題只是練習而已。' },
  nopoints:  { role: 'host', sec: '04 熱身', type: 'base', en: 'No points for this one.', zh: '這題不計分。', sit: '提醒大家：這一題不算分。' },
  herepractice:{ role: 'host', sec: '04 熱身', type: 'ext', en: "Ready? Here's your first practice question!", zh: '準備好了嗎？這是練習題！', sit: '觀察時間結束，拿出練習題的題卡。' },
  knowlogo:  { role: 'host', sec: '04 熱身', type: 'ext', en: 'Do you know this logo?', zh: '你們認識這個 Logo 嗎？', alts: ['Does this look familiar?'], sit: '這個 Logo 他們應該很熟，問問看認不認識。' },
  yourschool:{ role: 'host', sec: '04 熱身', type: 'ext', en: "It's your school logo!", zh: '是你們學校的 Logo！', sit: '答案揭曉：是熊本北高中的校徽！告訴他們。', card: 'W-1' },
  kumamon:   { role: 'host', sec: '04 熱身', type: 'ext', en: "It's Kumamon! You all know Kumamon, right?", zh: '是熊本熊！你們都認識熊本熊，對吧？', alts: ["It's Kumamon!"], sit: '答案揭曉：是熊本熊！跟大家確認一下他們都認識。', card: 'W-2' },
  easy:      { role: 'host', sec: '04 熱身', type: 'ext', en: 'That was easy, right?', zh: '很簡單，對吧？', sit: '大家都答對了熱身題，輕鬆地問一句：很簡單吧？' },
  realgame:  { role: 'host', sec: '04 熱身', type: 'base', en: "Great! Now let's start the real game!", zh: '很棒！現在正式開始遊戲！', alts: ["Now let's start the real game!"], sit: '熱身結束，宣布正式開始遊戲！' },

  // ===== 05 回合與觀察 =====
  harder:    { role: 'host', sec: '05 觀察', type: 'ext', en: 'Next round is harder!', zh: '下一回合比較難喔！', alts: ["It's getting harder!", 'The next round is a little harder!'], sit: '這回合結束了，預告一下：下一回合會更難喔！' },
  hardest:   { role: 'host', sec: '05 觀察', type: 'ext', en: 'This is the hardest round!', zh: '這是最難的一回合！', sit: '第三回合開始了，強調這是最難的一回合。' },
  finalround:{ role: 'host', sec: '05 觀察', type: 'ext', en: 'Are you ready for the final round?', zh: '準備好迎接最後一回合了嗎？', sit: '要進入最後一個回合了，問大家準備好了沒。' },
  look20:    { role: 'host', sec: '05 觀察', type: 'base', en: 'Look at this board! You have 20 seconds!', zh: '請看觀察板！你們有 20 秒！', alts: ['Look at these logos! You have twenty seconds.', 'Look at these logos! You have 20 seconds.'], sit: '翻開彩色觀察板，告訴大家看板子，有 20 秒可以記。' },
  lookcarefully:{ role: 'host', sec: '05 觀察', type: 'ext', en: 'Look carefully! Remember the colors!', zh: '仔細看喔！記住這些顏色！', alts: ['Look carefully!', 'Remember the colors!'], sit: '大家正在看觀察板，提醒他們仔細看、記住顏色。' },
  left10:    { role: 'host', sec: '05 觀察', type: 'base', en: '10 seconds left!', zh: '還有 10 秒！', alts: ['Ten seconds left!'], sit: '沙漏過了一半，提醒大家剩下的時間。' },
  timesup:   { role: 'host', sec: '05 觀察', type: 'base', en: "Five, four, three, two, one! Time's up!", zh: '五、四、三、二、一！時間到！', sit: '最後 5 秒，帶大家倒數，然後宣布時間到。' },
  readygo:   { role: 'host', sec: '05 觀察', type: 'ext', en: "Are you ready? Let's go!", zh: '準備好了嗎？開始吧！', sit: '收起觀察板，準備出題了，問大家準備好了沒，然後開始！' },

  // ===== 06 出題與作答 =====
  sec10:     { role: 'host', sec: '06 出題', type: 'base', en: 'You have 10 seconds!', zh: '你們有 10 秒！', alts: ['You have ten seconds.', 'You have ten seconds!'], sit: '告訴大家作答時間有多長。' },
  readygo2:  { role: 'host', sec: '06 出題', type: 'base', en: 'Ready? Go!', zh: '準備好了嗎？開始！', sit: '題目說明完了，喊一聲開始作答！' },
  keepup:    { role: 'host', sec: '06 出題', type: 'base', en: 'Three, two, one! Keep your hands up!', zh: '三、二、一！手先不要放下！', alts: ["Three, two, one! Time's up! Keep your hands up!"], sit: '時間快到了，倒數三秒，請大家手先舉著不要放。' },
  nochanges: { role: 'host', sec: '06 出題', type: 'ext', en: 'No more changes!', zh: '不可以再更改答案囉！', sit: '時間到了，狐狸還想偷偷換手。告訴大家不能再改答案了。' },
  think:     { role: 'host', sec: '06 出題', type: 'ext', en: 'Think carefully!', zh: '仔細想想！', sit: '有幾隻小動物還在猶豫，提醒他們仔細想想。' },
  talk:      { role: 'host', sec: '06 出題', type: 'ext', en: 'Talk to your teammates!', zh: '跟你的隊友討論一下！', alts: ['Help each other!'], sit: '大家各自在想，鼓勵他們跟隊友討論、互相幫忙。' },
  sure:      { role: 'host', sec: '06 出題', type: 'ext', en: 'Are you sure?', zh: '你們確定嗎？', sit: '狐狸舉手的速度超快，故意問一下：確定嗎？' },
  five:      { role: 'host', sec: '06 出題', type: 'ext', en: 'Five seconds left!', zh: '還有五秒！', alts: ['5 seconds left!'], sit: '作答時間只剩一半了，提醒大家剩幾秒。' },
  cando:     { role: 'host', sec: '06 出題', type: 'ext', en: 'Come on, you can do it!', zh: '加油，你們可以的！', sit: '兔子很緊張，幫大家加油打氣！' },
  toomany:   { role: 'host', sec: '06 出題', type: 'base', en: 'Too many! Put one down.', zh: '太多了！放下一個。', alts: ['Too many hands! One hand down, please.'], sit: '有一隊舉的手比顏色數多了一隻。請他們放下一隻。' },
  handsdown: { role: 'host', sec: '06 出題', type: 'base', en: 'OK! Hands down.', zh: '好！可以放下了。', sit: '你已經看清楚大家舉的顏色了，請大家把手放下。' },

  // ===== 07 公布答案 =====
  check:     { role: 'host', sec: '07 公布', type: 'base', en: "Let's check the answer!", zh: '我們來看答案！', alts: ["Let's see the answer!"], sit: '準備翻開題卡背面，公布答案。' },
  hereitis:  { role: 'host', sec: '07 公布', type: 'ext', en: 'Here it is!', zh: '答案揭曉！', sit: '翻開題卡的那一瞬間，喊一聲答案揭曉！' },
  count:     { role: 'host', sec: '07 公布', type: 'ext', en: "Let's count the correct colors.", zh: '來看看答對了幾個顏色。', sit: '答案公布了，準備一起數一數各隊答對幾個顏色。' },
  twbrand:   { role: 'host', sec: '07 公布', type: 'ext', en: "It's a Taiwanese brand.", zh: '這是台灣品牌。', sit: '補充介紹：這是台灣的品牌。', origin: 'tw' },
  jpbrand:   { role: 'host', sec: '07 公布', type: 'ext', en: "It's a Japanese brand.", zh: '這是日本品牌。', sit: '補充介紹：這是日本的品牌喔。', origin: 'jp' },
  knowbrand: { role: 'host', sec: '07 公布', type: 'ext', en: 'Do you know this brand?', zh: '你們認識這個品牌嗎？', sit: '問問大家：認不認識這個品牌？' },
  seenjapan: { role: 'host', sec: '07 公布', type: 'ext', en: 'Have you seen this in Japan?', zh: '你們在日本看過嗎？', alts: ['Have you seen this brand in Japan?'], sit: '這個品牌日本也有，問問他們在日本看過嗎？' },
  seenbefore:{ role: 'host', sec: '07 公布', type: 'ext', en: 'Have you seen this before?', zh: '你們以前看過這個嗎？', sit: '問問大家以前有沒有看過這個品牌。' },
  nextone:   { role: 'host', sec: '07 公布', type: 'ext', en: "Let's try the next one!", zh: '我們來挑戰下一題！', alts: ["OK! Let's try the next one!"], sit: '這題結束了，帶大家進入下一題。' },
  goodjob:   { role: 'host', sec: '07 公布', type: 'ext', en: 'Good job!', zh: '做得好！', alts: ['Great job!', 'Well done!', 'Amazing!'], sit: '這題大家表現很好，稱讚他們！' },
  thatsright:{ role: 'host', sec: '07 公布', type: 'ext', en: "That's right!", zh: '答對了！', alts: ['Exactly!'], sit: 'A 隊舉的顏色完全正確，告訴他們答對了！' },
  perfect:   { role: 'host', sec: '07 公布', type: 'ext', en: 'Perfect! You got them all!', zh: '太完美了！你們全部答對了！', alts: ['Perfect!', 'You got them all!'], sit: 'B 隊所有顏色都答對了，大大稱讚他們！' },
  almost:    { role: 'host', sec: '07 公布', type: 'ext', en: 'Almost!', zh: '差一點！', sit: '有一隊只差一個顏色就全對了。' },
  nicetry:   { role: 'host', sec: '07 公布', type: 'ext', en: 'Nice try!', zh: '很棒的嘗試！', alts: ["Don't worry!", "That's OK!"], sit: '這題有人答錯了，鼓勵一下。' },

  // ===== 08 計分 =====
  allright:  { role: 'host', sec: '08 計分', type: 'ext', en: 'You got all the colors right!', zh: '你們所有顏色都答對了！', sit: '有一隊這題全部答對，宣布一下！' },
  bothgreat: { role: 'host', sec: '08 計分', type: 'ext', en: 'Both teams did great!', zh: '兩隊都表現得很棒！', sit: '兩隊這題都表現很好，一起稱讚。' },
  seescores: { role: 'host', sec: '08 計分', type: 'ext', en: "Let's see the scores!", zh: '來看看目前的分數！', sit: '走到計分板旁，準備看目前的分數。' },
  close:     { role: 'host', sec: '08 計分', type: 'ext', en: "It's close!", zh: '比分很接近喔！', sit: '兩隊分數只差一點點！' },
  tied:      { role: 'host', sec: '08 計分', type: 'ext', en: "You're tied!", zh: '你們目前平手！', sit: '目前兩隊同分！告訴大家。' },
  moveon:    { role: 'host', sec: '08 計分', type: 'ext', en: "Let's move on to the next round!", zh: '進入下一回合吧！', sit: '這回合結束了，帶大家進入下一回合。' },
  keepitup:  { role: 'host', sec: '08 計分', type: 'ext', en: 'Keep it up!', zh: '繼續加油！', sit: '兩隊都很努力，幫大家打打氣。' },

  // ===== 09 最終成績與加賽 =====
  gameend:   { role: 'host', sec: '09 最終', type: 'base', en: "That's the end of the game!", zh: '遊戲結束！', sit: '三個回合都結束了，宣布遊戲結束。' },
  greatjob:  { role: 'host', sec: '09 最終', type: 'ext', en: 'Great job, everyone!', zh: '大家都表現得很棒！', sit: '遊戲結束，先稱讚每一個人。' },
  finalscore:{ role: 'host', sec: '09 最終', type: 'base', en: "Let's check the final score!", zh: '我們來看最後分數！', alts: ["Let's see the final scores!", "Let's see the final score!"], sit: '走到計分板旁，準備看最後的分數。' },
  congrats:  { role: 'host', sec: '09 最終', type: 'base', en: 'Congratulations!', zh: '恭喜！', sit: '宣布完獲勝隊伍，恭喜他們！' },
  bighand:   { role: 'host', sec: '09 最終', type: 'ext', en: "Let's give them a big hand!", zh: '給他們熱烈的掌聲！', sit: '請大家為獲勝隊伍鼓掌！' },
  tie:       { role: 'host', sec: '09 最終', type: 'base', en: "It's a tie!", zh: '平手！', alts: ["Oh! It's a tie!"], sit: '兩隊分數一樣！宣布結果。' },
  onemore:   { role: 'host', sec: '09 最終', type: 'base', en: 'One more question!', zh: '再加賽一題！', sit: '平手要決勝負，宣布加賽一題。' },
  different: { role: 'host', sec: '09 最終', type: 'base', en: 'This time, the rules are a little different.', zh: '這一次，規則有一點不同。', sit: '加賽的規則跟前面不一樣，先提醒大家。' },
  allcolors: { role: 'host', sec: '09 最終', type: 'base', en: 'You need to get all the colors right.', zh: '你們必須答對所有顏色。', sit: '說明加賽規則：要把所有顏色都答對才算。' },
  firstteam: { role: 'host', sec: '09 最終', type: 'base', en: 'The first team to get all the colors right wins!', zh: '最先答對所有顏色的隊伍獲勝！', sit: '說明加賽怎麼分勝負：哪一隊先全部答對就贏。' },
  quick:     { role: 'host', sec: '09 最終', type: 'ext', en: 'Be quick, but be careful!', zh: '動作要快，但也要仔細喔！', sit: '提醒大家：要快，但也要小心不要答錯。' },
  readyset:  { role: 'host', sec: '09 最終', type: 'base', en: "Ready? Let's go!", zh: '準備好了嗎？開始！', alts: ['Ready, set, go!', 'Are you ready? Ready, set, go!'], sit: '加賽要開始了，問大家準備好了沒，然後開始！' },
  notquite:  { role: 'host', sec: '09 最終', type: 'ext', en: 'Not quite! Keep trying!', zh: '還不完全正確喔！繼續試試看！', alts: ['Not quite!', 'Keep trying!'], sit: 'B 隊舉了，但還沒全部答對，請他們繼續試。' },
  almostthere:{ role: 'host', sec: '09 最終', type: 'ext', en: 'Almost there!', zh: '快答對了！', sit: 'A 隊只差一個顏色了！' },

  // ===== 10 頒獎 =====
  everyonegreat:{ role: 'host', sec: '10 頒獎', type: 'ext', en: 'Everyone did a great job!', zh: '大家都表現得很棒！', sit: '準備頒獎了，先稱讚所有人。' },
  littlegift:{ role: 'host', sec: '10 頒獎', type: 'ext', en: 'We have a little gift for everyone!', zh: '有一份小禮物要送給每個人！', sit: '拿出小禮物，告訴大家每個人都有。' },
  pencil:    { role: 'host', sec: '10 頒獎', type: 'base', en: 'Everyone gets a pencil case!', zh: '每個人都有一個筆袋！', sit: '拿出筆袋，告訴大家每個人都有一個。' },
  forwinning:{ role: 'host', sec: '10 頒獎', type: 'ext', en: 'And for the winning team...', zh: '至於獲勝的隊伍呢……', sit: '故意停頓一下，製造驚喜感：接下來是獲勝隊伍的⋯⋯' },
  surprise:  { role: 'host', sec: '10 頒獎', type: 'base', en: 'The winning team gets a special surprise!', zh: '優勝隊伍還有特別驚喜！', alts: ['We have a special surprise for you!'], sit: '拿出禮物盒：優勝的隊伍還有特別驚喜！' },
  ovaltape:  { role: 'host', sec: '10 頒獎', type: 'ext', en: "It's correction tape from OVAL!", zh: '是歐文的修正帶！', sit: '打開禮物盒，告訴他們裡面是 OVAL 的修正帶。' },
  oval:      { role: 'host', sec: '10 頒獎', type: 'ext', en: 'OVAL is a Taiwanese stationery brand.', zh: '歐文是台灣的文具品牌。', alts: ['This is from OVAL, a Taiwanese brand!'], sit: '補充介紹 OVAL 是什麼樣的品牌。' },
  rememberbrand:{ role: 'host', sec: '10 頒獎', type: 'ext', en: 'Remember this brand? We just saw this logo in the game!', zh: '還記得這個品牌嗎？剛才遊戲中才看過這個 Logo！', alts: ['Remember this brand?'], sit: '剛才的題目剛好抽到 OVAL！問他們還記不記得。' },
  congrats2: { role: 'host', sec: '10 頒獎', type: 'base', en: 'Congratulations!', zh: '恭喜你們！', sit: '優勝隊伍收到禮物了，恭喜他們！' },
  hopelike:  { role: 'host', sec: '10 頒獎', type: 'ext', en: 'I hope you like it!', zh: '希望你們喜歡！', sit: '禮物送出去了，說一句希望他們喜歡。' },

  // ===== 11 道別 =====
  didfun:    { role: 'host', sec: '11 道別', type: 'ext', en: 'Did you have fun?', zh: '你們玩得開心嗎？', sit: '活動結束了，問問大家玩得開不開心。' },
  giveback:  { role: 'host', sec: '11 道別', type: 'base', en: 'Please give back the wristbands.', zh: '請把手環還給我們。', alts: ['Please return your wristbands to our helpers.'], sit: '活動結束，請大家把手環還回去。' },
  thanks:    { role: 'host', sec: '11 道別', type: 'base', en: 'Thank you for playing with us!', zh: '謝謝你們一起玩！', sit: '謝謝大家來玩！' },
  happyhave: { role: 'host', sec: '11 道別', type: 'ext', en: "We're happy to have you here!", zh: '很高興你們來！', sit: '要請他們前往下一關了，告訴他們很高興他們來。' },
  hopefun:   { role: 'host', sec: '11 道別', type: 'ext', en: 'We hope you had fun!', zh: '希望你們玩得開心！', sit: '道別時說一句希望他們玩得開心。' },
  nextstation:{ role: 'host', sec: '11 道別', type: 'ext', en: "It's time for your next station!", zh: '該前往下一關囉！', sit: '時間到了，提醒他們該去下一關了。' },
  enjoy:     { role: 'host', sec: '11 道別', type: 'base', en: 'Enjoy the rest of your visit!', zh: '祝你們接下來的參訪愉快！', alts: ['Have a great day!'], sit: '揮手送他們去下一關，祝他們接下來參訪愉快。' },
  bye:       { role: 'host', sec: '11 道別', type: 'ext', en: 'Bye-bye!', zh: '再見！', alts: ['Bye bye!', 'Bye!', 'Goodbye!'], sit: '最後揮揮手說再見！' },

  // ===== 12 臨時狀況（備用） =====
  moment:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Just a moment, please.', zh: '請稍等一下。', sit: '題卡順序亂了，你需要整理一下，請大家等等。', event: true },
  closer:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Please come a little closer.', zh: '請靠近一點。', sit: '後排的刺蝟和水獺站得太遠了，請大家靠近一點。', event: true },
  cansee:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Can everyone see?', zh: '大家都看得到嗎？', alts: ['Can you see the logo?'], sit: '舉起題卡後，確認後面的人也看得到。', event: true },
  louder:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'A little louder, please.', zh: '請再大聲一點。', sit: '企鵝回答的聲音太小了，聽不清楚。', event: true },
  listen:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Please listen carefully.', zh: '請仔細聽。', sit: '大家在聊天，你要說明重要規則了，請大家注意聽。', event: true },
  showagain: { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Let me show you again. Like this!', zh: '我再示範一次。像這樣！', alts: ['Let me show you again.', 'Like this!'], sit: '狸貓看起來沒聽懂舉手的方式，你再示範一次。', event: true },
  notyet:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Not yet! Wait for my signal.', zh: '還沒開始喔！等我的指令。', alts: ['Not yet!', 'Wait for my signal.'], sit: '你還沒說開始，狐狸就先舉手了。', event: true },
  missing:   { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Are you missing a color?', zh: '你們有缺少哪個顏色嗎？', sit: 'B 隊好像少了一個顏色的手環，問問他們。', event: true },
  needhelp:  { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Do you need help?', zh: '需要幫忙嗎？', sit: '兔子的手環掉了，看起來手忙腳亂。', event: true },
  takeyourtime:{ role: 'host', sec: '12 臨時狀況', type: 'ext', en: "It's OK. Take your time.", zh: '沒關係，慢慢來。', sit: '小熊很緊張，一直找不到自己的手環顏色。', event: true },
  stilltime: { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'We still have time.', zh: '我們還有時間。', sit: '大家擔心時間不夠，告訴他們還有時間。', event: true },
  notmuch:   { role: 'host', sec: '12 臨時狀況', type: 'ext', en: "We don't have much time left.", zh: '剩下的時間不多了。', sit: '活動時間快到了，提醒大家時間不多了。', event: true },
  straight:  { role: 'host', sec: '12 臨時狀況', type: 'ext', en: "Let's go straight to the next question.", zh: '我們直接進入下一題。', sit: '時間有點趕，跳過品牌介紹，直接出下一題。', event: true },
  follow:    { role: 'host', sec: '12 臨時狀況', type: 'ext', en: 'Please follow our helpers.', zh: '請跟著小幫手。', sit: '要換到下一關了，請大家跟著小幫手走。', event: true },
};

// 小抄裡的「會變動的句子」示範（實際練習時數字、顏色、品牌會隨機換）
const DYN_CHEAT = {
  grouping:  { sec: '01 開場', type: 'base', role: 'host', en: 'Four people here, five people there.', zh: '這邊 4 位，那邊 5 位。', alts: ['Four over here, please. Five over there, please.'], note: '8 人時兩邊都說 four' },
  yournum:   { sec: '02 手環', type: 'base', role: 'helper', en: 'You are number one. These are your colors.', zh: '你是 1 號，這些是你的顏色。', alts: ['Here are your colors!', "Here's your color!", 'You are number two. This is your color.'], note: '兩色用 These are your colors，一色用 This is your color' },
  round1:    { sec: '05 觀察', type: 'base', role: 'host', en: 'Round one! Each logo has two colors.', zh: '第一回合！每個 Logo 都有兩個顏色。', alts: ['Round one! Two-color logos.'] },
  round2:    { sec: '05 觀察', type: 'base', role: 'host', en: 'Round two! Each logo has three or four colors.', zh: '第二回合！每個 Logo 有三個或四個顏色。', alts: ['Round two! Three or four colors.'] },
  round3:    { sec: '05 觀察', type: 'base', role: 'host', en: 'Round three! Each logo has four to six colors.', zh: '第三回合！每個 Logo 有四到六個顏色。', alts: ['Round three! The hardest round!'] },
  qintro:    { sec: '06 出題', type: 'base', role: 'host', en: 'Question one! Look at this logo!', zh: '第一題！請看這個 Logo！', note: 'one / two / three 換題號' },
  hascolors: { sec: '06 出題', type: 'base', role: 'host', en: 'This logo has three colors.', zh: '這個 Logo 有三個顏色。', note: 'two / three / four / five / six colors' },
  upto:      { sec: '06 出題', type: 'base', role: 'host', en: 'Raise up to three!', zh: '最多舉三個！', alts: ['Each team can raise up to three hands.', 'Three hands per team, at most!'], note: '第一次建議說完整句 Each team can raise up to ...' },
  onlyn:     { sec: '06 出題', type: 'ext', role: 'host', en: 'Only three hands, please.', zh: '只能舉三隻手喔。', note: '數字跟著顏色數改' },
  colors:    { sec: '07 公布', type: 'base', role: 'host', en: 'Red and white!', zh: '紅色和白色！', alts: ['The colors are red and white!'], note: '照題卡背面念出所有顏色' },
  brand:     { sec: '07 公布', type: 'base', role: 'host', en: 'This is PX Mart.', zh: '這是全聯。', note: 'This is + 品牌名稱，接著念 Fun Fact' },
  points:    { sec: '08 計分', type: 'base', role: 'host', en: 'Team A gets two points!', zh: 'A 隊得兩分！', alts: ['Two points for Team A!', 'One point for Team B!', 'Both teams get three points!'] },
  endround:  { sec: '08 計分', type: 'base', role: 'host', en: "That's the end of round one!", zh: '第一回合結束！' },
  totals:    { sec: '08 計分', type: 'ext', role: 'host', en: 'Team A has five points, Team B has four.', zh: 'A 隊 5 分，B 隊 4 分。', alts: ['Team A has five points. Team B has four points.'] },
  winner:    { sec: '09 最終', type: 'base', role: 'host', en: 'Team A wins!', zh: 'A 隊獲勝！', alts: ['And the winner is Team A!'] },
  firstright:{ sec: '09 最終', type: 'base', role: 'host', en: 'Team A got all the colors right first!', zh: 'A 隊最先答對所有顏色！', note: '加賽時用' },
};

// 小抄的分頁與排列順序（key 可以是 LINES 或 DYN_CHEAT 的名稱）
const CHEAT_TABS = [
  { name: '01 開場', keys: ['hello', 'welcome', 'havefun', 'playgame', 'maketeams', 'grouping', 'teams'] },
  { name: '02 手環', keys: ['helpers', 'line', 'yournum', 'eachhand', 'either', 'remember', 'choose', 'lookcard', 'ready'] },
  { name: '03 規則', keys: ['showhow', 'gamename', 'firstlook', 'have20', 'thenbw', 'tellhow', 'raisehand', 'bothhands', 'example', 'have10', 'whitecounts', 'onepoint', 'nominus', 'morewins', 'teamwork'] },
  { name: '04 熱身', keys: ['practice', 'justpractice', 'nopoints', 'herepractice', 'knowlogo', 'yourschool', 'kumamon', 'easy', 'realgame'] },
  { name: '05 觀察', keys: ['round1', 'round2', 'round3', 'harder', 'hardest', 'finalround', 'look20', 'lookcarefully', 'left10', 'timesup', 'readygo'] },
  { name: '06 出題', keys: ['qintro', 'hascolors', 'upto', 'sec10', 'readygo2', 'keepup', 'nochanges', 'think', 'talk', 'sure', 'five', 'cando', 'toomany', 'onlyn', 'handsdown'] },
  { name: '07 公布', keys: ['check', 'hereitis', 'colors', 'count', 'brand', 'twbrand', 'jpbrand', 'knowbrand', 'seenjapan', 'seenbefore', 'goodjob', 'thatsright', 'perfect', 'almost', 'nicetry', 'nextone'] },
  { name: '08 計分', keys: ['points', 'allright', 'bothgreat', 'endround', 'seescores', 'totals', 'close', 'tied', 'moveon', 'keepitup'] },
  { name: '09 最終', keys: ['gameend', 'greatjob', 'finalscore', 'winner', 'congrats', 'bighand', 'tie', 'onemore', 'different', 'allcolors', 'firstteam', 'quick', 'readyset', 'notquite', 'almostthere', 'firstright'] },
  { name: '10 頒獎', keys: ['everyonegreat', 'littlegift', 'pencil', 'forwinning', 'surprise', 'ovaltape', 'oval', 'rememberbrand', 'congrats2', 'hopelike'] },
  { name: '11 道別', keys: ['didfun', 'giveback', 'thanks', 'happyhave', 'hopefun', 'nextstation', 'enjoy', 'bye'] },
  { name: '12 臨時狀況', keys: ['moment', 'closer', 'cansee', 'louder', 'listen', 'showagain', 'notyet', 'missing', 'needhelp', 'takeyourtime', 'stilltime', 'notmuch', 'straight', 'follow'] },
];

// 小抄：一題完整示範（全聯，三色）
const DEMO_FLOW = [
  ['act', '展示黑白題卡'],
  ['say', 'Question one!', '第一題！'], ['say', 'Look at this logo!', '請看這個 Logo！'],
  ['say', 'This logo has three colors.', '這個 Logo 有三個顏色。'], ['say', 'Each team can raise up to three hands.', '每隊最多可以舉三隻手。'],
  ['say', 'You have ten seconds.', '你們有 10 秒。'], ['say', 'Ready? Go!', '準備好了嗎？開始！'],
  ['act', '學生開始討論及作答'],
  ['say', 'Five seconds left!', '還有五秒！'], ['say', "Three, two, one! Time's up!", '三、二、一！時間到！'], ['say', 'Keep your hands up!', '手先不要放下！'],
  ['act', '翻面公布答案'],
  ['say', "Let's see the answer!", '來看看答案！'], ['say', 'Red, white, and blue!', '紅色、白色和藍色！'],
  ['act', '等待另一位關主計分'],
  ['say', 'Three points for Team A!', 'A 隊得三分！'], ['say', 'Two points for Team B!', 'B 隊得兩分！'],
  ['say', 'Good job, everyone!', '大家都做得很好！'], ['say', 'OK! Hands down.', '好！可以放下手了。'],
  ['act', '介紹品牌'],
  ['say', 'This is PX Mart.', '這是全聯。'], ['say', "It's a popular supermarket chain in Taiwan.", '它是台灣很受歡迎的連鎖超市。'], ['say', 'Have you seen this before?', '你們以前看過這個嗎？'],
  ['act', '進入下一題'],
  ['say', "OK! Let's try the next one!", '好！我們來挑戰下一題！'],
];

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const NUM_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
