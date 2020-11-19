import { COLORS, TEXTSTYLE } from './consts.js';
import { Menu, resetMenu, startGame } from './menu.js';
import { Game1, resetGame, gameOver } from './game1.js';
import { ScoreCard, endSession, resetScorecard } from './scorecard.js';

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

const eggo = PIXI.Sprite.from('assets/eggo.png');
eggo.position.set(W / 2, H / 2);
eggo.height = Math.min(H, W) / 5;
eggo.width = Math.min(H, W) / 5;
eggo.anchor.set(0.5);
eggo.visible = true;
app.stage.addChild(eggo);

//spritesheet
PIXI.Loader.shared
    // .add('assets/spritesheet_utils.png')
    .add('assests/spritesheet_utils.json')
    .load()
    .onProgress.add(() => {
        console.log('loading');
    });
PIXI.Loader.shared.onComplete.add(() => {
    console.log('completed');
    //dummy loader
    setTimeout(() => {
        eggo.visible = false;
        resetMenu();
        app.stage.addChild(Menu);
        app.ticker.add(tickerMenu);
    }, 1500);
});
console.log(PIXI.Loader.shared.resources);

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
// app.stage.addChild(Menu);

const tickerMenu = () => {
    // console.log('ticker-start menu active');
    if (startGame) {
        console.log('Starting the Game');
        resetGame(startGame);
        app.stage.addChild(Game1);
        app.ticker.add(tickerGame);
        resetMenu();
        app.stage.removeChild(Menu);
        app.ticker.remove(tickerMenu);
    }
};
const tickerGame = () => {
    // console.log('ticker game active');
    if (gameOver) {
        resetGame();
        app.stage.removeChild(Game1);
        console.log('game over');
        resetScorecard();
        app.stage.addChild(ScoreCard);
        // app.stage.addChild(Menu);
        // app.ticker.add(tickerMenu);
        // app.ticker.remove(tickerGame);
    }
    if (endSession) {
        resetScorecard();
        app.stage.removeChild(ScoreCard);
        app.stage.addChild(Menu);
        app.ticker.add(tickerMenu);
        app.ticker.remove(tickerGame);
    }
};

// app.ticker.add(tickerMenu);

// --- game screen 1 ----
// app.stage.addChild(Game1);
// setTimeout(() => {
//     makeMoveAI();
// }, 2000);
// setTimeout(() => {
//     makeMoveAI();
// }, 3000);

// --- score board ---
// app.stage.addChild(ScoreCard);
