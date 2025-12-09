let standSpriteSheet;
let walkSpriteSheet;
let runSpriteSheet;
let rollSpriteSheet;
let jumpSpriteSheet;
let attackSpriteSheet;
let standSpriteSheet2; // 角色二的待機圖片精靈
let hitSpriteSheet2; // 角色二被攻擊的圖片精靈
let triggerSpriteSheet2; // 角色二觸發的圖片精靈
let electrocutionSpriteSheet2; // 角色二電擊的圖片精靈
let danceSpriteSheet2; // 角色二跳舞的圖片精靈

let quizTable; // 用於儲存 CSV 題庫資料
let currentQuestion; // 當前的題目物件

let standAnimation = [];
let walkAnimation = [];
let runAnimation = [];
let rollAnimation = [];
let jumpAnimation = [];
let attackAnimation = [];
let standAnimation2 = []; // 角色二的待機動畫
let hitAnimation2 = []; // 角色二被攻擊的動畫
let triggerAnimation2 = []; // 角色二觸發的動畫
let electrocutionAnimation2 = []; // 角色二電擊的動畫
let danceAnimation2 = []; // 角色二跳舞的動畫

let characterX;
let characterY;
let velocityY = 0;
const gravity = 0.6;
const jumpForce = -15;
let isJumping = false;
let isAttacking = false;
let groundY;
let character2X; // 角色二的 X 座標
let character2Y; // 角色二的 Y 座標
let isCharacter2Hit = false; // 角色二是否被擊中
let isCharacter2Triggered = false; // 角色二是否被觸發
let isCharacter2Electrocuted = false; // 角色二是否正在被電擊
let isCharacter2Dancing = false; // 角色二是否正在跳舞
let character2HitTimer = -1; // 角色二被攻擊後的計時器，用於停止3秒
let dancePauseTimer = -1; // 角色二跳舞後的暫停計時器

let currentFrameIndex = 0;
let lastAnimationType = null;
let direction = 1; // 1 for right, -1 for left
let currentFrameIndex2 = 0; // 角色二的當前畫格索引
let hitFrameIndex2 = 0; // 角色二被攻擊動畫的畫格索引
let triggerFrameIndex2 = 0; // 角色二觸發動畫的畫格索引
let electrocutionFrameIndex2 = 0; // 角色二電擊動畫的畫格索引
let danceFrameIndex2 = 0; // 角色二跳舞動畫的畫格索引
let inputField; // 文字輸入框
let playerName = ''; // 儲存玩家名字
let hasProvidedName = false; // 是否已經提供過名字
let confirmButton, declineButton; // 確認與拒絕按鈕
let dialogMessage = ''; // 要顯示的對話內容
let dialogState = 'none'; // 對話狀態: none, 1_askName, 2_inputName, 3_confirmStart, 4_askQuestion, 5_inputAnswer, 6_showFeedback, completed
let showFinalDialog = false; // 是否顯示最終對話
let finalDialogTimer = -1; // 最終對話的計時器
let inputFieldVisible = false; // 追蹤輸入框是否已顯示過
let score = 0; // 新增分數變數
let questionsAnswered = 0; // 已回答的題數

// 按鈕矩形區域
let yesButtonRect = {x: 0, y: 0, w: 60, h: 40};
let noButtonRect = {x: 0, y: 0, w: 60, h: 40};
let showChoiceButtons = false; // 是否顯示選擇按鈕


// 待機動畫的屬性
const standFrameCount = 16;
const standSheetWidth = 699;
const standFrameWidth = standSheetWidth / standFrameCount;

// 走路動畫的屬性
const walkFrameCount = 17;
const walkSheetWidth = 930;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跑步動畫的屬性
const runFrameCount = 16;
const runSheetWidth = 1243;
const runFrameHeight = 70;
const runFrameWidth = runSheetWidth / runFrameCount;

// 翻滾動畫的屬性
const rollFrameCount = 3;
const rollSheetWidth = 184;
const rollFrameHeight = 53;
const rollFrameWidth = rollSheetWidth / rollFrameCount;

// 跳躍動畫的屬性
const jumpFrameCount = 4;
const jumpSheetWidth = 247;
const jumpFrameHeight = 72;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

// 攻擊動畫的屬性
const attackFrameCount = 19;
const attackSheetWidth = 2788;
const attackFrameHeight = 89;
const attackFrameWidth = attackSheetWidth / attackFrameCount;

