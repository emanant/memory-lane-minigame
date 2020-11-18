import { COLORS, TEXTSTYLE } from './consts.js';
import { Home, restartGame, resetMenu } from './menu.js';
import { Game1, gameOver, resetState, initGame1 } from './game1.js';

const W = 600,
    H = 800;
const app = new PIXI.Application({
    // height: window.innerHeight,
    // width: window.innerWidth,
    height: H,
    width: W,
    backgroundColor: COLORS.BACKGROUND,
    antialias: true,
});
// window.addEventListener('resize', () => {
//     app.renderer.resize(window.innerWidth, window.innerHeight);
//     app.stage.render;
// });
document.body.appendChild(app.view);

//Title
const title = new PIXI.Graphics();
title.beginFill(COLORS.TITLE, 1);
title.drawRect(0, 0, W, 75);
title.endFill();
const titleText = new PIXI.Text('First Game', TEXTSTYLE);
titleText.anchor.set(0.5);
titleText.position.set(title.width / 2, title.height / 2);

const Title = new PIXI.Container();
Title.addChild(title, titleText);

app.stage.addChild(Title);
// --- menu screen ---
app.stage.addChild(Home);

let tick = 0;
const tickerGameOver = () => {
    if (gameOver) {
        console.log('gameOver');
        resetMenu(false);
        app.stage.removeChild(Game1);
        app.stage.addChild(Home);
        app.ticker.add(tickerStartGame);
        app.ticker.remove(tickerGameOver);
    }
};
const tickerStartGame = () => {
    // console.log('ticker-start-game active');
    if (restartGame) {
        console.log('Restarting the Game');
        resetState();
        app.stage.removeChild(Home);
        app.stage.addChild(Game1);
        initGame1();
        app.ticker.add(tickerGameOver);
        app.ticker.remove(tickerStartGame);
    }
};
app.ticker.add(tickerStartGame);

// --- game screen 1 ----
// app.stage.addChild(Game1);
// setTimeout(() => {
//     makeMoveAI();
// }, 2000);
// setTimeout(() => {
//     makeMoveAI();
// }, 3000);
