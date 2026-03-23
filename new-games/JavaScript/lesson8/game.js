// קוד סודי שעוזר למערכת להבין איפה חסר קוד (אל תמחקו!)
const ___ = "חסר_קוד";

// ==========================================
// אזור המשימות שלכם! (אופרטורים ו-getElementById)
// עליכם להשלים את הקוד היכן שמופיעים קווים תחתונים (___)
// ==========================================

let totalSeaBlocks = 0; 
let totalCaptured = 0;
let score = 0;
let lives = 3;

// פונקציה זו מופעלת בכל פעם שאתם סוגרים שטח!
function processAreaCapture(newBlocksCount) {
    let pointsEarned = newBlocksCount * 10;
    
    // משימה 3: אופרטור חיבור
    // עדכנו את הניקוד הכללי (score) כך שיכיל את הערך הקודם שלו ועוד הנקודות שהרווחנו כרגע (pointsEarned).
    score = ___ ;

    // משימה 4: שימוש ב- getElementById
    // מצאו בקובץ ה-HTML מהו ה-ID של המקום בו אמור להופיע הניקוד, והשלימו.
    document.getElementById("___").innerText = score;

    totalCaptured = totalCaptured + newBlocksCount;
    
    // משימה 5: אופרטורים מתמטיים (כפל וחילוק)
    // חשבו את האחוזים. הנוסחה: השטח שנלכד (totalCaptured) חלקי (/) סך הכל השטח (totalSeaBlocks), כפול (*) 100.
    let percentage = ___ ;

    document.getElementById("percentDisplay").innerText = Math.floor(percentage);
    playSound('capture');
    
    if (percentage >= 80) { 
        gameWon(); 
    }
}

// פונקציה זו מופעלת בכל פעם שהווירוס פוגע בכם!
function processDeath() {
    // משימה 6: אופרטור חיסור
    // החסירו 1 מכמות החיים הקיימת (lives) בכל פעם שנפסלים.
    lives = ___ ;

    document.getElementById("livesDisplay").innerText = lives;
    playSound('fail');
    
    if (lives <= 0) { 
        gameOver(); 
    }
}

// ==========================================
// מערכת בדיקת קוד חכמה - לא לגעת!
// ==========================================

function checkCodeAndStart() {
    let errors = [];
    
    let captureStr = processAreaCapture.toString();
    if (captureStr.includes('score = ___') || captureStr.includes('score = "חסר_קוד"')) {
        errors.push("❌ משימה 3: לא השלמתם את משוואת החיבור עבור המשתנה score.");
    }
    if (captureStr.includes('getElementById("___")') || captureStr.includes('getElementById("חסר_קוד")')) {
        errors.push("❌ משימה 4: לא הכנסתם את המזהה הנכון (ID) של תצוגת הניקוד מה-HTML.");
    }
    if (captureStr.includes('percentage = ___') || captureStr.includes('percentage = "חסר_קוד"')) {
        errors.push("❌ משימה 5: לא השלמתם את נוסחת חישוב האחוזים (כפל וחילוק).");
    }

    let deathStr = processDeath.toString();
    if (deathStr.includes('lives = ___') || deathStr.includes('lives = "חסר_קוד"')) {
        errors.push("❌ משימה 6: לא השלמתם את משוואת החיסור עבור משתנה החיים (lives).");
    }

    if (errors.length > 0) {
        alert("המערכת מזהה קוד חסר או שגוי! הנה מה שנשאר לכם לתקן:\n\n" + errors.join("\n\n"));
    } else {
        initAudio(); 
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'flex';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('game-instructions').style.display = 'block';
        startGame();
    }
}

// ==========================================
// מנוע המשחק (Xonix Engine) והסאונד - לא לגעת מכאן והלאה
// ==========================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() { 
    if (!audioCtx) audioCtx = new AudioContext(); 
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
}

function playSound(type) { 
    initAudio(); 
    const o = audioCtx.createOscillator(); 
    const g = audioCtx.createGain(); 
    o.connect(g); 
    g.connect(audioCtx.destination); 

    if (type === 'capture') { 
        o.type = 'sine'; o.frequency.setValueAtTime(600, audioCtx.currentTime); o.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2); g.gain.setValueAtTime(0.1, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2); o.start(); o.stop(audioCtx.currentTime + 0.2); 
    } else if (type === 'fail') { 
        o.type = 'sawtooth'; o.frequency.setValueAtTime(150, audioCtx.currentTime); o.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.4); g.gain.setValueAtTime(0.2, audioCtx.currentTime); g.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4); o.start(); o.stop(audioCtx.currentTime + 0.4); 
    } else if (type === 'win') { 
        o.type = 'square'; o.frequency.setValueAtTime(400, audioCtx.currentTime); o.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1); o.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2); g.gain.setValueAtTime(0.15, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6); o.start(); o.stop(audioCtx.currentTime + 0.6); 
    } 
}

