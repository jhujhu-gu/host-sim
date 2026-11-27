/* =========================================================
   關主英文助手｜句子與題卡資料（V5，依「練習修訂版」Excel）
   想修改句子：直接改這個檔案。
   en：建議台詞　zh：中文　alts：也算對的其他說法
   type: 'base' = 基本句，'ext' = 延伸句
   status: new 新增／modified 修改／retained 保留（來自 Excel）
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
  { code: '3-2', round: '3', zh: '中壢高商', say: 'our school logo', alts: ['our school', 'ZLCHS', 'Zhong Li Commercial High School'], colors: 'kyrgw', fact: "That's our school! Thank you for visiting us today." },
  { code: '3-3', round: '3', zh: '奧林匹克運動會', say: 'the Olympic Games', alts: ['the Olympics', 'Olympic Games', 'Olympics'], colors: 'bkryg', fact: 'The five rings stand for the five continents, united by sports.' },
  { code: '3-4', round: '3', zh: '唐吉訶德', say: 'Don Quijote', alts: ['Don Quixote', 'Donki', 'Don Don Donki'], colors: 'wrgkyb', origin: 'jp', fact: 'A Japanese discount store. People in Japan call it "Donki". In Taiwan, its shops are called DON DON DONKI.' },
];

const LINES = {
  hello: {"sec": "01 開場", "type": "base", "role": "host", "en": "Hello, everyone!", "zh": "大家好！", "alts": [], "sit": "熊本北的小動物訪問團走到你的攤位前了，先跟大家打招呼。", "status": "retained", "order": 1},
  welcome: {"sec": "01 開場", "type": "base", "role": "host", "en": "Welcome to the Brand Color Challenge!", "zh": "歡迎來到品牌色彩挑戰！", "alts": ["Welcome to our game!"], "sit": "他們來到你的關卡了，熱情地歡迎他們！", "status": "retained", "order": 2},
  havefun: {"sec": "01 開場", "type": "ext", "role": "host", "en": "Let's have some fun!", "zh": "一起開心玩吧！", "alts": ["Let's have fun together!"], "sit": "大家互相說完「よろしくお願いします」，接一句英文讓氣氛熱起來。", "status": "retained", "order": 3},
  playgame: {"sec": "01 開場", "type": "base", "role": "host", "en": "Let's play a game!", "zh": "我們來玩個遊戲吧！", "alts": [], "sit": "告訴大家：我們要開始玩遊戲囉！", "status": "retained", "order": 4},
  maketeams: {"sec": "01 開場", "type": "base", "role": "host", "en": "Let's split into two teams.", "zh": "我們分成兩隊吧！", "alts": ["Let's make two teams."], "sit": "要開始分組了，先告訴大家要分成兩隊。", "status": "modified", "order": 5},
  teams: {"sec": "01 開場", "type": "base", "role": "host", "en": "You're Team A. And you're Team B.", "zh": "你們是 A 隊，你們是 B 隊。", "alts": ["This is Team A. This is Team B.", "You're Team A, and you're Team B."], "sit": "分好兩邊了，指著左右兩群告訴他們隊名。", "status": "retained", "order": 7},
  helpers: {"sec": "02 手環", "type": "base", "role": "host", "en": "Our helpers will help you put on your wristbands.", "zh": "我們的小幫手會協助你們戴上手環。", "alts": ["Our helpers will give you wristbands."], "sit": "接下來要戴手環。告訴大家：小幫手會依照配色卡協助他們戴手環。", "status": "retained", "order": 1, "rev52": true},
  line: {"sec": "02 手環", "type": "base", "role": "helper", "en": "Please stand in a line.", "zh": "請排成一排。", "alts": [], "sit": "這一隊圍成一團在看手環。請他們先排成一排。", "status": "retained", "order": 2},
  eachhand: {"sec": "02 手環", "type": "base", "role": "helper", "en": "Only one wristband on each wrist.", "zh": "每隻手腕只能戴一個手環。", "alts": ["One on each wrist."], "sit": "他拿著兩個手環，不知道要怎麼戴。告訴他一隻手腕只戴一個。", "status": "retained", "order": 4, "rev52": true},
  either: {"sec": "02 手環", "type": "ext", "role": "helper", "en": "Either wrist is fine.", "zh": "戴在哪一手都可以。", "alts": [], "sit": "他只有一個手環，問你要戴哪一手。告訴他哪一手都可以。", "status": "retained", "order": 5},
  remember: {"sec": "02 手環", "type": "ext", "role": "helper", "en": "Remember your colors!", "zh": "記住自己的顏色喔！", "alts": ["Please remember your colors!"], "sit": "全隊都戴好了。提醒大家記住自己的顏色！", "status": "retained", "order": 6},
  choose: {"sec": "02 手環", "type": "ext", "role": "helper", "en": "Each person takes one row on the color card.", "zh": "每個人對應配色卡上的一列。", "alts": ["Please pick a row on the color card."], "sit": "下一隊來了，還沒決定誰對應配色卡的哪一列（顏色已經固定）。請他們每人選一列。", "status": "retained", "order": 7, "rev52": true},
  lookcard: {"sec": "02 手環", "type": "ext", "role": "helper", "en": "Please follow this color card.", "zh": "請依照這張配色卡。", "alts": ["Look at the color card."], "sit": "有人搞不清楚自己該戴哪個顏色。指著配色卡，請大家照著配色卡戴。", "status": "retained", "order": 8, "rev52": true},
  ready: {"sec": "02 手環", "type": "base", "role": "host", "en": "Is everyone ready?", "zh": "大家都準備好了嗎？", "alts": [], "sit": "小幫手發完手環了，問大家準備好了沒。", "status": "retained", "order": 9},
  takebands: {"sec": "02 手環", "type": "base", "role": "host", "en": "Each person gets one or two wristbands.", "zh": "每個人會拿到一至兩個手環。", "alts": [], "sit": "說明手環數量：每個人會拿到一到兩個（依配色卡分配，不是自己挑）。", "status": "new", "order": 10, "rev52": true},
  allcolorsteam: {"sec": "02 手環", "type": "base", "role": "helper", "en": "Make sure your team has all eight colors.", "zh": "請確認你們這隊有全部八種顏色。", "alts": ["Make sure your team has all the colors."], "sit": "手環發完了，請大家確認隊伍裡每一種顏色都有。", "status": "new", "order": 11},
  showhow: {"sec": "03 規則", "type": "base", "role": "host", "en": "OK! Let me show you how to play.", "zh": "好！我來示範怎麼玩。", "alts": [], "sit": "準備開始說明規則，先告訴大家你要示範怎麼玩。", "status": "retained", "order": 1},
  gamename: {"sec": "03 規則", "type": "ext", "role": "host", "en": "This game is called Brand Color Challenge.", "zh": "這個遊戲叫做品牌色彩挑戰。", "alts": [], "sit": "介紹這個遊戲的名字。", "status": "retained", "order": 2},
  firstlook: {"sec": "03 規則", "type": "base", "role": "host", "en": "First, look at these logos. Try to remember their colors.", "zh": "首先，看看這些 Logo。試著記住它們的顏色。", "alts": ["First, look at the color board and remember the colors.", "First, look at these logos and remember their colors."], "sit": "指著彩色觀察板，說明第一步：先看板子上的 Logo，把顏色記起來。", "status": "retained", "order": 3},
  have20: {"sec": "03 規則", "type": "base", "role": "host", "en": "You have twenty seconds.", "zh": "你們有 20 秒。", "alts": ["You have 20 seconds."], "sit": "比出計時的手勢，說明觀察時間有多長。", "status": "retained", "order": 4},
  thenbw: {"sec": "03 規則", "type": "base", "role": "host", "en": "Then, I'll show you a black-and-white logo.", "zh": "接著，我會給你們看一個黑白 Logo。", "alts": ["Then, look at the black and white logo.", "Then, I'll show you a black and white logo."], "sit": "拿起黑白題卡，說明第二步：接著要看黑白的 Logo。", "status": "retained", "order": 5},
  tellhow: {"sec": "03 規則", "type": "base", "role": "host", "en": "I'll tell you how many colors it has.", "zh": "我會告訴你們它有幾種顏色。", "alts": ["I'll tell you how many colors there are.", "I will tell you how many colors."], "sit": "比出數字，告訴大家：你會告訴他們這個 Logo 有幾個顏色。", "status": "modified", "order": 6},
  raisehand: {"sec": "03 規則", "type": "base", "role": "host", "en": "Raise your hands to show the correct colors.", "zh": "舉手展示正確的顏色。", "alts": ["Raise your hands to show the right colors.", "Raise the hand with the matching color!"], "sit": "示範舉手，說明作答方式：舉起戴著對應顏色手環的手。", "status": "modified", "order": 7},
  bothhands: {"sec": "03 規則", "type": "base", "role": "host", "en": "You can raise both hands if both colors are correct.", "zh": "如果兩個顏色都正確，可以舉雙手。", "alts": [], "sit": "示範舉雙手：如果自己兩個手環的顏色都對，可以兩手都舉。", "status": "retained", "order": 8},
  example: {"sec": "03 規則", "type": "ext", "role": "host", "en": "For example, if the logo has two colors, each team can raise up to two hands.", "zh": "例如，如果 Logo 有兩個顏色，每隊最多可以舉兩隻手。", "alts": [], "sit": "舉個例子說明舉手的數量限制：兩個顏色的 Logo，每隊最多舉兩隻手。", "status": "retained", "order": 9},
  have10: {"sec": "03 規則", "type": "base", "role": "host", "en": "You have ten seconds to answer.", "zh": "你們有 10 秒作答。", "alts": ["You have 10 seconds to answer."], "sit": "說明作答時間有多長。", "status": "retained", "order": 10},
  whitecounts: {"sec": "03 規則", "type": "base", "role": "host", "en": "White counts, too!", "zh": "白色也算喔！", "alts": [], "sit": "指著白色手環提醒大家：白色也算一個顏色！", "status": "retained", "order": 11},
  onepoint: {"sec": "03 規則", "type": "base", "role": "host", "en": "One point for each correct color!", "zh": "每答對一色得 1 分！", "alts": [], "sit": "指著計分板說明計分：每答對一個顏色可以得幾分？", "status": "retained", "order": 12},
  nominus: {"sec": "03 規則", "type": "base", "role": "host", "en": "You don't lose any points for wrong answers.", "zh": "答錯不扣分。", "alts": ["No points off for wrong answers.", "Don't worry about mistakes!"], "sit": "小熊有點緊張。搖搖手告訴大家：答錯不會扣分！", "status": "modified", "order": 13},
  morewins: {"sec": "03 規則", "type": "base", "role": "host", "en": "The team with more points wins!", "zh": "分數高的隊伍獲勝！", "alts": [], "sit": "指著兩隊說明：怎樣才算贏？", "status": "retained", "order": 14},
  teamwork: {"sec": "03 規則", "type": "ext", "role": "host", "en": "Work together as a team!", "zh": "大家要一起合作喔！", "alts": [], "sit": "規則說完了，鼓勵大家要團隊合作。", "status": "retained", "order": 15},
  threerounds: {"sec": "03 規則", "type": "base", "role": "host", "en": "There are three rounds in this game.", "zh": "遊戲共有三個回合。", "alts": [], "sit": "說明遊戲一共有幾個回合。", "status": "new", "order": 16},
  onceperround: {"sec": "03 規則", "type": "base", "role": "host", "en": "You can only look at the board once per round.", "zh": "每回合只能看一次觀察板。", "alts": [], "sit": "提醒大家：每一回合的觀察板只能看一次。", "status": "new", "order": 17},
  practice: {"sec": "04 熱身", "type": "base", "role": "host", "en": "Let's try a practice question first!", "zh": "我們先來試一道練習題吧！", "alts": ["Let's practice first!", "Let's try one practice question!"], "sit": "規則說完了，先帶大家練習一題。", "status": "modified", "order": 1},
  justpractice: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "This one is just for practice.", "zh": "這題只是練習。", "alts": [], "sit": "強調一下：這題只是練習而已。", "status": "retained", "order": 2},
  nopoints: {"sec": "04 熱身", "type": "base", "role": "host", "en": "No points for this one.", "zh": "這題不計分。", "alts": [], "sit": "提醒大家：這一題不算分。", "status": "retained", "order": 3},
  herepractice: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "Ready? Here's your first practice question!", "zh": "準備好了嗎？這是練習題！", "alts": [], "sit": "觀察時間結束，拿出練習題的題卡。", "status": "retained", "order": 4},
  knowlogo: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "Do you know this logo?", "zh": "你們認識這個 Logo 嗎？", "alts": ["Does this look familiar?"], "sit": "這個 Logo 他們應該很熟，問問看認不認識。", "status": "retained", "order": 5},
  yourschool: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "It's your school logo!", "zh": "是你們學校的 Logo！", "alts": [], "sit": "答案揭曉：是熊本北高中的校徽！告訴他們。", "status": "retained", "order": 6, "card": "W-1"},
  kumamon: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "It's Kumamon! You all know Kumamon, right?", "zh": "是熊本熊！你們都認識熊本熊，對吧？", "alts": ["It's Kumamon!"], "sit": "答案揭曉：是熊本熊！跟大家確認一下他們都認識。", "status": "retained", "order": 7, "card": "W-2"},
  easy: {"sec": "04 熱身", "type": "ext", "role": "host", "en": "That was easy, right?", "zh": "很簡單，對吧？", "alts": [], "sit": "大家都答對了熱身題，輕鬆地問一句：很簡單吧？", "status": "retained", "order": 8},
  realgame: {"sec": "04 熱身", "type": "base", "role": "host", "en": "Great! Now let's start the real game!", "zh": "很棒！現在正式開始遊戲！", "alts": ["Now let's start the real game!"], "sit": "熱身結束，宣布正式開始遊戲！", "status": "retained", "order": 9},
  ourschool: {"sec": "07 公布", "type": "ext", "role": "host", "en": "This is our school logo!", "zh": "這是我們學校的校徽！", "alts": ["This is our school logo."], "sit": "第三回合 3-2 中壢高商題卡翻面了（五色：黑、黃、紅、綠、白），介紹這是我們學校的校徽。", "status": "new", "order": 10, "note": "第三回合正式題卡 3-2，五色", "card": "3-2", "rev52": true},
  thankvisit: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Thank you for visiting us today.", "zh": "謝謝你們今天來訪。", "alts": [], "sit": "介紹完中壢高商校徽，順便謝謝他們今天來我們學校。", "status": "new", "order": 11, "card": "3-2", "rev52": true, "source": "v52"},
  harder: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "The next round is a little harder!", "zh": "下一回合會再難一點喔！", "alts": ["Next round is harder!", "It's getting harder!"], "sit": "這回合結束了，預告一下：下一回合會更難喔！", "status": "retained", "order": 4},
  hardest: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "This is the hardest round!", "zh": "這是最難的一回合！", "alts": [], "sit": "第三回合開始了，強調這是最難的一回合。", "status": "retained", "order": 5},
  finalround: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "Are you ready for the final round?", "zh": "準備好迎接最後一回合了嗎？", "alts": [], "sit": "要進入最後一個回合了，問大家準備好了沒。", "status": "retained", "order": 6},
  look20: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Look at these logos! You have twenty seconds.", "zh": "請看這些 Logo！你們有 20 秒。", "alts": ["Look at this board! You have 20 seconds!", "Look at these logos! You have 20 seconds."], "sit": "翻開彩色觀察板，告訴大家看板子，有 20 秒可以記。", "status": "retained", "order": 7},
  readyobs: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Ready? Set, go!", "zh": "準備好了嗎？預備，開始！", "alts": [], "sit": "翻開觀察板前喊口號，從這裡開始 20 秒計時！", "status": "new", "order": 8, "note": "說 Set 時手舉高，go 時翻開觀察板"},
  lookcarefully: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "Look carefully! Remember the colors!", "zh": "仔細看喔！記住這些顏色！", "alts": ["Look carefully!", "Remember the colors!"], "sit": "大家正在看觀察板，提醒他們仔細看、記住顏色。", "status": "retained", "order": 9},
  left10: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Ten seconds left!", "zh": "還有 10 秒！", "alts": ["10 seconds left!"], "sit": "沙漏過了一半，提醒大家剩下的時間。", "status": "retained", "order": 10},
  timesup: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Five, four, three, two, one! Time's up!", "zh": "五、四、三、二、一！時間到！", "alts": [], "sit": "最後 5 秒，帶大家倒數，然後宣布時間到。", "status": "retained", "order": 11},
  readygo: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "Are you ready? Let's go!", "zh": "準備好了嗎？開始吧！", "alts": [], "sit": "收起觀察板，準備出題了，問大家準備好了沒，然後開始！", "status": "retained", "order": 12},
  finalboard: {"sec": "05 觀察", "type": "ext", "role": "host", "en": "This is the final logo board!", "zh": "這是最後一張觀察板！", "alts": [], "sit": "第三回合要翻開最後一張觀察板了。", "status": "new", "order": 13},
  sec10: {"sec": "06 出題", "type": "base", "role": "host", "en": "You have ten seconds to choose the correct colors.", "zh": "你們有十秒鐘選出正確的顏色。", "alts": ["You have ten seconds.", "You have 10 seconds!", "You have ten seconds!"], "sit": "告訴大家作答時間有多長。", "status": "modified", "order": 4},
  readygo2: {"sec": "06 出題", "type": "base", "role": "host", "en": "Ready? Set, go!", "zh": "準備好了嗎？預備，開始！", "alts": ["Ready? Go!", "Three, two, one, go!", "Ready, set, go!"], "sit": "題目說明完了，學生還不知道什麼時候開始。用一句口號宣布開始作答、開始計時！", "status": "modified", "order": 5, "note": "每題都要說！說 set 時手舉高，go 時手往下揮或拍手，從這裡開始計時 10 秒"},
  keepup: {"sec": "06 出題", "type": "base", "role": "host", "en": "Three, two, one! Time's up! Keep your hands up!", "zh": "三、二、一！時間到！手先不要放下！", "alts": ["Three, two, one! Keep your hands up!"], "sit": "時間快到了，倒數三秒，請大家手先舉著不要放。", "status": "retained", "order": 6},
  nochanges: {"sec": "06 出題", "type": "ext", "role": "host", "en": "No more changes!", "zh": "不可以再更改答案囉！", "alts": [], "sit": "時間到了，狐狸還想偷偷換手。告訴大家不能再改答案了。", "status": "retained", "order": 7},
  think: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Think carefully!", "zh": "仔細想想！", "alts": [], "sit": "有幾隻小動物還在猶豫，提醒他們仔細想想。", "status": "retained", "order": 8},
  talk: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Talk to your teammates!", "zh": "跟你的隊友討論一下！", "alts": ["Help each other!"], "sit": "大家各自在想，鼓勵他們跟隊友討論、互相幫忙。", "status": "retained", "order": 9},
  sure: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Are you sure?", "zh": "你們確定嗎？", "alts": [], "sit": "狐狸舉手的速度超快，故意問一下：確定嗎？", "status": "retained", "order": 10},
  five: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Five seconds left!", "zh": "還有五秒！", "alts": ["5 seconds left!"], "sit": "作答時間只剩一半了，提醒大家剩幾秒。", "status": "retained", "order": 11},
  cando: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Come on, you can do it!", "zh": "加油，你們可以的！", "alts": [], "sit": "兔子很緊張，幫大家加油打氣！", "status": "retained", "order": 12},
  hurry: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Time's almost up! Hurry up!", "zh": "時間快到了！加快速度！", "alts": [], "sit": "作答時間只剩幾秒，大家還在猶豫，催促一下。", "status": "new", "order": 14},
  nextq: {"sec": "06 出題", "type": "base", "role": "host", "en": "Let's move on to the next question!", "zh": "我們進入下一題吧！", "alts": [], "sit": "這一題結束了，帶大家進入下一題。", "status": "new", "order": 15},
  nextlogo: {"sec": "06 出題", "type": "base", "role": "host", "en": "Here's the next logo!", "zh": "這是下一個標誌！", "alts": [], "sit": "第二題開始，舉起下一張黑白題卡。", "status": "new", "order": 16},
  check: {"sec": "07 公布", "type": "base", "role": "host", "en": "Let's check the answer!", "zh": "我們來看看答案吧！", "alts": ["Let's see the answer!"], "sit": "準備翻開題卡背面，公布答案。", "status": "modified", "order": 1},
  hereitis: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Here it is!", "zh": "答案揭曉！", "alts": [], "sit": "翻開題卡的那一瞬間，喊一聲答案揭曉！", "status": "retained", "order": 2},
  count: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Let's count the correct colors.", "zh": "來看看答對了幾個顏色。", "alts": [], "sit": "答案公布了，準備一起數一數各隊答對幾個顏色。", "status": "retained", "order": 4},
  twbrand: {"sec": "07 公布", "type": "ext", "role": "host", "en": "It's a Taiwanese brand.", "zh": "這是台灣品牌。", "alts": [], "sit": "補充介紹：這是台灣的品牌。", "status": "retained", "order": 6, "origin": "tw"},
  jpbrand: {"sec": "07 公布", "type": "ext", "role": "host", "en": "It's a Japanese brand.", "zh": "這是日本品牌。", "alts": [], "sit": "補充介紹：這是日本的品牌喔。", "status": "retained", "order": 7, "origin": "jp"},
  knowbrand: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Do you know this brand?", "zh": "你們認識這個品牌嗎？", "alts": [], "sit": "問問大家：認不認識這個品牌？", "status": "retained", "order": 8},
  seenjapan: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Have you seen this in Japan?", "zh": "你們在日本看過嗎？", "alts": ["Have you seen this brand in Japan?"], "sit": "這個品牌日本也有，問問他們在日本看過嗎？", "status": "retained", "order": 9},
  seenbefore: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Have you seen this before?", "zh": "你們以前看過這個嗎？", "alts": [], "sit": "問問大家以前有沒有看過這個品牌。", "status": "retained", "order": 10},
  goodjob: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Good job!", "zh": "做得好！", "alts": ["Great job!", "Well done!", "Amazing!"], "sit": "這題大家表現很好，稱讚他們！", "status": "retained", "order": 11},
  thatsright: {"sec": "07 公布", "type": "ext", "role": "host", "en": "That's right!", "zh": "答對了！", "alts": ["Exactly!"], "sit": "A 隊舉的顏色完全正確，告訴他們答對了！", "status": "retained", "order": 12},
  perfect: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Perfect! You got them all!", "zh": "太完美了！你們全部答對了！", "alts": ["Perfect!", "You got them all!"], "sit": "B 隊所有顏色都答對了，大大稱讚他們！", "status": "retained", "order": 13},
  almost: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Almost!", "zh": "差一點！", "alts": [], "sit": "有一隊只差一個顏色就全對了。", "status": "retained", "order": 14},
  nicetry: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Nice try!", "zh": "很棒的嘗試！", "alts": ["Don't worry!", "That's OK!"], "sit": "這題有人答錯了，鼓勵一下。", "status": "retained", "order": 15},
  nextone: {"sec": "07 公布", "type": "ext", "role": "host", "en": "Let's try the next one!", "zh": "我們來挑戰下一題！", "alts": ["OK! Let's try the next one!"], "sit": "這題結束了，帶大家進入下一題。", "status": "retained", "order": 16},
  ohbear: {"sec": "07 公布", "type": "ext", "role": "host", "en": "This is OhBear, Taiwan's tourism mascot.", "zh": "這是喔熊，臺灣的觀光吉祥物。", "alts": [], "sit": "答案是喔熊，介紹牠是臺灣的觀光吉祥物。", "status": "new", "order": 17, "card": "2-4"},
  olympic: {"sec": "07 公布", "type": "ext", "role": "host", "en": "These are the Olympic rings.", "zh": "這是奧林匹克五環。", "alts": [], "sit": "答案是奧運，介紹這是奧林匹克五環。", "status": "new", "order": 18, "card": "3-3"},
  familymart: {"sec": "07 公布", "type": "ext", "role": "host", "en": "This is FamilyMart, a Japanese convenience store chain.", "zh": "這是全家，日本的連鎖便利商店。", "alts": [], "sit": "介紹全家便利商店。", "status": "new", "order": 19, "note": "練習範例：正式題庫沒有全家（第二回合是 7-ELEVEN）。不會出現在正式抽題、現場題卡、模擬或加賽", "practice": true},
  ovalbrand: {"sec": "07 公布", "type": "ext", "role": "host", "en": "This is OVAL, a Taiwanese stationery brand.", "zh": "這是歐文，臺灣的文具品牌。", "alts": [], "sit": "答案是 OVAL，介紹這是臺灣的文具品牌。", "status": "new", "order": 20, "card": "1-1"},
  allright: {"sec": "08 計分", "type": "ext", "role": "host", "en": "You got all the colors right!", "zh": "你們所有顏色都答對了！", "alts": [], "sit": "有一隊這題全部答對，宣布一下！", "status": "retained", "order": 2},
  bothgreat: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Both teams did a great job!", "zh": "兩隊都表現得很好！", "alts": ["Both teams did great!"], "sit": "兩隊這題都表現很好，一起稱讚。", "status": "modified", "order": 3},
  handsdown: {"sec": "08 計分", "type": "base", "role": "host", "en": "Hands down, please!", "zh": "請放下手！", "alts": ["OK! Hands down."], "sit": "你已經看清楚大家舉的顏色了，請大家把手放下。", "status": "modified", "order": 4},
  seescores: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Let's see the scores!", "zh": "來看看目前的分數！", "alts": [], "sit": "走到計分板旁，準備看目前的分數。", "status": "retained", "order": 6},
  close: {"sec": "08 計分", "type": "ext", "role": "host", "en": "It's close!", "zh": "比分很接近喔！", "alts": [], "sit": "兩隊分數只差一點點！", "status": "retained", "order": 8},
  tied: {"sec": "08 計分", "type": "ext", "role": "host", "en": "You're tied!", "zh": "你們目前平手！", "alts": [], "sit": "目前兩隊同分！告訴大家。", "status": "retained", "order": 9},
  moveon: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Let's move on to the next round!", "zh": "進入下一回合吧！", "alts": [], "sit": "這回合結束了，帶大家進入下一回合。", "status": "retained", "order": 10},
  keepitup: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Keep it up!", "zh": "繼續加油！", "alts": [], "sit": "兩隊都很努力，幫大家打打氣。", "status": "retained", "order": 11},
  howmany: {"sec": "08 計分", "type": "base", "role": "host", "en": "How many colors did you get right?", "zh": "你們答對幾種顏色？", "alts": [], "sit": "答案公布了，問各隊答對了幾個顏色。", "status": "new", "order": 12},
  bothright: {"sec": "08 計分", "type": "ext", "role": "host", "en": "You got both colors right!", "zh": "兩種顏色都答對了！", "alts": [], "sit": "這題是兩色題，A 隊兩個顏色都答對了！", "status": "new", "order": 13},
  bothpoints: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Four points for Team A and three points for Team B!", "zh": "A 隊得四分，B 隊得三分！", "alts": [], "sit": "一次宣布兩隊的得分：A 隊 4 分、B 隊 3 分。", "status": "new", "order": 14, "note": "範例分數；現場小抄會用這一題實際確認的得分", "template": true},
  gameend: {"sec": "09 最終", "type": "base", "role": "host", "en": "That's the end of the game!", "zh": "遊戲結束！", "alts": [], "sit": "三個回合都結束了，宣布遊戲結束。", "status": "retained", "order": 1},
  greatjob: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Great job, everyone!", "zh": "大家都表現得很棒！", "alts": [], "sit": "遊戲結束，先稱讚每一個人。", "status": "retained", "order": 2},
  finalscore: {"sec": "09 最終", "type": "base", "role": "host", "en": "Shall we check the final scores?", "zh": "我們來看看最後的分數，好嗎？", "alts": ["Let's see the final scores!", "Let's check the final score!", "Let's see the final score!"], "sit": "走到計分板旁，準備看最後的分數。", "status": "modified", "order": 3},
  congrats: {"sec": "09 最終", "type": "base", "role": "host", "en": "Congratulations!", "zh": "恭喜！", "alts": [], "sit": "宣布完獲勝隊伍，恭喜他們！", "status": "retained", "order": 5},
  bighand: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Let's give them a big hand!", "zh": "給他們熱烈的掌聲！", "alts": [], "sit": "請大家為獲勝隊伍鼓掌！", "status": "retained", "order": 6},
  tie: {"sec": "09 最終", "type": "base", "role": "host", "en": "Oh! It's a tie!", "zh": "喔！平手了！", "alts": ["It's a tie!"], "sit": "兩隊分數一樣！宣布結果。", "status": "retained", "order": 7},
  onemore: {"sec": "09 最終", "type": "base", "role": "host", "en": "One more question!", "zh": "再加賽一題！", "alts": [], "sit": "平手要決勝負，宣布加賽一題。", "status": "retained", "order": 8},
  different: {"sec": "09 最終", "type": "base", "role": "host", "en": "This time, the rules are a little different.", "zh": "這一次，規則有一點不同。", "alts": [], "sit": "加賽的規則跟前面不一樣，先提醒大家。", "status": "retained", "order": 9},
  allcolors: {"sec": "09 最終", "type": "base", "role": "host", "en": "You need to get all the colors right.", "zh": "你們必須答對所有顏色。", "alts": [], "sit": "說明加賽規則：要把所有顏色都答對才算。", "status": "retained", "order": 10},
  firstteam: {"sec": "09 最終", "type": "base", "role": "host", "en": "The first team to get all the colors right wins!", "zh": "最先答對所有顏色的隊伍獲勝！", "alts": [], "sit": "說明加賽怎麼分勝負：哪一隊先全部答對就贏。", "status": "retained", "order": 11},
  quick: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Be quick, but be careful!", "zh": "動作要快，但也要仔細喔！", "alts": [], "sit": "提醒大家：要快，但也要小心不要答錯。", "status": "retained", "order": 12},
  readyset: {"sec": "09 最終", "type": "base", "role": "host", "en": "Ready? Set, go!", "zh": "準備好了嗎？預備，開始！", "alts": ["Ready? Let's go!", "Ready, set, go!"], "sit": "加賽要開始了，問大家準備好了沒，然後開始！", "status": "modified", "order": 13},
  notquite: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Not quite! Keep trying!", "zh": "還不完全正確喔！繼續試試看！", "alts": ["Not quite!", "Keep trying!"], "sit": "B 隊舉了，但還沒全部答對，請他們繼續試。", "status": "retained", "order": 14},
  almostthere: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Almost there!", "zh": "快答對了！", "alts": [], "sit": "A 隊只差一個顏色了！", "status": "retained", "order": 15},
  whichwins: {"sec": "09 最終", "type": "ext", "role": "host", "en": "Which team is the winner?", "zh": "哪一隊獲勝呢？", "alts": [], "sit": "要宣布最後結果了，先問一句製造懸念。", "status": "new", "order": 17},
  everyonegreat: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "Everyone did a great job!", "zh": "大家都表現得很棒！", "alts": [], "sit": "準備頒獎了，先稱讚所有人。", "status": "retained", "order": 1},
  littlegift: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "We have a little gift for everyone!", "zh": "有一份小禮物要送給每個人！", "alts": [], "sit": "拿出小禮物，告訴大家每個人都有。", "status": "retained", "order": 2},
  pencil: {"sec": "10 頒獎", "type": "base", "role": "host", "en": "Everyone gets a pencil case as a gift!", "zh": "每個人都會獲得一個筆袋作為禮物！", "alts": ["Everyone gets a pencil case!"], "sit": "拿出筆袋，告訴大家每個人都有一個。", "status": "modified", "order": 3},
  forwinning: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "And for the winning team...", "zh": "至於獲勝的隊伍呢……", "alts": [], "sit": "故意停頓一下，製造驚喜感：接下來是獲勝隊伍的⋯⋯", "status": "retained", "order": 4},
  surprise: {"sec": "10 頒獎", "type": "base", "role": "host", "en": "There's a special surprise for the winning team!", "zh": "獲勝隊伍還有特別的驚喜！", "alts": ["There's a special surprise inside your pencil cases!", "The winning team gets a special surprise!", "We have a special surprise for you!"], "sit": "頒獎時告訴大家：獲勝隊伍還有特別驚喜（立可帶已放在獲勝隊伍的筆袋裡）。", "status": "modified", "order": 5, "rev52": true},
  opennow: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "Yes, you can open them now!", "zh": "可以，現在就可以打開！", "alts": [], "sit": "學生問現在可以打開筆袋嗎？告訴他們可以。", "status": "new", "order": 6},
  ovaltape: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "The special surprise is correction tape from OVAL.", "zh": "特別的驚喜是歐文的修正帶。", "alts": ["It's correction tape from OVAL!"], "sit": "打開禮物盒，告訴他們裡面是 OVAL 的修正帶。", "status": "modified", "order": 7},
  tapecolor: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "The color is a surprise!", "zh": "顏色是驚喜喔！", "alts": ["You'll get a random color!"], "sit": "獲勝隊伍打開筆袋前，告訴他們立可帶的顏色是隨機的，像盲盒一樣。", "status": "new", "order": 12, "rev52": true, "source": "v52"},
  oval: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "OVAL is a Taiwanese stationery brand.", "zh": "歐文是台灣的文具品牌。", "alts": ["This is from OVAL, a Taiwanese brand!"], "sit": "補充介紹 OVAL 是什麼樣的品牌。", "status": "retained", "order": 8},
  rememberbrand: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "You saw this brand in our game, right?", "zh": "你們剛才在遊戲中看過這個品牌，對吧？", "alts": ["Remember this brand? We just saw this logo in the game!", "Remember this brand?"], "sit": "剛才的題目剛好抽到 OVAL！問他們還記不記得。", "status": "modified", "order": 9},
  congrats2: {"sec": "10 頒獎", "type": "base", "role": "host", "en": "Congratulations!", "zh": "恭喜你們！", "alts": [], "sit": "優勝隊伍收到禮物了，恭喜他們！", "status": "retained", "order": 10},
  hopelike: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "I hope you all like your gifts!", "zh": "希望你們都喜歡自己的禮物！", "alts": ["I hope you like it!"], "sit": "禮物送出去了，說一句希望他們喜歡。", "status": "modified", "order": 11},
  manycolors: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "It comes in many beautiful colors.", "zh": "它有許多漂亮的配色。", "alts": [], "sit": "介紹筆袋：它有很多漂亮的顏色。", "status": "new", "order": 12},
  random: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "You'll get one at random.", "zh": "你們會隨機獲得一個。", "alts": [], "sit": "學生想挑立可帶的顏色。告訴他們顏色是隨機的。", "status": "new", "order": 13, "rev52": true},
  whichcolor: {"sec": "10 頒獎", "type": "ext", "role": "host", "en": "Let's see which color you got!", "zh": "來看看你們拿到什麼顏色！", "alts": [], "sit": "大家拿到筆袋了，一起看看拿到什麼顏色！", "status": "new", "order": 14},
  didfun: {"sec": "11 道別", "type": "ext", "role": "host", "en": "Did you have fun?", "zh": "你們玩得開心嗎？", "alts": [], "sit": "活動結束了，問問大家玩得開不開心。", "status": "retained", "order": 1},
  giveback: {"sec": "11 道別", "type": "base", "role": "host", "en": "Please return your wristbands to our helpers.", "zh": "請把手環還給小幫手。", "alts": ["Please give back the wristbands."], "sit": "活動結束，請大家把手環還回去。", "status": "retained", "order": 2},
  thanks: {"sec": "11 道別", "type": "base", "role": "host", "en": "Thank you for playing with us!", "zh": "謝謝你們一起玩！", "alts": [], "sit": "謝謝大家來玩！", "status": "retained", "order": 3},
  happyhave: {"sec": "11 道別", "type": "ext", "role": "host", "en": "We're happy to have you here!", "zh": "很高興你們來！", "alts": [], "sit": "要請他們前往下一關了，告訴他們很高興他們來。", "status": "retained", "order": 4},
  hopefun: {"sec": "11 道別", "type": "ext", "role": "host", "en": "We hope you had fun!", "zh": "希望你們玩得開心！", "alts": [], "sit": "道別時說一句希望他們玩得開心。", "status": "retained", "order": 5},
  nextstation: {"sec": "11 道別", "type": "ext", "role": "host", "en": "Now it's time to move on to your next station!", "zh": "現在該前往下一關了！", "alts": ["It's time for your next station!"], "sit": "時間到了，提醒他們該去下一關了。", "status": "modified", "order": 6},
  enjoy: {"sec": "11 道別", "type": "base", "role": "host", "en": "Enjoy the rest of your visit!", "zh": "祝你們接下來的參訪愉快！", "alts": ["Have a great day!"], "sit": "揮手送他們去下一關，祝他們接下來參訪愉快。", "status": "retained", "order": 7},
  bye: {"sec": "11 道別", "type": "ext", "role": "host", "en": "Bye-bye!", "zh": "再見！", "alts": ["Bye bye!", "Bye!", "Goodbye!"], "sit": "最後揮揮手說再見！", "status": "retained", "order": 8},
  toomany: {"sec": "12 臨時狀況", "type": "base", "role": "host", "en": "Too many hands! One hand down, please.", "zh": "舉太多隻手了！請放下一隻手。", "alts": ["Too many! Put one down."], "sit": "有一隊舉的手比顏色數多了一隻。請他們放下一隻。", "status": "retained", "order": 1, "event": true},
  moment: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Just a moment, please.", "zh": "請稍等一下。", "alts": [], "sit": "題卡順序亂了，你需要整理一下，請大家等等。", "status": "retained", "order": 2, "event": true},
  closer: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Please come a little closer.", "zh": "請靠近一點。", "alts": [], "sit": "後排的刺蝟和水獺站得太遠了，請大家靠近一點。", "status": "retained", "order": 3, "event": true},
  cansee: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Can everyone see?", "zh": "大家都看得到嗎？", "alts": ["Can you see the logo?"], "sit": "舉起題卡後，確認後面的人也看得到。", "status": "retained", "order": 4, "event": true},
  louder: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "A little louder, please.", "zh": "請再大聲一點。", "alts": [], "sit": "企鵝回答的聲音太小了，聽不清楚。", "status": "retained", "order": 5, "event": true},
  listen: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Please listen carefully.", "zh": "請仔細聽。", "alts": [], "sit": "大家在聊天，你要說明重要規則了，請大家注意聽。", "status": "retained", "order": 6, "event": true},
  showagain: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let me show you again. Like this!", "zh": "我再示範一次。像這樣！", "alts": ["Let me show you again.", "Like this!"], "sit": "狸貓看起來沒聽懂舉手的方式，你再示範一次。", "status": "retained", "order": 7, "event": true},
  notyet: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Not yet! Wait for my signal.", "zh": "還沒開始喔！等我的指令。", "alts": ["Not yet!", "Wait for my signal."], "sit": "你還沒說開始，狐狸就先舉手了。", "status": "retained", "order": 8, "event": true},
  missing: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Are you missing a color?", "zh": "你們有缺少哪個顏色嗎？", "alts": [], "sit": "B 隊好像少了一個顏色的手環，問問他們。", "status": "retained", "order": 9, "event": true},
  needhelp: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Do you need help?", "zh": "需要幫忙嗎？", "alts": [], "sit": "兔子的手環掉了，看起來手忙腳亂。", "status": "retained", "order": 10, "event": true},
  takeyourtime: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "It's OK. Take your time.", "zh": "沒關係，慢慢來。", "alts": [], "sit": "小熊很緊張，一直找不到自己的手環顏色。", "status": "retained", "order": 11, "event": true},
  stilltime: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "We still have time.", "zh": "我們還有時間。", "alts": [], "sit": "大家擔心時間不夠，告訴他們還有時間。", "status": "retained", "order": 12, "event": true},
  notmuch: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "We don't have much time left.", "zh": "剩下的時間不多了。", "alts": [], "sit": "活動時間快到了，提醒大家時間不多了。", "status": "retained", "order": 13, "event": true},
  straight: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let's go straight to the next question.", "zh": "我們直接進入下一題。", "alts": [], "sit": "時間有點趕，跳過品牌介紹，直接出下一題。", "status": "retained", "order": 14, "event": true},
  follow: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Please follow our helpers.", "zh": "請跟著小幫手。", "alts": [], "sit": "要換到下一關了，請大家跟著小幫手走。", "status": "retained", "order": 15, "event": true},
  okfewer: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "It's okay to raise fewer hands.", "zh": "少舉幾隻手也沒關係。", "alts": ["It's okay to raise only three hands."], "sit": "這題可以舉四隻手，但 A 隊只想舉三隻，問你可不可以。告訴他們沒關係。", "status": "new", "order": 16, "event": true, "template": true, "note": "現場小抄會依這題的顏色數產生句子（例：四色題 → only three hands）；沒選題目時用 fewer hands"},
  guess: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Just take a guess!", "zh": "試著猜猜看吧！", "alts": [], "sit": "兔子完全想不起來顏色，鼓勵她猜猜看。", "status": "new", "order": 17, "event": true},
  moretime: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Do you need more time to remember the colors?", "zh": "需要更多時間記住顏色嗎？", "alts": [], "sit": "大家看觀察板看得很吃力，問他們需不需要更多時間記顏色。", "status": "new", "order": 18, "event": true},
  thirty: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "How about thirty seconds?", "zh": "三十秒如何？", "alts": [], "sit": "提議把觀察時間延長成 30 秒。", "status": "new", "order": 19, "note": "臨時應變話術，正式觀察時間仍是 20 秒", "event": true},
  givethirty: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Okay, I'll give you thirty seconds.", "zh": "好，那我給你們三十秒。", "alts": [], "sit": "大家點頭了，告訴他們給 30 秒。", "status": "new", "order": 20, "note": "臨時應變話術，正式觀察時間仍是 20 秒", "event": true},
  fifteen: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "You have fifteen seconds this time.", "zh": "這次你們有十五秒。", "alts": [], "sit": "時間不夠了，這回合只能讓大家看觀察板十五秒。", "status": "new", "order": 21, "event": true, "note": "臨時應變話術，正式觀察時間仍是 20 秒", "rev52": true, "source": "v52"},
  lastq: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let's make this our last question.", "zh": "我們把這題當作最後一題吧！", "alts": [], "sit": "時間快不夠了，宣布這一題是最後一題。", "status": "new", "order": 21, "event": true},
  sayagain: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let me say that again.", "zh": "我再說一次。", "alts": [], "sit": "學生沒聽清楚你剛剛說的話，你要再說一次。", "status": "new", "order": 22, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  tellready: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Tell me when you're ready.", "zh": "準備好了跟我說。", "alts": [], "sit": "學生還在整理手環，請他們準備好了再告訴你。", "status": "new", "order": 23, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  canmore: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "You can raise up to four hands.", "zh": "最多可以舉四隻手。", "alts": [], "sit": "這題可以舉四隻手，但他們只舉了兩隻，提醒他們最多可以舉幾隻。", "status": "new", "order": 24, "event": true, "source": "added", "note": "現場小抄會依這題的顏色數替換數字；沒選題目時顯示 ___", "template": true},
  fivemore: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "OK, five more seconds!", "zh": "好，再給你們五秒！", "alts": [], "sit": "時間到了但大家還在討論，你決定多給五秒。", "status": "new", "order": 25, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  anotherband: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Here's another wristband.", "zh": "這是新的手環。", "alts": [], "sit": "兔子的手環斷掉了，拿一條新的給她。", "status": "new", "order": 26, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  checkagain: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let me check the scores again.", "zh": "我再確認一次分數。", "alts": [], "sit": "有隊伍覺得分數算錯了，你要再確認一次。", "status": "new", "order": 27, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  nextgroup: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "The next group is here, so let's finish up.", "zh": "下一組到了，我們準備結束吧。", "alts": [], "sit": "下一組學生已經在旁邊等了，要準備收尾。", "status": "new", "order": 28, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
  stophere: {"sec": "12 臨時狀況", "type": "ext", "role": "host", "en": "Let's stop the game here.", "zh": "遊戲就先到這裡。", "alts": [], "sit": "時間真的不夠了，要提前結束遊戲。", "status": "new", "order": 29, "event": true, "source": "added", "note": "Excel 以外補充的臨時狀況短句"},
};

// 會依情境替換數字、顏色、隊伍或品牌的句子（這裡的 en 是範例）
const DYN_CHEAT = {
  grouping: {"sec": "01 開場", "type": "base", "role": "host", "en": "Four over here, please. Five over there, please.", "zh": "請四位到這邊，五位到那邊。", "alts": ["Four people here, five people there."], "sit": "一共 9 位同學，用手勢把他們分成兩邊：一邊 4 位、另一邊 5 位。", "status": "retained", "order": 6, "note": "8 人時兩邊都說 Four", "template": true},
  yournum: {"sec": "02 手環", "type": "base", "role": "helper", "en": "Here are your colors!", "zh": "這是你的兩個顏色！", "alts": ["Here's your color!", "You are number one. These are your colors."], "sit": "（小幫手）把兩個顏色的手環交給同學，告訴他這是他的顏色。", "status": "retained", "order": 3, "note": "兩色用 Here are your colors，一色用 Here's your color", "template": true},
  round1: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Round one! Each logo has two colors.", "zh": "第一回合！每個 Logo 都有兩個顏色。", "alts": ["Round one! Two-color logos."], "sit": "第一回合開始了！宣布回合，並說明這回合的 Logo 都是兩個顏色。", "status": "retained", "order": 1, "template": true},
  round2: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Round two! Each logo has three or four colors.", "zh": "第二回合！每個 Logo 有三個或四個顏色。", "alts": ["Round two! Three or four colors."], "sit": "第二回合開始了！宣布回合，並說明這回合的 Logo 有三到四個顏色。", "status": "retained", "order": 2, "template": true},
  round3: {"sec": "05 觀察", "type": "base", "role": "host", "en": "Let's move on to the hardest round! The logos have four to six colors.", "zh": "我們進入最難的回合吧！標誌有四到六種顏色。", "alts": ["Round three! Each logo has four to six colors.", "Round three! The hardest round!"], "sit": "第三回合開始了！宣布回合，並說明這回合的 Logo 有四到六個顏色。", "status": "modified", "order": 3, "template": true},
  qintro: {"sec": "06 出題", "type": "base", "role": "host", "en": "Here's the first logo!", "zh": "這是第一個標誌！", "alts": ["Question one! Look at this logo!"], "sit": "第 1 題！舉起黑白題卡，請大家看這個 Logo。", "status": "modified", "order": 1, "note": "one / two / three 換題號", "template": true},
  hascolors: {"sec": "06 出題", "type": "base", "role": "host", "en": "This logo has three colors.", "zh": "這個 Logo 有三個顏色。", "alts": [], "sit": "題卡上寫著 3 colors。告訴大家這個 Logo 有幾個顏色。", "status": "retained", "order": 2, "note": "two / three / four / five / six colors", "template": true},
  upto: {"sec": "06 出題", "type": "base", "role": "host", "en": "Each team can raise up to three hands.", "zh": "每隊最多可以舉三隻手。", "alts": ["Three hands per team, at most!", "Raise up to three!"], "sit": "提醒大家：這題每隊最多只能舉 3 隻手。", "status": "retained", "order": 3, "note": "熟悉後可簡化成 Three hands per team, at most!", "template": true},
  onlyn: {"sec": "06 出題", "type": "ext", "role": "host", "en": "Only three hands, please.", "zh": "只能舉三隻手喔。", "alts": [], "sit": "有一隊舉了 4 隻手，但這題只有 3 個顏色。提醒他們只能舉 3 隻。", "status": "retained", "order": 13, "note": "數字跟著顏色數改", "template": true},
  colors: {"sec": "07 公布", "type": "base", "role": "host", "en": "The correct colors are red and white!", "zh": "正確的顏色是紅色和白色！", "alts": ["The colors are red and white!", "Red and white!"], "sit": "翻開題卡背面，答案是紅色和白色。念出答案。", "status": "modified", "order": 3, "note": "照題卡背面念出所有顏色", "template": true},
  brand: {"sec": "07 公布", "type": "base", "role": "host", "en": "This is PX Mart.", "zh": "這是全聯。", "alts": [], "sit": "介紹這個品牌：全聯（PX Mart）。", "status": "retained", "order": 5, "note": "This is + 品牌名稱，接著念 Fun Fact", "template": true},
  points: {"sec": "08 計分", "type": "base", "role": "host", "en": "Two points for Team A!", "zh": "A 隊得兩分！", "alts": ["One point for Team B!", "Both teams get three points!", "Team A gets two points!"], "sit": "A 隊這題答對兩個顏色，宣布 A 隊得幾分。", "status": "retained", "order": 1, "template": true},
  endround: {"sec": "08 計分", "type": "base", "role": "host", "en": "That's the end of round one!", "zh": "第一回合結束！", "alts": [], "sit": "第一回合的題目都出完了，宣布這回合結束。", "status": "retained", "order": 5, "template": true},
  totals: {"sec": "08 計分", "type": "ext", "role": "host", "en": "Team A has five points. Team B has four points.", "zh": "A 隊目前五分，B 隊目前四分。", "alts": ["Team A has five points, Team B has four."], "sit": "報一下目前比數：A 隊 5 分、B 隊 4 分。", "status": "retained", "order": 7, "template": true},
  winner: {"sec": "09 最終", "type": "base", "role": "host", "en": "Team A wins the game!", "zh": "A 隊贏得比賽！", "alts": ["And the winner is... Team A!", "Team A wins!"], "sit": "最後 A 隊分數比較高，製造一點懸念再宣布 A 隊獲勝！", "status": "modified", "order": 4, "template": true},
  firstright: {"sec": "09 最終", "type": "base", "role": "host", "en": "Team A got all the colors right first!", "zh": "A 隊最先答對所有顏色！", "alts": [], "sit": "加賽中，A 隊比較快把所有顏色都舉對了！宣布結果。", "status": "retained", "order": 16, "note": "加賽時用", "template": true},
};

// 完整話術庫的分頁與排列順序（依 Excel 順序）
const CHEAT_TABS = [
 {
  "name": "01 開場",
  "keys": [
   "hello",
   "welcome",
   "havefun",
   "playgame",
   "maketeams",
   "grouping",
   "teams"
  ]
 },
 {
  "name": "02 手環",
  "keys": [
   "helpers",
   "line",
   "yournum",
   "eachhand",
   "either",
   "remember",
   "choose",
   "lookcard",
   "ready",
   "takebands",
   "allcolorsteam"
  ]
 },
 {
  "name": "03 規則",
  "keys": [
   "showhow",
   "gamename",
   "firstlook",
   "have20",
   "thenbw",
   "tellhow",
   "raisehand",
   "bothhands",
   "example",
   "have10",
   "whitecounts",
   "onepoint",
   "nominus",
   "morewins",
   "teamwork",
   "threerounds",
   "onceperround"
  ]
 },
 {
  "name": "04 熱身",
  "keys": [
   "practice",
   "justpractice",
   "nopoints",
   "herepractice",
   "knowlogo",
   "yourschool",
   "kumamon",
   "easy",
   "realgame"
  ]
 },
 {
  "name": "05 觀察",
  "keys": [
   "round1",
   "round2",
   "round3",
   "harder",
   "hardest",
   "finalround",
   "look20",
   "readyobs",
   "lookcarefully",
   "left10",
   "timesup",
   "readygo",
   "finalboard"
  ]
 },
 {
  "name": "06 出題",
  "keys": [
   "qintro",
   "hascolors",
   "upto",
   "sec10",
   "readygo2",
   "keepup",
   "nochanges",
   "think",
   "talk",
   "sure",
   "five",
   "cando",
   "onlyn",
   "hurry",
   "nextq",
   "nextlogo"
  ]
 },
 {
  "name": "07 公布",
  "keys": [
   "check",
   "hereitis",
   "colors",
   "count",
   "brand",
   "twbrand",
   "jpbrand",
   "knowbrand",
   "seenjapan",
   "seenbefore",
   "goodjob",
   "thatsright",
   "perfect",
   "almost",
   "nicetry",
   "nextone",
   "ohbear",
   "olympic",
   "familymart",
   "ovalbrand",
   "ourschool",
   "thankvisit"
  ]
 },
 {
  "name": "08 計分",
  "keys": [
   "points",
   "allright",
   "bothgreat",
   "handsdown",
   "endround",
   "seescores",
   "totals",
   "close",
   "tied",
   "moveon",
   "keepitup",
   "howmany",
   "bothright",
   "bothpoints"
  ]
 },
 {
  "name": "09 最終",
  "keys": [
   "gameend",
   "greatjob",
   "finalscore",
   "winner",
   "congrats",
   "bighand",
   "tie",
   "onemore",
   "different",
   "allcolors",
   "firstteam",
   "quick",
   "readyset",
   "notquite",
   "almostthere",
   "firstright",
   "whichwins"
  ]
 },
 {
  "name": "10 頒獎",
  "keys": [
   "everyonegreat",
   "littlegift",
   "pencil",
   "forwinning",
   "surprise",
   "opennow",
   "ovaltape",
   "tapecolor",
   "oval",
   "rememberbrand",
   "congrats2",
   "hopelike",
   "manycolors",
   "random",
   "whichcolor"
  ]
 },
 {
  "name": "11 道別",
  "keys": [
   "didfun",
   "giveback",
   "thanks",
   "happyhave",
   "hopefun",
   "nextstation",
   "enjoy",
   "bye"
  ]
 },
 {
  "name": "12 臨時狀況",
  "keys": [
   "toomany",
   "moment",
   "closer",
   "cansee",
   "louder",
   "listen",
   "showagain",
   "notyet",
   "missing",
   "needhelp",
   "takeyourtime",
   "stilltime",
   "notmuch",
   "straight",
   "follow",
   "okfewer",
   "guess",
   "moretime",
   "thirty",
   "givethirty",
   "fifteen",
   "lastq",
   "sayagain",
   "tellready",
   "canmore",
   "fivemore",
   "anotherband",
   "checkagain",
   "nextgroup",
   "stophere"
  ]
 }
];

// 一題完整示範（全聯，三色）：依 V5 流程，計分完成後才請學生放下手，再介紹品牌
const DEMO_FLOW = [
  ['act', '展示黑白題卡'],
  ['say', "Here's the first logo!", '這是第一個標誌！'],
  ['say', 'This logo has three colors.', '這個 Logo 有三個顏色。'],
  ['say', 'Each team can raise up to three hands.', '每隊最多可以舉三隻手。'],
  ['say', 'You have ten seconds to choose the correct colors.', '你們有十秒鐘選出正確的顏色。'],
  ['say', 'Ready? Set, go!', '準備好了嗎？預備，開始！'],
  ['act', '學生討論及作答'],
  ['say', 'Five seconds left!', '還有五秒！'],
  ['say', "Three, two, one! Time's up! Keep your hands up!", '三、二、一！時間到！手先不要放下！'],
  ['act', '翻面公布答案'],
  ['say', "Let's check the answer!", '我們來看看答案吧！'],
  ['say', 'The correct colors are white, red, and blue!', '正確的顏色是白色、紅色和藍色！'],
  ['act', '確認各隊答對幾色並計分（學生手還舉著）'],
  ['say', 'How many colors did you get right?', '你們答對幾種顏色？'],
  ['say', 'Three points for Team A!', 'A 隊得三分！'],
  ['say', 'Two points for Team B!', 'B 隊得兩分！'],
  ['say', 'Hands down, please!', '請放下手！'],
  ['act', '介紹品牌'],
  ['say', 'This is PX Mart.', '這是全聯。'],
  ['say', 'Have you seen this before?', '你們以前看過這個嗎？'],
  ['act', '進入下一題'],
  ['say', "Let's move on to the next question!", '我們進入下一題吧！'],
  ['say', "Here's the next logo!", '這是下一個標誌！'],
];

// ===== 現場小抄 =====
// 每段預設顯示的核心話術（'round' 會依目前回合換成 round1／round2／round3）
const LIVE_CORE = {
  '01 開場': ['hello', 'welcome', 'maketeams', 'grouping', 'teams'],
  '02 手環': ['helpers', 'takebands', 'ready'],
  '03 規則': ['showhow', 'threerounds', 'firstlook', 'have20', 'onceperround', 'thenbw', 'tellhow', 'raisehand', 'bothhands', 'have10', 'whitecounts', 'onepoint', 'nominus', 'morewins'],
  '04 熱身': ['practice', 'nopoints', 'realgame'],
  '05 觀察': ['round', 'look20', 'readyobs', 'left10', 'timesup'],
  '06 出題': ['qintro', 'hascolors', 'upto', 'sec10', 'readygo2', 'keepup'],
  '07 公布': ['check', 'colors', 'brand'],
  '08 計分': ['howmany', 'points', 'handsdown', 'nextq', 'endround', 'totals'],
  '09 最終': ['gameend', 'finalscore', 'winner'],
  '10 頒獎': ['pencil', 'surprise', 'opennow', 'congrats2'],
  '11 道別': ['giveback', 'thanks', 'enjoy'],
};
const LIVE_CORE_HELPER = {
  '02 手環': ['line', 'yournum', 'eachhand', 'either', 'remember', 'lookcard'],
};
const LIVE_TIE = ['tie', 'onemore', 'different', 'allcolors', 'firstteam', 'readyset', 'firstright'];
// 一題完整流程（06 → 07 → 08，計分後才放下手，再介紹品牌）
const LIVE_QFLOW = ['qintro', 'hascolors', 'upto', 'sec10', 'readygo2', 'keepup', 'check', 'colors', 'howmany', 'points', 'handsdown', 'brand', 'nextq'];

// 現場動作提示
const LIVE_ACT = {
  hello: '學生走到攤位前，揮手打招呼', maketeams: '準備分組', grouping: '用手勢把學生分成兩邊', teams: '指著兩邊宣布隊名',
  helpers: '指向小幫手', takebands: '手環放桌上讓大家自己拿時用', ready: '手環發完，確認大家準備好',
  line: '請這隊先排好', yournum: '邊說邊把手環交給學生', eachhand: '兩色的人', either: '一色的人', remember: '全部發完時',
  showhow: '拿起觀察板準備示範', firstlook: '指著觀察板', have20: '比出 20 秒手勢', onceperround: '強調只能看一次',
  thenbw: '拿起黑白題卡', tellhow: '比出數字', raisehand: '示範舉手', bothhands: '示範舉雙手', have10: '比出 10 秒手勢',
  whitecounts: '指著白色手環', onepoint: '指向計分板', nominus: '搖手示意', morewins: '指著兩隊',
  practice: '拿出熱身題卡', realgame: '熱身結束，宣布正式開始',
  round: '宣布回合與本回合顏色數', look20: '翻開觀察板前', readyobs: '說 set 時手舉高，go 時翻開觀察板，開始計時 20 秒', left10: '過了 10 秒', timesup: '倒數完收起觀察板',
  qintro: '舉起黑白題卡', hascolors: '比出顏色數', upto: '提醒舉手上限', readygo2: '說 set 時手舉高，go 時揮下，開始計時 10 秒', keepup: '時間到，請大家手先舉著',
  check: '準備翻開題卡背面', colors: '翻面，念出答案顏色', brand: '計分完、放下手之後再介紹品牌',
  howmany: '確認各隊答對幾色（手還舉著）', points: '宣布得分', handsdown: '計分完成後才請大家放下手', nextq: '同一回合進入下一題（不用再看觀察板）', endround: '這回合三題都出完', totals: '報目前比數',
  gameend: '第三回合結束', finalscore: '走到計分板旁', winner: '宣布結果',
  tie: '兩隊同分', firstteam: '說明加賽規則：先全對的贏', readyset: '加賽開始', firstright: '宣布加賽結果',
  pencil: '拿出筆袋', surprise: '提示獲勝隊伍筆袋裡有驚喜', opennow: '學生問能不能打開時', giveback: '拿出手環籃', enjoy: '揮手送他們去下一關',
};

// 臨時狀況快速查詢：點中文情境 → 直接顯示 1～3 句主要英文
const EMERGENCY = [
  { label: '學生聽不懂', keys: ['showagain', 'sayagain', 'listen'] },
  { label: '學生還沒準備好', keys: ['tellready', 'takeyourtime', 'notyet'] },
  { label: '舉太多隻手', keys: ['toomany', 'onlyn'] },
  { label: '舉太少隻手', keys: ['canmore', 'okfewer'] },
  { label: '學生不確定答案', keys: ['guess', 'think', 'talk'] },
  { label: '想再看觀察板', keys: ['onceperround'] },
  { label: '想要更多時間', keys: ['fivemore', 'moretime', 'givethirty'] },
  { label: '時間到了還想改答案', keys: ['nochanges', 'keepup'] },
  { label: '手環掉了或缺少手環', keys: ['anotherband', 'missing', 'needhelp'] },
  { label: '需要重新確認分數', keys: ['checkagain', 'howmany', 'seescores'] },
  { label: '兩隊平手', keys: ['tie', 'onemore', 'firstteam'] },
  { label: '活動時間不足', keys: ['notmuch', 'lastq', 'nextgroup', 'fifteen'] },
  { label: '下一組已經到了', keys: ['nextgroup', 'giveback', 'nextstation'] },
  { label: '提前結束活動', keys: ['stophere', 'thanks', 'enjoy'] },
  { label: '禮物相關問題', keys: ['opennow', 'tapecolor', 'surprise'] },
  { label: '學生沒聽到', keys: ['sayagain', 'closer', 'cansee'] },
  { label: '答錯會不會扣分', keys: ['nominus', 'guess'] },
];

const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty'];
const NUM_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十'];
const ORDINAL = ['', 'first', 'second', 'third', 'fourth', 'fifth'];

/* V5.1 現場「關鍵字提示」：[中文功能, 英文提示詞]（人工整理） */
const LIVE_KW = {
  hello: ['打招呼', 'Hello'], welcome: ['歡迎', 'Welcome · Brand Color Challenge'], maketeams: ['要分兩隊', 'Split · two teams'],
  grouping: ['分到兩邊', 'Four here · ___ there'], teams: ['宣布隊名', 'Team A · Team B'],
  helpers: ['小幫手發手環', 'Helpers · wristbands'], takebands: ['自己拿一到兩個', 'Take one or two'], ready: ['都準備好了嗎', 'Everyone ready?'],
  allcolorsteam: ['確認八色都有', 'All eight colors'],
  showhow: ['我來示範', 'Show you how'], threerounds: ['共三回合', 'Three rounds'], firstlook: ['先看 Logo 記顏色', 'Look · remember colors'],
  have20: ['20 秒', 'Twenty seconds'], onceperround: ['每回合只看一次', 'Only once per round'], thenbw: ['再出黑白 Logo', 'Black-and-white logo'],
  tellhow: ['我說有幾色', 'Tell you how many colors'], raisehand: ['舉手表示顏色', 'Raise hands · colors'], bothhands: ['兩色都對可舉雙手', 'Both hands OK'],
  have10: ['10 秒作答', 'Ten seconds'], whitecounts: ['白色也算', 'White counts'], onepoint: ['一色一分', 'One point · each color'],
  nominus: ['答錯不扣分', 'No points off'], morewins: ['分數高的贏', 'More points wins'],
  practice: ['先練習一題', 'Practice question'], nopoints: ['這題不計分', 'No points'], realgame: ['正式開始', 'Real game!'],
  round1: ['第一回合：兩色', 'Round one · two colors'], round2: ['第二回合：三到四色', 'Round two · three or four'], round3: ['最難的回合：四到六色', 'Hardest round · four to six'],
  look20: ['看 Logo，20 秒', 'Look · twenty seconds'], readyobs: ['開始看板', 'Ready? Set, go!'], left10: ['剩 10 秒', 'Ten seconds left'], timesup: ['倒數、時間到', '5-4-3-2-1 · Time\'s up'],
  qintro: ['出題', 'Here\'s the logo'], hascolors: ['這題有幾色', 'Has ___ colors'], upto: ['最多舉幾隻手', 'Up to ___ hands'], sec10: ['10 秒選顏色', 'Ten seconds · choose'],
  readygo2: ['開始作答', 'Ready? Set, go!'], keepup: ['時間到，手先舉著', 'Time\'s up · hands up'],
  check: ['來看答案', 'Check the answer'], colors: ['念答案顏色', 'Correct colors are…'], brand: ['介紹品牌', 'This is ___'],
  howmany: ['答對幾色？', 'How many right?'], points: ['宣布得分', '___ points · Team A / B'], bothpoints: ['兩隊得分', 'A ___ · B ___'], handsdown: ['放下手', 'Hands down'],
  nextq: ['下一題', 'Next question'], endround: ['這回合結束', 'End of round'], totals: ['報目前比數', 'Team A has… Team B has…'],
  gameend: ['遊戲結束', 'End of the game'], finalscore: ['看最後分數', 'Check final scores'], winner: ['宣布勝隊', 'Team ___ wins'],
  pencil: ['每人一個筆袋', 'Pencil case · everyone'], surprise: ['筆袋裡有驚喜', 'Special surprise inside'], opennow: ['現在可以打開', 'Open them now'], congrats2: ['恭喜', 'Congratulations'],
  giveback: ['手環還給小幫手', 'Return wristbands'], thanks: ['謝謝參加', 'Thank you for playing'], enjoy: ['參訪愉快', 'Enjoy your visit'],
  line: ['排成一排', 'Stand in a line'], yournum: ['給你的顏色', 'Your colors'], eachhand: ['左右各戴一個', 'One on each wrist'], either: ['哪手都可以', 'Either wrist'],
  remember: ['記住顏色', 'Remember your colors'], lookcard: ['看配色卡', 'Color card'],
  tie: ['平手', 'It\'s a tie'], onemore: ['加賽一題', 'One more question'], different: ['規則不一樣', 'Rules a little different'],
  allcolors: ['要全部答對', 'All the colors right'], firstteam: ['最先全對的贏', 'First team · all right · wins'], readyset: ['加賽開始', 'Ready? Set, go!'], firstright: ['宣布加賽勝隊', 'Team ___ got it first'],
  showagain: ['再示範一次', 'Show you again'], sayagain: ['再說一次', 'Say that again'], listen: ['仔細聽', 'Listen carefully'], closer: ['靠近一點', 'Come closer'], cansee: ['看得到嗎', 'Can everyone see?'],
  tellready: ['好了跟我說', 'Tell me when ready'], takeyourtime: ['慢慢來', 'Take your time'], notyet: ['還沒，等指令', 'Not yet · my signal'],
  toomany: ['太多手，放下一隻', 'Too many · one down'], onlyn: ['只能舉幾隻', 'Only ___ hands'], canmore: ['最多可以舉幾隻', 'Up to ___ hands'], okfewer: ['少舉也可以', 'Fewer is OK'],
  guess: ['猜猜看', 'Take a guess'], think: ['仔細想', 'Think carefully'], talk: ['跟隊友討論', 'Talk to teammates'],
  fivemore: ['再給五秒', 'Five more seconds'], moretime: ['需要更多時間嗎', 'More time?'], givethirty: ['臨時給 30 秒', 'Thirty seconds'], nochanges: ['不能再改', 'No more changes'],
  anotherband: ['換一個手環', 'Another wristband'], missing: ['少了哪個顏色', 'Missing a color?'], needhelp: ['需要幫忙嗎', 'Need help?'],
  checkagain: ['再確認分數', 'Check the scores again'], seescores: ['看看分數', 'See the scores'],
  notmuch: ['時間不多', 'Not much time'], lastq: ['這是最後一題', 'Last question'], straight: ['直接下一題', 'Straight to next'],
  nextgroup: ['下一組到了', 'Next group · finish up'], nextstation: ['去下一關', 'Next station'], stophere: ['遊戲到這裡', 'Stop here'], random: ['隨機拿一個', 'At random'],
};

