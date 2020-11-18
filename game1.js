import { COLORS, TEXTSTYLE } from './consts.js';

const Game1 = new PIXI.Container();
let W = 600,
    H = 800;

let state = {
    round: 1,
    lives: 3,
    score: 0,
    scoreArr: [],
    aiMoves: 0,
    aiMoveHist: [],
    playerMoves: 0,
    playerMoveHist: [],
};
let gameOver = false;
let timer = 0,
    startTimer = false;

// Container handler
const resetState = () => {
    state.round = 1;
    state.lives = 3;
    state.score = 0;
    state.scoreArr = [];
    state.aiMoves = 0;
    state.aiMoveHist = [];
    state.playerMoves = 0;
    state.playerMoveHist = [];
    scoreText.text = `Score: ${state.score}`;
    roundText.text = `Round: ${state.round}/${state.lives}`;
};
const initGame1 = () => {
    resetState();
    PIXI.Ticker.shared.add(timeOutTicker);
    setTimeout(() => {
        makeMoveAI();
    }, 1000);
};
const gameOverHandler = () => {
    PIXI.Ticker.shared.remove(timeOutTicker);
    gameOver = true;
    resetState();
};
const timeOutTicker = () => {
    if (startTimer) {
        timer += 1;
        // console.log('.');
        if (timer === 500) {
            flashOverlay('Time Over, Try Again');
        }
    }
};

// --- scoreBar ---
const scoreBar = new PIXI.Graphics();
scoreBar.beginFill(COLORS.PRIMARY, 1);
scoreBar.transform.position.set(0, 75);
scoreBar.drawRect(0, 0, W, 75);
scoreBar.endFill();

const roundText = new PIXI.Text(`Round: ${state.round}/${state.lives}`, TEXTSTYLE);
roundText.anchor.set(0.4, 0.5);
roundText.position.set(scoreBar.width / 8, scoreBar.position.y + scoreBar.height / 2);

const scoreText = new PIXI.Text(`Score: ${state.score}`, TEXTSTYLE);
scoreText.anchor.set(0.5);
scoreText.position.set((7 * scoreBar.width) / 8, scoreBar.position.y + scoreBar.height / 2);

const watchText = new PIXI.Text('Watch', TEXTSTYLE);
watchText.anchor.set(0.5);
watchText.position.set(scoreBar.width / 2, scoreBar.position.y + (3 * scoreBar.height) / 2);
watchText.visible = false;

Game1.addChild(scoreBar, roundText, scoreText, watchText);

// --- middle interactive screen ---
// animated squares
let squareHL = PIXI.Texture.from('./assets/square_6.png');
let animatedHL = new PIXI.AnimatedSprite([squareHL, squareHL]);
animatedHL.anchor.set(0.5);
animatedHL.width = W * 0.4 + 20;
animatedHL.height = W * 0.4 + 20;
animatedHL.loop = false;
animatedHL.visible = false;
animatedHL.animationSpeed = 0.1;
animatedHL.onComplete = () => (animatedHL.visible = false);

let squareCR = PIXI.Texture.from('./assets/square_5.png');
let animatedCR = new PIXI.AnimatedSprite([squareCR, squareCR]);
animatedCR.anchor.set(0.5);
animatedCR.width = W * 0.4 + 20;
animatedCR.height = W * 0.4 + 20;
animatedCR.loop = false;
animatedCR.visible = false;
animatedCR.animationSpeed = 0.06;
animatedCR.onComplete = () => (animatedCR.visible = false);

// stationary squares
let squares = [],
    offset = 140;
const iNames = ['red', 'yellow', 'green', 'blue'];
for (let i = 0; i < 4; i++) {
    let square = PIXI.Sprite.from('./assets/square_' + (i + 1) + '.png');
    square.width = W * 0.4;
    square.height = W * 0.4;
    square.anchor.set(0.5);
    square.buttonMode = true;
    square.interactive = true;
    square.position.set(i % 2 ? W / 2 - offset : W / 2 + offset, i < 2 ? (H * 3) / 5 - offset : (H * 3) / 5 + offset);

    squares.push(square);

    square.on('pointertap', (e) => {
        console.log(`${!!e ? 'Player' : 'AI'} : ${iNames[i]} clicked`);
        animatedHL.position.set(square.x, square.y);
        animatedHL.visible = true;
        animatedHL.play();
        timer = 0;
        if (!!e) {
            makeMovePlayer(i);
        }
    });
    Game1.addChild(square);
}
Game1.addChild(animatedHL, animatedCR);