// 角色二待機動畫的屬性
const standFrameCount2 = 19;
const standSheetWidth2 = 1078;
const standSheetHeight2 = 82;
const standFrameWidth2 = standSheetWidth2 / standFrameCount2;

// 角色二被攻擊動畫的屬性
const hitFrameCount2 = 25;
const hitSheetWidth2 = 2720;
const hitSheetHeight2 = 103;
const hitFrameWidth2 = hitSheetWidth2 / hitFrameCount2;

// 角色二觸發動畫的屬性
const triggerFrameCount2 = 16;
const triggerSheetWidth2 = 1259;
const triggerSheetHeight2 = 91;
const triggerFrameWidth2 = triggerSheetWidth2 / triggerFrameCount2;

// 角色二電擊動畫的屬性
const electrocutionFrameCount2 = 5;
const electrocutionSheetWidth2 = 565;
const electrocutionSheetHeight2 = 131;
const electrocutionFrameWidth2 = electrocutionSheetWidth2 / electrocutionFrameCount2;

// 角色二跳舞動畫的屬性
const danceFrameCount2 = 9;
const danceSheetWidth2 = 868;
const danceSheetHeight2 = 99;
const danceFrameWidth2 = danceSheetWidth2 / danceFrameCount2;

// 在 setup() 之前預先載入圖片資源
function preload() {
  standSpriteSheet = loadImage('角色一/待機/all.png');
  walkSpriteSheet = loadImage('角色一/走/all.png');
  runSpriteSheet = loadImage('角色一/跑跑/all.png');
  rollSpriteSheet = loadImage('角色一/翻滾/all.png');
  jumpSpriteSheet = loadImage('角色一/跳/all2.png');
  attackSpriteSheet = loadImage('角色一/向前攻擊/all.png');
  // 載入角色二的圖片
  standSpriteSheet2 = loadImage('角色二/待機/all.png');
  hitSpriteSheet2 = loadImage('角色二/被攻擊/all.png');
  triggerSpriteSheet2 = loadImage('角色二/觸發/all.png');
  electrocutionSpriteSheet2 = loadImage('角色二/電擊/all.png');
  danceSpriteSheet2 = loadImage('角色二/跳舞/all.png');
  // 載入 CSV 題庫，'csv' 表示檔案類型，'header' 表示第一行為標題
  quizTable = loadTable('quiz.csv', 'csv', 'header');
}

function setup() {
  // 建立一個填滿整個瀏覽器視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 建立輸入框並初始隱藏
  inputField = createInput();
  inputField.hide();

  // 按鈕已改為手動繪製的白色方框

  // 初始化角色位置在畫面中央
  characterX = width / 2;
  groundY = height / 2;
  characterY = groundY;

  // 初始化角色二的位置在角色一左邊
  character2X = width / 4;
  character2Y = groundY;

  // 將圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < standFrameCount; i++) {
    let frame = standSpriteSheet.get(i * standFrameWidth, 0, standFrameWidth, 88); // 待機高度為 88
    standAnimation.push(frame);
  }

  // 將走路的圖片精靈切割成 17 個獨立的畫格
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, 88); // 走路高度為 88
    walkAnimation.push(frame);
  }

  // 將跑步的圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < runFrameCount; i++) {
    let frame = runSpriteSheet.get(i * runFrameWidth, 0, runFrameWidth, runFrameHeight);
    runAnimation.push(frame);
  }

  // 將翻滾的圖片精靈切割成 11 個獨立的畫格
  for (let i = 0; i < rollFrameCount; i++) {
    let frame = rollSpriteSheet.get(i * rollFrameWidth, 0, rollFrameWidth, rollFrameHeight);
    rollAnimation.push(frame);
  }

  // 將跳躍的圖片精靈切割成 4 個獨立的畫格
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = jumpSpriteSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }

  // 將攻擊的圖片精靈切割成 19 個獨立的畫格
  for (let i = 0; i < attackFrameCount; i++) {
    let frame = attackSpriteSheet.get(i * attackFrameWidth, 0, attackFrameWidth, attackFrameHeight);
    attackAnimation.push(frame);
  }

  // 將角色二的圖片精靈切割成 19 個獨立的畫格
  for (let i = 0; i < standFrameCount2; i++) {
    let frame = standSpriteSheet2.get(i * standFrameWidth2, 0, standFrameWidth2, standSheetHeight2);
    standAnimation2.push(frame);
  }

  // 將角色二被攻擊的圖片精靈切割成 25 個獨立的畫格
  for (let i = 0; i < hitFrameCount2; i++) {
    let frame = hitSpriteSheet2.get(i * hitFrameWidth2, 0, hitFrameWidth2, hitSheetHeight2);
    hitAnimation2.push(frame);
  }

  // 將角色二觸發的圖片精靈切割成 7 個獨立的畫格
  for (let i = 0; i < triggerFrameCount2; i++) {
    let frame = triggerSpriteSheet2.get(i * triggerFrameWidth2, 0, triggerFrameWidth2, triggerSheetHeight2);
    triggerAnimation2.push(frame);
  }

  // 將角色二電擊的圖片精靈切割成 5 個獨立的畫格
  for (let i = 0; i < electrocutionFrameCount2; i++) {
    let frame = electrocutionSpriteSheet2.get(i * electrocutionFrameWidth2, 0, electrocutionFrameWidth2, electrocutionSheetHeight2);
    electrocutionAnimation2.push(frame);
  }

  // 將角色二跳舞的圖片精靈切割成 9 個獨立的畫格
  for (let i = 0; i < danceFrameCount2; i++) {
    let frame = danceSpriteSheet2.get(i * danceFrameWidth2, 0, danceFrameWidth2, danceSheetHeight2);
    danceAnimation2.push(frame);
  }
}