const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
const container = document.getElementById('game-container');

const TILE_SIZE = 15; 
const COLS = canvas.width / TILE_SIZE; 
const ROWS = canvas.height / TILE_SIZE; 

let grid = []; let enemies = []; let player = { c: 0, r: 0, dc: 0, dr: 0, wasInSea: false }; 
let isGameOver = false; let lastTime = 0; let moveTimer = 0; let animationFrame = 0;

function initGrid() { grid = []; totalSeaBlocks = 0; totalCaptured = 0; for (let r = 0; r < ROWS; r++) { grid[r] = []; for (let c = 0; c < COLS; c++) { if (r <= 1 || r >= ROWS - 2 || c <= 1 || c >= COLS - 2) { grid[r][c] = 1; } else { grid[r][c] = 0; totalSeaBlocks++; } } } }
function initLevel() { player = { c: COLS/2, r: 1, dc: 0, dr: 0, wasInSea: false }; enemies = []; for(let i=0; i<3; i++) { enemies.push({ x: 10 + Math.random() * (COLS - 20), y: 10 + Math.random() * (ROWS - 20), dx: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1), dy: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1), pulseOffset: Math.random() * Math.PI * 2 }); } }
function startGame() { score = 0; lives = 3; document.getElementById("scoreDisplay").innerText = score; document.getElementById("livesDisplay").innerText = lives; document.getElementById("percentDisplay").innerText = "0"; initGrid(); initLevel(); isGameOver = false; document.getElementById('overlay').style.display = 'none'; container.focus(); requestAnimationFrame(gameLoop); }
function resetGame() { startGame(); }
function gameOver() { isGameOver = true; document.getElementById('msgText').innerText = "המערכת נפרצה!"; document.getElementById('msgText').style.color = "#ff4757"; document.getElementById('overlay').style.display = 'flex'; }
function gameWon() { isGameOver = true; playSound('win'); document.getElementById('msgText').innerText = "המערכת נוקתה ב-100%!"; document.getElementById('msgText').style.color = "#2ed573"; document.getElementById('overlay').style.display = 'flex'; }

function fillCapturedArea() { let tempGrid = Array(ROWS).fill().map(() => Array(COLS).fill(0)); let queue = []; enemies.forEach(e => { let ec = Math.floor(e.x), er = Math.floor(e.y); if (er >= 0 && er < ROWS && ec >= 0 && ec < COLS && grid[er][ec] === 0) { if(tempGrid[er][ec] === 0) { queue.push({r: er, c: ec}); tempGrid[er][ec] = 1; } } }); while(queue.length > 0) { let curr = queue.shift(); let dirs = [[0,1], [0,-1], [1,0], [-1,0]]; for(let d of dirs) { let nr = curr.r + d[0], nc = curr.c + d[1]; if(nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) { if(grid[nr][nc] === 0 && tempGrid[nr][nc] === 0) { tempGrid[nr][nc] = 1; queue.push({r: nr, c: nc}); } } } } let newLand = 0; for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { if ((grid[r][c] === 0 && tempGrid[r][c] === 0) || grid[r][c] === 2) { grid[r][c] = 1; newLand++; } } } return newLand; }
function die() { processDeath(); if(isGameOver) return; for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { if(grid[r][c] === 2) grid[r][c] = 0; } } player = { c: COLS/2, r: 1, dc: 0, dr: 0, wasInSea: false }; }

container.addEventListener('keydown', (e) => { if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault(); if(isGameOver) return; if (e.code === 'ArrowUp' && player.dr !== 1) { player.dc = 0; player.dr = -1; } if (e.code === 'ArrowDown' && player.dr !== -1) { player.dc = 0; player.dr = 1; } if (e.code === 'ArrowLeft' && player.dc !== 1) { player.dc = -1; player.dr = 0; } if (e.code === 'ArrowRight' && player.dc !== -1) { player.dc = 1; player.dr = 0; } });

