# 關主英文助手 V5 交付報告

© 2026 啾啾菇

## 1. 檔案清單

| 檔案 | 狀態 | 說明 |
|---|---|---|
| index.html | 修改 | 新標題、manifest、載入 files.js 與 v5.js、版本參數 v=500 |
| app.js | 修改 | 情境模擬流程依新話術順序（計分 → 放下手 → 介紹品牌）、原首頁改成「進階情境模擬」頁 |
| data.js | 重新產生 | COLORS、BAND_CARDS、CARDS 與 V4 逐字相同；話術改為 Excel 168 筆＋補充 8 筆 |
| style.css | 修改 | 只在檔尾追加 V5 樣式，原本樣式沒有刪除 |
| v5.js | 新增 | 首頁、快速複習、弱點加強、完整話術庫、現場小抄、紀錄、貼紙、設定、AI 陪練、資料遷移 |
| files.js | 新增 | 離線快取清單與版本 |
| sw.js | 新增 | Service Worker（相對路徑，支援 /host-sim/ 子路徑） |
| manifest.webmanifest | 新增 | 加到主畫面用 |
| icon-192.png、icon-512.png | 新增 | App 圖示（柴犬，奶油底） |
| assets/ | 未變動 | 61 張圖片 |

## 2. 功能保留／合併／移動

| 原功能 | 處理 |
|---|---|
| 情境模擬（完整、快速、段落、弱點） | 保留，移到首頁次要入口「進階情境模擬」；分數改稱「和參考話術的相似度」 |
| 口說卡片 | 擴充為「快速複習」：5／10／20 張、進階篩選、三級自評、補考 |
| 話術小抄 | 改名「完整話術庫」：篩選、收合、收藏、加入待加強；保留「一題示範」「顏色數字」（數字擴充到 0～30） |
| 首頁的麥克風測試、文法勾選 | 移到「設定」；文法檢查預設關閉，開啟前會說明會送到 LanguageTool |
| 首頁的貼紙牆 | 移到「貼紙收藏」頁 |
| 首頁的清除紀錄 | 移到「設定」，需確認兩次 |
| 新增 | 現場小抄、弱點加強、練習紀錄、AI 口語陪練、匯出／匯入、離線使用、防休眠 |
| 刪除 | 無 |

## 3. 資料整合

- Excel 168 列全部匯入；加上 8 句補充的臨時狀況短句，共 **176 句**。
- 138 列對應到原本的 key（沿用 key，舊練習紀錄不會遺失），其中 **22 句英文有修改**；**28 句是新增**。
- 每句都有：段落、英文、中文、類型、角色、其他說法、情境、說明、狀態（新增／修改／保留）。
- 動態句型（16 個）：分組、回合、題號、顏色數、可舉手數、答案顏色、品牌、得分、累計、勝隊、加賽勝隊，會自動處理單複數（one point／two points）和 and。
- 「Ready? Set, go!」在 Excel 出現 3 次：觀察開始 `readyobs`、作答開始 `readygo2`、加賽 `readyset`。

### 修改的句子（舊 → 新）
| key | 舊 | 新 |
|---|---|---|
| `maketeams` | Let's make two teams. | Let's split into two teams. |
| `tellhow` | I'll tell you how many colors there are. | I'll tell you how many colors it has. |
| `raisehand` | Raise your hands to show the right colors. | Raise your hands to show the correct colors. |
| `nominus` | No points off for wrong answers. | You don't lose any points for wrong answers. |
| `practice` | Let's practice first! | Let's try a practice question first! |
| `round3` | Round three! Each logo has four to six colors. | Let's move on to the hardest round! The logos have four to six colors. |
| `qintro` | Question one! Look at this logo! | Here's the first logo! |
| `sec10` | You have ten seconds. | You have ten seconds to choose the correct colors. |
| `readygo2` | Ready... set... go! | Ready? Set, go! |
| `check` | Let's see the answer! | Let's check the answer! |
| `colors` | The colors are red and white! | The correct colors are red and white! |
| `bothgreat` | Both teams did great! | Both teams did a great job! |
| `handsdown` | OK! Hands down. | Hands down, please! |
| `finalscore` | Let's see the final scores! | Shall we check the final scores? |
| `winner` | And the winner is... Team A! | Team A wins the game! |
| `readyset` | Are you ready? Ready, set, go! | Ready? Set, go! |
| `pencil` | Everyone gets a pencil case! | Everyone gets a pencil case as a gift! |
| `surprise` | We have a special surprise for you! | There's a special surprise inside your pencil cases! |
| `ovaltape` | It's correction tape from OVAL! | The special surprise is correction tape from OVAL. |
| `rememberbrand` | Remember this brand? We just saw this logo in the game! | You saw this brand in our game, right? |
| `hopelike` | I hope you like it! | I hope you all like your gifts! |
| `nextstation` | It's time for your next station! | Now it's time to move on to your next station! |