LIVE_KW.fifteen = ['這次只有 15 秒', 'Fifteen seconds this time'];
LIVE_KW.tapecolor = ['顏色是驚喜', 'Color is a surprise'];
LIVE_KW.thankvisit = ['謝謝來訪', 'Thank you for visiting'];
LIVE_KW.ourschool = ['我們學校的校徽', 'Our school logo'];
LIVE_KW.ovaltape = ['驚喜是 OVAL 立可帶', 'Correction tape · OVAL'];
LIVE_KW.nextlogo = ['下一個 Logo', "Here's the next logo"];
LIVE_KW.goodjob = ['稱讚', 'Good job!'];
LIVE_KW.everyonegreat = ['大家都很棒', 'Everyone did great'];

/* V5.2 工作分工（不改原本 role 欄位）：host1 主要英文主持／host2 計時與計分／helper 小幫手／shared 共用 */
const DUTY_HOST2 = ['left10', 'timesup', 'five', 'keepup', 'nochanges', 'howmany', 'points', 'bothpoints', 'totals', 'seescores', 'checkagain', 'endround', 'finalscore', 'winner', 'tie', 'tied', 'close', 'firstright', 'fivemore', 'notmuch', 'bothright'];
const DUTY_SHARED = ['hello', 'thanks', 'enjoy', 'bye', 'congrats', 'congrats2', 'goodjob', 'greatjob', 'sayagain', 'closer', 'cansee', 'listen', 'needhelp', 'anotherband', 'missing', 'takeyourtime', 'nextgroup', 'nextstation'];
const DUTY_ZH = { host1: '關主 1', host2: '關主 2', helper: '小幫手', shared: '共用' };
const dutyOf = k => { const d = LINES[k] || DYN_CHEAT[k]; if (!d) return 'host1'; if (DUTY_HOST2.includes(k)) return 'host2'; if (DUTY_SHARED.includes(k)) return 'shared'; return d.role === 'helper' ? 'helper' : 'host1'; };
for (const [k, d] of [...Object.entries(LINES), ...Object.entries(DYN_CHEAT)]) d.duty = dutyOf(k);