// 顯示對話框
function showDialogBox(message) {
  const textY = character2Y - 80; // 文字方塊在角色上方
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 200); // 白色半透明背景
  rectMode(CENTER);
  rect(character2X, textY, textWidth(message) + 30, 40, 5); // 圓角矩形
  fill(0); // 黑色文字
  text(message, character2X, textY);
}

// 顯示輸入框
function showInputField() {
  if (!inputFieldVisible) {
    inputField.show();
    inputField.style('position', 'absolute');
    inputField.style('font-size', '16px');
    inputField.style('padding', '5px');
    inputField.style('z-index', '100');
    inputField.position(characterX - 50, characterY - 100); // 輸入框顯示在角色一上方
    inputField.elt.focus(); // 自動聚焦輸入框
    inputFieldVisible = true;
  }
}

// 顯示確認按鈕（白色方框）
function showConfirmButtons() {
  const msg = playerName + "，歡迎你! 是否開始回答測驗?";
  const textY = character2Y - 80;
  
  // 顯示對話框背景和文字
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 200); // 白色半透明背景
  rectMode(CENTER);
  rect(character2X, textY, textWidth(msg) + 30, 40, 5); // 圓角矩形
  fill(0); // 黑色文字
  text(msg, character2X, textY);
  
  // 顯示選擇按鈕 - 白色方框
  const buttonY = character2Y + 60; // 角色二下方
  const buttonWidth = 60;
  const buttonHeight = 40;
  
  // 是按鈕
  yesButtonRect = {x: character2X - 80, y: buttonY, w: buttonWidth, h: buttonHeight};
  fill(255, 255, 255); // 白色背景
  stroke(0); // 黑色邊框
  strokeWeight(2);
  rectMode(CORNER);
  rect(yesButtonRect.x, yesButtonRect.y, yesButtonRect.w, yesButtonRect.h, 5);
  
  // 是文字
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text('是', yesButtonRect.x + yesButtonRect.w / 2, yesButtonRect.y + yesButtonRect.h / 2);
  
  // 否按鈕
  noButtonRect = {x: character2X + 20, y: buttonY, w: buttonWidth, h: buttonHeight};
  fill(255, 255, 255); // 白色背景
  stroke(0); // 黑色邊框
  strokeWeight(2);
  rectMode(CORNER);
  rect(noButtonRect.x, noButtonRect.y, noButtonRect.w, noButtonRect.h, 5);
  
  // 否文字
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text('否', noButtonRect.x + noButtonRect.w / 2, noButtonRect.y + noButtonRect.h / 2);
  
  showChoiceButtons = true;
}

