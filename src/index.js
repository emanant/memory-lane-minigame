import { COLORS, TEXTSTYLE } from './consts.js';
import { Menu, resetMenu, startGame, showInstructions } from './menu.js';
import { Game1, resetGame, gameOver, pauseGame, aiMoving } from './game1.js';
import { ScoreCard, endSession, initScorecard, resetScorecard } from './scorecard.js';
import { Countdown, initCountDown, resetCountdown, finished } from './countdown.js';

let W = 600,
    H = 800,
    ratio = 1;

const app = new PIXI.Application({
    height: H,
    width: W,
    backgroundColor: COLORS.BACKGROUND,
    antialias: true,
    autoResize: true,
});
document.body.appendChild(app.view);

// toggle-fullscreen svg
const svgFS = document.getElementById('fullscreen-svg');
const svgFSE = document.getElementById('exit-fullscreen-svg');
svgFS.addEventListener('click', () => document.body.requestFullscreen());
svgFSE.addEventListener('click', () => document.exitFullscreen());
document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
        svgFS.classList.add('hidden');
        svgFSE.classList.remove('hidden');
        console.log('document.fullscreenElement', document.fullscreenElement.id, event);
    } else {
        svgFS.classList.remove('hidden');
        svgFSE.classList.add('hidden');
        console.log('document.fullscreenElement', 'exited', event);
    }
});

// main canvas
const sound_mute = PIXI.sound.Sound.from('../assets/sounds/mute.wav');
const sound_pause = PIXI.sound.Sound.from('../assets/sounds/pause.mp3');
const sound_resume = PIXI.sound.Sound.from('../assets/sounds/resume.mp3');

const eggo = PIXI.Sprite.from('../assets/eggo.png');
eggo.position.set(W / 2, H / 2);
eggo.height = Math.min(H, W) / 5;
eggo.width = Math.min(H, W) / 5;
eggo.anchor.set(0.5);
eggo.visible = true;
app.stage.addChild(eggo);

//spritesheet
PIXI.Loader.shared
    // .add('../assets/spritesheet_utils.png')
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
        // app.stage.addChild(Countdown);
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

// const questionmark_gray = PIXI.Texture.from('../assets/questionmark_gray.png');
const questionmark = PIXI.Texture.from('../assets/questionmark.png');
const arrowback = PIXI.Texture.from('../assets/back.png');
const info = PIXI.Sprite.from(questionmark);
info.scale.set(0.8);
info.anchor.set(0.5);
info.position.set(75 / 2, Title.height / 2);
info.interactive = true;
info.buttomMode = true;
info.on('pointerup', () => {
    if (info.texture === questionmark) {
        sound_pause.play();
        info.texture = arrowback;
        Menu.visible = true;
        pauseGame(true);
        showInstructions();
    } else {
        sound_resume.play();
        info.texture = questionmark;
        Menu.visible = false;
        pauseGame(false);
    }
});

const volumeFull = PIXI.Texture.from('../assets/volume_full.png');
const volumeMute = PIXI.Texture.from('../assets/volume_mute.png');
const volume = PIXI.Sprite.from(volumeFull);
volume.scale.set(0.8);
volume.anchor.set(0.5);
volume.position.set(Title.width - 75 / 2, Title.height / 2);
volume.buttomMode = true;
volume.interactive = true;
volume.on('pointerup', () => {
    volume.texture = volume.texture === volumeFull ? volumeMute : volumeFull;
    PIXI.sound.toggleMuteAll();
    sound_mute.play();
});
info.visible = false;
volume.visible = false;
app.stage.addChild(Title, info, volume);

const tickerMenu = () => {
    // console.log('ticker-start menu active');
    if (startGame) {
        resetMenu();
        Menu.visible = false;
        app.stage.addChild(Countdown);
        initCountDown();
    } else if (finished) {
        resetCountdown();
        console.log('Starting the Game');
        info.visible = true;
        volume.visible = true;
        resetGame(true);
        app.stage.addChild(Game1);
        app.ticker.add(tickerGame);
        // resetMenu();
        // Menu.visible = false;
        // app.stage.removeChild(Menu);
        // Menu.visible = false;
        app.ticker.remove(tickerMenu);
    }
};
const tickerGame = () => {
    // console.log('ticker game active');
    if (gameOver) {
        resetGame();
        info.visible = false;
        volume.visible = false;
        Menu.visible = false;
        // app.stage.removeChild(Menu);
        app.stage.removeChild(Game1);
        console.log('game over');
        initScorecard();
        app.stage.addChild(ScoreCard);
        // app.stage.addChild(Menu);
        // app.ticker.add(tickerMenu);
        // app.ticker.remove(tickerGame);
    }
    if (endSession) {
        resetScorecard();
        app.stage.removeChild(ScoreCard);
        // app.stage.addChild(Menu);
        Menu.visible = true;
        resetMenu();
        app.ticker.add(tickerMenu);
        app.ticker.remove(tickerGame);
    }
    if (aiMoving && info.buttomMode) {
        // info.texture = questionmark_gray;
        info.tint = 0x1e1e1e;
        info.buttomMode = false;
        info.interactive = false;
    } else if (!aiMoving && !info.buttomMode) {
        // info.texture = questionmark;
        console.log('tinted');
        info.tint = 0xffffff;
        info.buttomMode = true;
        info.interactive = true;
    }
};

// auto resizing to aspect ratio
var scaleX, scaleY, scale, margin;
app.ticker.add(() => {
    scaleX = window.innerWidth / W;
    scaleY = window.innerHeight / H;
    scale = Math.min(scaleX, scaleY);

    app.view.style.transformOrigin = '0 0';
    app.view.style.transform = 'scale(' + scale + ')';

    if (scaleX < scaleY) {
        margin = (window.innerHeight - H * scale) / 2;
        // app.view.style.marginTop = margin + 'px';
        // app.view.style.marginBottom = margin + 'px';
        app.view.style.margin = margin + 'px 0px';
    } else {
        margin = (window.innerWidth - W * scale) / 2;
        // app.view.style.marginLeft = margin + 'px';
        // app.view.style.marginRight = margin + 'px';
        app.view.style.margin = '0px ' + margin + 'px';
    }
});

// --- menu screen ---
// app.stage.addChild(Menu);
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