/* V5.2 主持速查：每段只放最常用的話術（引用既有 key，不另建資料） */
const QUICK_HOST = {
  '01 開場': ['hello', 'welcome', 'maketeams', 'teams'],
  '02 手環': ['lookcard', 'helpers', 'takebands', 'eachhand', 'allcolorsteam'],
  '03 規則': ['threerounds', 'firstlook', 'have20', 'onceperround', 'thenbw', 'tellhow', 'raisehand', 'have10', 'whitecounts', 'onepoint', 'nominus', 'morewins'],
  '04 熱身': ['practice', 'nopoints', 'goodjob', 'realgame'],
  '05 觀察': ['round', 'look20', 'readyobs', 'left10', 'timesup'],
  '06 出題': ['nextlogo', 'hascolors', 'upto', 'sec10', 'readygo2', 'keepup'],
  '07 公布': ['check', 'colors', 'brand', 'goodjob'],
  '08 計分': ['howmany', 'points', 'handsdown', 'nextq', 'endround'],
  '09 最終': ['gameend', 'finalscore'],
  '10 頒獎': ['congrats2', 'pencil', 'surprise', 'ovaltape', 'tapecolor'],
  '11 道別': ['giveback', 'thanks', 'nextstation', 'enjoy'],
};
const QUICK_TIE = ['tie', 'onemore', 'firstteam', 'readyset', 'firstright'];