function draw() {
  // 設定背景顏色
  background('#a8dadc');

  // --- 繪製計分板 ---
  textSize(24);
  fill(0); // 黑色文字
  textAlign(LEFT, TOP); // 設定文字對齊方式
  text('分數: ' + score, 20, 20); // 在左上角顯示分數

  // --- 決定角色二的方向 ---
  let direction2 = 1; // 預設向右
  if (characterX < character2X) {
    direction2 = -1; // 如果角色一在左邊，角色二就轉向左邊
  }

  // --- 角色二互動邏輯 ---
  const triggerDistance = 150; // 觸發動畫的距離
  const distance = abs(characterX - character2X);
  // 如果角色一靠近，且角色二當前不是被攻擊或已觸發狀態
  if (distance < triggerDistance && !isCharacter2Hit && !isCharacter2Triggered) {
    if (dialogState === 'none' || dialogState === 'completed') {
      isCharacter2Triggered = true; // 播放觸發動畫
      triggerFrameIndex2 = 0;
      // 根據是否已提供過名字來決定從哪個步驟開始
      if (!hasProvidedName) {
        dialogState = '1_askName'; // 開始對話流程的第一步 - 詢問名字
      } else {
        // 如果已經提供過名字，則直接詢問是否開始新的測驗
        dialogState = '3_confirmStart';
        finalDialogTimer = millis(); // 啟動計時器
      }
    }
  }

  // --- 對話系統邏輯 ---
  // 如果玩家離開觸發範圍，重置所有對話狀態
  if (distance >= triggerDistance && dialogState !== 'none') {
    resetDialog();
  }

  // 根據不同對話狀態顯示UI
  switch (dialogState) {
    case '1_askName':
      showDialogBox("你叫什麼名字?");
      // 觸發動畫播放完畢後，自動進入下一步
      if (!isCharacter2Triggered) {
        dialogState = '2_inputName';
      }
      break;
    case '2_inputName':
      showDialogBox("你叫什麼名字?");
      showInputField();
      break;
    case '3_confirmStart':
      showDialogBox(playerName + "，歡迎你! 是否開始回答測驗?");
      showConfirmButtons();
      break;
    case '4_askQuestion':
      const questionText = currentQuestion.getString('題目');
      showDialogBox(questionText);
      // 短暫顯示問題後，自動進入輸入答案的步驟
      if (millis() - finalDialogTimer > 2000) {
        dialogState = '5_inputAnswer';
      }
      break;
    case '5_inputAnswer':
      const qText = currentQuestion.getString('題目');
      showDialogBox(qText);
      showInputField();
      break;
  }

  // --- 繪製角色二 ---
  imageMode(CENTER);
  if (isCharacter2Dancing) {
    // 播放跳舞動畫 (最高優先級)
    let frameToShow = danceAnimation2[danceFrameIndex2];

    // 動畫播放完畢後，進入暫停階段
    if (danceFrameIndex2 >= danceAnimation2.length) {
      frameToShow = danceAnimation2[danceAnimation2.length - 1]; // 顯示最後一幀
      if (dancePauseTimer === -1) {
        dancePauseTimer = millis(); // 啟動暫停計時器
      }
    }

    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(frameToShow, 0, 0);
      pop();
    } else {
      image(frameToShow, character2X, character2Y);
    }

    if (frameCount % 6 === 0 && danceFrameIndex2 < danceAnimation2.length) { // 控制跳舞動畫速度
      danceFrameIndex2++;
    }

    // 檢查暫停時間是否結束
    if (dancePauseTimer !== -1 && millis() - dancePauseTimer > 500) {
      isCharacter2Dancing = false;
      danceFrameIndex2 = 0;
      dancePauseTimer = -1;
      dialogState = '6_showFeedback'; // 顯示最終分數
      finalDialogTimer = millis();
    }
  } else if (isCharacter2Electrocuted) {
    // 播放電擊動畫 (最高優先級)
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(electrocutionAnimation2[electrocutionFrameIndex2], 0, 0);
      pop();
    } else {
      image(electrocutionAnimation2[electrocutionFrameIndex2], character2X, character2Y);
    }
    if (frameCount % 6 === 0) { // 控制電擊動畫速度
      electrocutionFrameIndex2++;
    }
    // 動畫播放完畢後，顯示最終分數
    if (electrocutionFrameIndex2 >= electrocutionAnimation2.length) {
      isCharacter2Electrocuted = false;
      electrocutionFrameIndex2 = 0;
      // 動畫結束後，進入顯示分數的狀態
      dialogState = '6_showFeedback';
      finalDialogTimer = millis();
    }
  } else if (isCharacter2Hit) {
    // 播放被攻擊動畫
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(hitAnimation2[hitFrameIndex2], 0, 0);
      pop();
    } else {
      image(hitAnimation2[hitFrameIndex2], character2X, character2Y);
    }
    if (frameCount % 4 === 0) { // 控制被攻擊動畫速度
      hitFrameIndex2++;
    }
    // 動畫播放完畢後，進入停止狀態
    if (hitFrameIndex2 >= hitAnimation2.length) {
      isCharacter2Hit = false;
      hitFrameIndex2 = 0;
      character2HitTimer = millis(); // 記錄被攻擊結束的時間
      isCharacter2Triggered = false; // 禁用觸發動畫
    }
  } else if (millis() - character2HitTimer < 3000 && character2HitTimer !== -1) {
    // 被攻擊後停止3秒，顯示被攻擊動畫的第22幀（索引21）作為受傷姿態
    const injuredFrame = 21; // 第22幀對應索引21
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(hitAnimation2[injuredFrame], 0, 0);
      pop();
    } else {
      image(hitAnimation2[injuredFrame], character2X, character2Y);
    }
  } else if (character2HitTimer !== -1) {
    // 3秒後重置計時器
    character2HitTimer = -1;
  } else if (isCharacter2Triggered) {
    // 播放觸發動畫
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(triggerAnimation2[triggerFrameIndex2], 0, 0);
      pop();
    } else {
      image(triggerAnimation2[triggerFrameIndex2], character2X, character2Y);
    }

    if (frameCount % 6 === 0) { // 控制觸發動畫速度
      triggerFrameIndex2++;
    }
    // 動畫播放完畢後，恢復待機狀態
    if (triggerFrameIndex2 >= triggerAnimation2.length) {
      isCharacter2Triggered = false;
    }
  } else {
    // 播放待機動畫，並根據方向翻轉
    currentFrameIndex2 = floor(frameCount / 6) % standAnimation2.length;
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(standAnimation2[currentFrameIndex2], 0, 0);
      pop();
    } else {
      image(standAnimation2[currentFrameIndex2], character2X, character2Y);
    }
  }

  if (dialogState === '6_showFeedback') {
    const textY = character2Y - 80; // 文字方塊在角色上方
    // 設定文字樣式
    textSize(20);
    textAlign(CENTER, CENTER);
    // 繪製文字背景方塊
    fill(255, 255, 255, 200); // 白色半透明背景
    rectMode(CENTER);
    rect(character2X, textY, textWidth(dialogMessage) + 30, 40, 5); // 圓角矩形
    fill(0); // 黑色文字
    text(dialogMessage, character2X, textY);

    // 檢查計時器是否超過2秒
    if (millis() - finalDialogTimer > 2000) {
      dialogMessage = '';
      dialogState = 'completed'; // 對話流程結束，進入完成狀態
    }
  }

  // 設定圖片的繪製模式為中心對齊
  imageMode(CENTER);

  // --- 攻擊動畫邏輯 (最高優先級) ---
  if (isAttacking) {
    // --- 攻擊碰撞檢測 ---
    const attackRange = 120; // 角色一的攻擊範圍
    // 在攻擊動畫的特定影格檢查碰撞 (例如第5到10幀)
    if (currentFrameIndex >= 5 && currentFrameIndex <= 10) {
      if (direction === 1 && character2X > characterX && character2X < characterX + attackRange) {
        isCharacter2Hit = true;
        hitFrameIndex2 = 0; // 重置被攻擊動畫
      } else if (direction === -1 && character2X < characterX && character2X > characterX - attackRange) {
        isCharacter2Hit = true;
        hitFrameIndex2 = 0; // 重置被攻擊動畫
      }
    }

    // 根據角色方向繪製攻擊動畫
    if (direction === -1) {
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(attackAnimation[currentFrameIndex], 0, 0);
      pop();
    } else {
      image(attackAnimation[currentFrameIndex], characterX, characterY);
    }

    // 每 3 個繪圖幀更新一次攻擊動畫的畫格
    if (frameCount % 3 === 0) {
      currentFrameIndex++;
    }

    // 如果動畫播放完畢，結束攻擊狀態
    if (currentFrameIndex >= attackAnimation.length) {
      isAttacking = false;
    }
    // return; // 正在攻擊時，不執行後續的移動和待機邏輯
  }

  // --- 跳躍物理計算 ---
  if (isJumping) {
    velocityY += gravity; // 施加重力
    characterY += velocityY; // 更新Y座標

    // 如果角色落地
    if (characterY >= groundY) {
      characterY = groundY; // 將Y座標固定在地面上
      velocityY = 0;
      isJumping = false; // 結束跳躍狀態
    }
  }

  // 根據按鍵更新角色X座標
  // 當角色不在跳躍時，才能左右移動
  if (!isJumping && !isAttacking) {
    if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 翻滾速度
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 翻滾速度
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 跑步速度
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 跑步速度
  } else if (keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 3;
  } else if (keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 3;
  }

  }
  // 防止角色走出畫布邊界
  // 我們使用較寬的走路畫格寬度來計算，確保角色身體不會超出邊界
  const characterHalfWidth = walkFrameWidth / 2;
  characterX = constrain(characterX, characterHalfWidth, width - characterHalfWidth);

  // --- 繪製角色一動畫 ---
  let animationDrawn = false; // 標記是否已繪製過動畫

  // 檢查方向鍵
  if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    if (isJumping) {
      // 如果在跳躍中，優先顯示跳躍動畫
      currentFrameIndex = min(floor(jumpAnimation.length * 0.75), jumpAnimation.length - 1); // 跳躍中途的幀
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(jumpAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(jumpAnimation[currentFrameIndex], characterX, characterY);
      }
      animationDrawn = true;
    }
    // 向右翻滾
    if (lastAnimationType !== 'rollRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollRight';
    }
    // currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;
    // image(rollAnimation[currentFrameIndex], characterX, characterY);
    // return; // 翻滾動畫完成後結束
  } else if (keyIsDown(UP_ARROW) && !isJumping) {
    // 觸發跳躍
    isJumping = true;
    velocityY = jumpForce;
    lastAnimationType = 'jump';
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    // 向左翻滾
    if (lastAnimationType !== 'rollLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollLeft';
    }
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    // 向右跑
    if (lastAnimationType !== 'runRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'runRight';
    }
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    // 向左跑
    if (lastAnimationType !== 'runLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'runLeft';
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    // 向右走
    if (lastAnimationType !== 'walkRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkRight';
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    // 向左移動
    if (lastAnimationType !== 'walkLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkLeft';
    }
  } else {
    // 待機
    if (lastAnimationType !== 'stand') {
      currentFrameIndex = 0;
      lastAnimationType = 'stand';
    }
  }

  // 如果動畫尚未繪製（例如，不是在跳躍中按翻滾鍵）
  if (!animationDrawn) {
    // 根據 lastAnimationType 繪製對應的動畫
    if (isAttacking) {
      // 攻擊動畫已在前面處理
    } else if (isJumping) {
      // 根據垂直速度決定播放哪一幀，模擬上升和下降的樣子
      if (velocityY < -5) currentFrameIndex = 1; // 上升
      else if (velocityY > 5) currentFrameIndex = 2; // 下降
      else currentFrameIndex = 0; // 最高點
      drawCharacterFrame(jumpAnimation[currentFrameIndex]);
    } else if (lastAnimationType === 'rollRight') {
      currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;
      image(rollAnimation[currentFrameIndex], characterX, characterY);
    } else if (lastAnimationType === 'rollLeft') {
    currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;

    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(rollAnimation[currentFrameIndex], 0, 0); 
    pop(); // 恢復原本的繪圖狀態
    } else if (lastAnimationType === 'runRight') {
      currentFrameIndex = floor(frameCount / 4) % runAnimation.length;
      image(runAnimation[currentFrameIndex], characterX, characterY);
    } else if (lastAnimationType === 'runLeft') {
      currentFrameIndex = floor(frameCount / 4) % runAnimation.length;
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(runAnimation[currentFrameIndex], 0, 0);
      pop();
    } else if (lastAnimationType === 'walkRight') {
      currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
      image(walkAnimation[currentFrameIndex], characterX, characterY);
    } else if (lastAnimationType === 'walkLeft') {
      currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(walkAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(walkAnimation[currentFrameIndex], characterX, characterY);
      }
    } else { // 'stand'
      currentFrameIndex = floor(frameCount / 6) % standAnimation.length;
      drawCharacterFrame(standAnimation[currentFrameIndex]);
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 輔助函式，用於繪製角色一的畫格（包含方向翻轉）
function drawCharacterFrame(frame) {
  if (direction === -1) {
    push();
    translate(characterX, characterY);
    scale(-1, 1);
    image(frame, 0, 0);
    pop();
  } else {
    image(frame, characterX, characterY);
  }
}

// 鼠標點擊事件處理
function mousePressed() {
  // 檢查是否在選擇按鈕顯示時點擊
  if (showChoiceButtons && dialogState === '3_confirmStart') {
    // 檢查是否點擊了"是"按鈕
    if (mouseX > yesButtonRect.x && mouseX < yesButtonRect.x + yesButtonRect.w &&
        mouseY > yesButtonRect.y && mouseY < yesButtonRect.y + yesButtonRect.h) {
      startQuiz();
      return false;
    }
    
    // 檢查是否點擊了"否"按鈕
    if (mouseX > noButtonRect.x && mouseX < noButtonRect.x + noButtonRect.w &&
        mouseY > noButtonRect.y && mouseY < noButtonRect.y + noButtonRect.h) {
      endDialog();
      return false;
    }
  }
}

function keyPressed() {
  // 當按下空白鍵，且角色不在跳躍或攻擊中時，觸發攻擊
  if (key === ' ' && !isJumping && !isAttacking) {
    isAttacking = true;
    currentFrameIndex = 0; // 從第一幀開始播放
    lastAnimationType = 'attack';
  }

  // 當輸入框可見時，按下 Enter 鍵
  if (keyCode === ENTER) {
    if (dialogState === '2_inputName') {
      const name = inputField.value().trim();
      if (name !== '') {
        playerName = name;
        hasProvidedName = true; // 標記已提供名字
        inputField.value('');
        inputField.hide();
        inputFieldVisible = false;
        dialogState = '3_confirmStart'; // 進入確認是否開始測驗的狀態
        finalDialogTimer = millis(); // 啟動計時器
      }
    } else if (dialogState === '5_inputAnswer') {
      const answer = inputField.value().trim();
      if (answer !== '') {
        const correctAnswer = currentQuestion.getString('答案');
        questionsAnswered++; // 回答題數加一

        if (answer === correctAnswer) {
          score += 10;
        } else {
          score -= 5;
        }

        // 檢查結束條件：回答滿10題 或 分數變為負數
        if (questionsAnswered >= 10) {
          // 測驗結束
          inputField.hide();
          inputFieldVisible = false;
          dialogMessage = "測驗結束！你的總分是：" + score;

          if (score === 100) {
            // 滿分，觸發跳舞動畫
            isCharacter2Dancing = true;
            danceFrameIndex2 = 0;
            dancePauseTimer = -1; // 重置暫停計時器
          } else if (score < 30) {
            // 分數太低，觸發電擊動畫
            isCharacter2Electrocuted = true;
            electrocutionFrameIndex2 = 0;
          } else {
            dialogState = '6_showFeedback'; // 直接顯示分數
            finalDialogTimer = millis();
          }
        } else {
          // 繼續下一題
          inputField.value('');
          currentQuestion = quizTable.getRow(floor(random(quizTable.getRowCount())));
          dialogState = '4_askQuestion';
          finalDialogTimer = millis();
        }
      }
    }
  }
}

// 按下 "是" 按鈕後觸發的函式
function startQuiz() {
  showChoiceButtons = false;
  score = 0; // 重置分數
  questionsAnswered = 0; // 重置已回答題數
  // 從題庫中隨機選一題
  currentQuestion = quizTable.getRow(floor(random(quizTable.getRowCount())));
  dialogState = '4_askQuestion'; // 進入提問狀態
  finalDialogTimer = millis(); // 啟動計時器，用於短暫顯示問題
}

// 按下 "否" 按鈕或離開範圍時觸發的函式
function endDialog() {
  showChoiceButtons = false;
  dialogState = 'completed'; // 標記為已完成，避免立即重新觸發
  // 可以加一個 "好吧，下次再來！" 的訊息
  dialogMessage = "好吧，下次再來！";
  dialogState = '6_showFeedback';
  finalDialogTimer = millis();
}

// 重置對話相關的所有變數
function resetDialog() {
  dialogState = 'none';
  inputField.hide();
  inputFieldVisible = false;
  showChoiceButtons = false;
  // 注意：不重置 playerName 和 hasProvidedName，以便下次可以直接繼續
  dialogMessage = '';
}