// overlays
const overlay = new PIXI.Graphics()
    .beginFill(COLORS.PRIMARY, 0.5)
    .drawRect(0, 75, W, H - 75)
    .endFill()
    .beginFill(COLORS.PRIMARY, 0.8)

    .drawRect(0, H / 2 - 50, W, 160)
    .endFill();
const overlay_text = new PIXI.Text('Wrong move !\ntry again', Object.assign({}, TEXTSTYLE, { lineHeight: 40, fontSize: 30, fontWeight: 'bold' }));
overlay_text.anchor.set(0.5);
overlay_text.position.set(overlay.getBounds().x + overlay.width / 2, overlay.getBounds().y + overlay.height / 2);
overlay.visible = false;
overlay_text.visible = false;
Game1.addChild(overlay, overlay_text);

const toggleButtonMode = () => {
    for (let i = 0; i < 4; i++) {
        squares[i].interactive = !squares[i].interactive;
        squares[i].buttonMode = !squares[i].buttonMode;
    }
    console.log(`button mode ${squares[0].buttonMode}`);
};

// ----- AI moves -----
const makeMoveAIscheduled = (i) => {
    setTimeout(() => {
        squares[state.aiMoveHist[i]].emit('pointertap');
    }, 1000 * i);
};
const makeMoveAI = (newMove = true) => {
    watchText.visible = true;
    if (newMove) {
        var milliseconds = new Date().getMilliseconds();
        let pos = Math.floor((milliseconds * 4) / 1000);
        state.aiMoveHist.push(pos);
        state.aiMoves += 1;
    }
    let i = 0;
    for (i = 0; i < state.aiMoves; i++) {
        makeMoveAIscheduled(i);
    }
    setTimeout(() => {
        watchText.visible = false;
        toggleButtonMode();
        timer = 0;
        startTimer = true;
    }, 1000 * (i - 1) + 500);
    console.log(state.aiMoveHist);
};

// ----- player Moves -----
const flashOverlay = (message) => {
    toggleButtonMode();
    state.playerMoves = 0;
    state.playerMoveHist = [];
    overlay_text.text = message ? message : state.round > state.lives ? 'Game Over' : 'Wrong Move!\nTry again';
    overlay.visible = true;
    overlay_text.visible = true;
    setTimeout(() => {
        overlay.visible = false;
        overlay_text.visible = false;
    }, 2000);
    setTimeout(() => {
        if (state.round > state.lives) {
            gameOverHandler();
            resetState();
        } else if (message && state.aiMoves > 2) {
            state.round += 1;
            roundText.text = `Round: ${state.round}/${state.lives}`;
        }
        makeMoveAI(false);
    }, 2500);
};

const correctSequence = (i) => {
    console.log('Correct Moves .. ');
    toggleButtonMode();
    state.score += 1;
    scoreText.text = `Score: ${state.score}`;
    state.playerMoveHist = [];
    state.playerMoves = 0;
    animatedCR.position.set(squares[i].x, squares[i].y);
    animatedCR.visible = true;
    animatedCR.play();
    startTimer = false;
    setTimeout(() => makeMoveAI(true), 2000);
};

const validateMove = (i) => {
    if (state.aiMoveHist[state.playerMoves - 1] !== state.playerMoveHist[state.playerMoves - 1]) {
        console.log(`WRONG MOVE! ${state.lives - state.round} lives remaining!`);
        if (state.aiMoves > 2 && state.round <= state.lives) {
            state.round += 1;
            roundText.text = `Round: ${state.round}/${state.lives}`;
        }
        flashOverlay();
    } else {
        if (state.aiMoves === state.playerMoves) correctSequence(i);
    }
};
const makeMovePlayer = (pos) => {
    state.playerMoveHist.push(pos);
    state.playerMoves += 1;
    console.log(state.playerMoveHist);
    timer = 0;
    validateMove(pos);
};

toggleButtonMode();
// resetGame();

export { Game1, initGame1, gameOver, resetState };