### 新增的句子
| key | 英文 |
|---|---|
| `takebands` | Each person, please take one or two. |
| `allcolorsteam` | Make sure your team has all ten colors. |
| `threerounds` | There are three rounds in this game. |
| `onceperround` | You can only look at the board once per round. |
| `ourschool` | This is our school logo. |
| `readyobs` | Ready? Set, go! |
| `finalboard` | This is the final logo board! |
| `hurry` | Time's almost up! Hurry up! |
| `nextq` | Let's move on to the next question! |
| `nextlogo` | Here's the next logo! |
| `ohbear` | This is OhBear, Taiwan's tourism mascot. |
| `olympic` | These are the Olympic rings. |
| `familymart` | This is FamilyMart, a Japanese convenience store chain. |
| `ovalbrand` | This is OVAL, a Taiwanese stationery brand. |
| `howmany` | How many colors did you get right? |
| `bothright` | You got both colors right! |
| `bothpoints` | Four points for Team A and three points for Team B! |
| `whichwins` | Which team is the winner? |
| `opennow` | Yes, you can open them now! |
| `manycolors` | It comes in many beautiful colors. |
| `random` | You'll get one at random. |
| `whichcolor` | Let's see which color you got! |
| `okfewer` | It's okay to raise only three hands. |
| `guess` | Just take a guess! |
| `moretime` | Do you need more time to remember the colors? |
| `thirty` | How about thirty seconds? |
| `givethirty` | Okay, I'll give you thirty seconds. |
| `lastq` | Let's make this our last question. |

### 我補充的句子（Excel 沒有，給臨時狀況用，狀態標「新增」）
| key | 英文 |
|---|---|
| `sayagain` | Let me say that again. |
| `tellready` | Tell me when you're ready. |
| `canmore` | You can raise more hands if you want. |
| `fivemore` | OK, five more seconds! |
| `anotherband` | Here's another wristband. |
| `checkagain` | Let me check the scores again. |
| `nextgroup` | The next group is here, so let's finish up. |
| `stophere` | Let's stop the game here. |

## 4. Excel 和正式設定不一致的地方（未擅自改正式資料，請確認）

1. **第 17 列** "Make sure your team has all ten colors." —— 正式手環是 **8 色**。我照 Excel 收錄，並在說明欄標示；建議改成 eight colors 或 all the colors。
2. **第 92 列** FamilyMart —— 正式題卡沒有全家，第二回合是 7-ELEVEN。保留這句但標示「沒有這張題卡」，現場小抄不會用到它。
3. **第 44 列** "This is our school logo." —— 熱身題卡是熊本北高中校徽和熊本熊；中壢高商校徽是正式題卡 3-2。已標示說明。
4. **第 165、166 列** 延長到 30 秒 —— 標示為「臨時延長，不是正式規則」，只放在臨時狀況。
5. 「舉太多手」原本在出題段，依規格移到 12 臨時狀況。
6. 現場核心句約 53 句，超過規格建議的 30～40 句，因為 14 條規則都要涵蓋；其餘話術收在每段的「展開更多」。

## 5. 實際測試結果

測試環境：本機以 `/host-sim/` 子路徑架站，Chromium（Playwright）手機 390×844 與桌機 1280×860。