function update(dt) { animationFrame++; moveTimer += dt; enemies.forEach(e => { let currR = Math.floor(e.y), currC = Math.floor(e.x); if(grid[currR] && grid[currR][currC] === 2) die(); let nextC = Math.floor(e.x + e.dx); if (nextC < 0 || nextC >= COLS || grid[currR][nextC] === 1) e.dx *= -1; let nextR = Math.floor(e.y + e.dy); if (nextR < 0 || nextR >= ROWS || grid[nextR][currC] === 1) e.dy *= -1; e.x += e.dx; e.y += e.dy; if (Math.abs(e.x - player.c) < 1 && Math.abs(e.y - player.r) < 1 && grid[player.r][player.c] !== 1) die(); }); if (moveTimer > 35) { moveTimer = 0; if (player.dc !== 0 || player.dr !== 0) { let nextC = player.c + player.dc; let nextR = player.r + player.dr; if (nextC >= 0 && nextC < COLS && nextR >= 0 && nextR < ROWS) { let target = grid[nextR][nextC]; if (target === 2) { die(); } else if (target === 1) { if (player.wasInSea) { player.wasInSea = false; processAreaCapture(fillCapturedArea()); } player.c = nextC; player.r = nextR; player.dc = 0; player.dr = 0; } else if (target === 0) { player.wasInSea = true; player.c = nextC; player.r = nextR; grid[nextR][nextC] = 2; } } else { player.dc = 0; player.dr = 0; } } } }

function draw() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.strokeStyle = '#121a21'; 
    ctx.lineWidth = 1; 
    for(let i=0; i<COLS; i++) { 
        ctx.beginPath(); 
        ctx.moveTo(i*TILE_SIZE, 0); 
        ctx.lineTo(i*TILE_SIZE, canvas.height); 
        ctx.stroke(); 
    } 
    for(let i=0; i<ROWS; i++) { 
        ctx.beginPath(); 
        ctx.moveTo(0, i*TILE_SIZE); 
        ctx.lineTo(canvas.width, i*TILE_SIZE); 
        ctx.stroke(); 
    } 
    for (let r = 0; r < ROWS; r++) { 
        for (let c = 0; c < COLS; c++) { 
            if (grid[r][c] === 1) { 
                ctx.fillStyle = '#1f2833'; 
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.fillStyle = 'rgba(69, 162, 158, 0.3)'; 
                ctx.fillRect(c * TILE_SIZE + 2, r * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4); 
                ctx.strokeStyle = '#0b0c10'; ctx.lineWidth = 1; 
                ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
            } 
            else if (grid[r][c] === 2) { 
                ctx.fillStyle = '#66fcf1'; 
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); 
                ctx.shadowColor = '#66fcf1'; 
                ctx.shadowBlur = 10; 
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); ctx.shadowBlur = 0; 
            } 
        } 
    } 
    enemies.forEach(e => { 
        let pulse = Math.sin(animationFrame * 0.1 + e.pulseOffset) * 2; 
        let radius = (TILE_SIZE / 2.2) + pulse; 
        ctx.fillStyle = (Math.floor(animationFrame * 0.2) % 2 === 0) ? '#ff4757' : '#000'; 
        ctx.beginPath(); 
        ctx.arc(e.x * TILE_SIZE + TILE_SIZE/2, e.y * TILE_SIZE + TILE_SIZE/2, Math.max(2, radius), 0, Math.PI * 2); 
        ctx.fill(); ctx.fillStyle = '#fff'; 
        ctx.font = '16px Arial'; ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle'; ctx.fillText('👾', e.x * TILE_SIZE + TILE_SIZE/2, e.y * TILE_SIZE + TILE_SIZE/2); 
    }); 
    let pc = player.c * TILE_SIZE; 
    let pr = player.r * TILE_SIZE; 
    ctx.fillStyle = '#c5c6c7'; 
    ctx.fillRect(pc, pr, TILE_SIZE, TILE_SIZE); 
    ctx.shadowColor = '#66fcf1'; 
    ctx.shadowBlur = 15 + Math.sin(animationFrame * 0.3) * 5; 
    ctx.strokeStyle = '#66fcf1'; 
    ctx.lineWidth = 2; ctx.strokeRect(pc, pr, TILE_SIZE, TILE_SIZE); 
    ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; 
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🤖', pc + TILE_SIZE/2, pr + TILE_SIZE/2 + 1); 
}

function gameLoop(timestamp) { 
    if (!lastTime) lastTime = timestamp; 
    let dt = timestamp - lastTime; 
    lastTime = timestamp; 
    update(dt); 
    draw(); 
    if (!isGameOver) requestAnimationFrame(gameLoop); 
}