| 結果 | 項目 | 備註 |
|---|---|---|
| ✅ | 遷移：schemaVersion=5 |  |
| ✅ | 遷移：貼紙保留 |  |
| ✅ | 遷移：模擬歷史保留 |  |
| ✅ | 遷移：卡片 bad→level bad |  |
| ✅ | 遷移：卡片 streak→level good |  |
| ✅ | 遷移：麥克風設定保留 |  |
| ✅ | 遷移：有備份 |  |
| ✅ | 首頁：四個主要入口 |  |
| ✅ | 複習：說不出來會補考（佇列變長） | {"q": 11, "base": 10, "idx": 11} |
| ✅ | 複習：完成畫面 |  |
| ✅ | 複習：三級自評已存（說不出來會記 badN／lastBad） | [['good', 0, 0], ['shaky', 2, 1795748656950], ['shaky', 0, 0], ['good', 0, 0]] |
| ✅ | 篩選：新增句數 = Excel 新增 28 + 補充 8 | [36, 8, 11] |
| ✅ | 弱點：套用角色篩選 |  |
| ✅ | 話術庫：搜尋時保留焦點 |  |
| ✅ | 話術庫：搜尋有結果 | 10 |
| ✅ | 收藏：可新增 |  |
| ✅ | 顏色數字：0～30 |  |
| ✅ | 現場：9 人分組英文 | Four over here, please. Five over there, please. |
| ✅ | 現場：兩次點擊到任一段落 |  |
| ✅ | 現場：4 色題英文單複數 |  |
| ✅ | 現場：計分在放下手之前、品牌在放下手之後 | 9,10,11 |
| ✅ | 現場：答案顏色自動帶入 |  |
| ✅ | 計分：本題得分不超過顏色數 | 4 |
| ✅ | 計分：確認後加入累計 | [4, 1] |
| ✅ | 計分：可以復原 |  |
| ✅ | 現場：同回合下一題停在 06 出題 |  |
| ✅ | 臨時狀況：兩次點擊找到話術 |  |
| ✅ | 臨時狀況：關閉後回到原流程 | ["06 出題",2,0,0,null] |
| ✅ | 平手：顯示加賽流程 |  |
| ✅ | 現場：不自動朗讀 |  |
| ✅ | 現場：重新整理後可繼續 |  |
| ✅ | 現場：恢復段落與分數 |  |
| ✅ | 下一組：清除回合分數 |  |
| ✅ | 下一組：練習紀錄保留 |  |
| ✅ | 設定：文法檢查預設關閉（遷移後） |  |
| ✅ | 情境模擬：可正常作答 |  |
| ✅ | 情境模擬：報告 |  |
| ✅ | 離線：必要檔案已快取 | True |
| ✅ | 離線：首頁可開 |  |
| ✅ | 離線：現場小抄可看 |  |
| ✅ | Console 沒有未處理錯誤 |  |
| ✅ | 版面：沒有水平溢出 |  |

另外：情境模擬題目產生器回歸測試 200 輪，參考答案與「也可以說」全部判為正確（0 失敗），平均每輪 90 步。

**沒有實測的部分（請勿視為已通過）：**
- 真的 iPhone Safari、Android Chrome（防休眠、加到主畫面、語音朗讀的實際效果）。
- 部署到 GitHub Pages 後的離線（本機用同樣子路徑測過，但 GitHub 的快取行為未實測）。
- 匯入 JSON（程式有驗證與失敗還原，但沒有用真的檔案操作測試）。
- 麥克風辨識（測試環境沒有麥克風）。

## 6. 未完成

- P2 填空練習、間隔重複排程：沒有做。快速複習目前是「不熟的優先＋隨機」。
- 「試算表」artifact 的話術表尚未更新成 V5 資料。

## 7. 上傳與離線

1. GitHub 的 host-sim 儲存庫 → Add file → Upload files。
2. 把壓縮檔解開後**所有檔案**拖進去（index.html、app.js、data.js、v5.js、files.js、sw.js、style.css、manifest.webmanifest、icon-192.png、icon-512.png；assets 資料夾沒變可以不傳）→ Commit。
3. 等 1～2 分鐘，用手機開網站，**保持網路開著**，首頁底下出現「● 已可離線使用」就完成。
4. 想要像 App：iPhone Safari 分享 → 加入主畫面；Android Chrome 選單 → 加到主畫面。
5. 之後再更新檔案時，首頁會出現「有新版本可以更新」，按了才換版；現場小抄進行中不會自動重新整理。
6. 活動前建議先在設定「匯出 JSON」備份練習紀錄。
