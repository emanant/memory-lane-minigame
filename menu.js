import { COLORS, TEXTSTYLE } from './consts.js';

let Home = new PIXI.Container();
// let H = window.innerHeight,
//     W = window.innerWidth;
let W = 600,
    H = 800;

// Container handle
let gameStart = false;
const setGameStart = (mode) => {
    gameStart = mode;
};

// --- Top ---
const topRect = new PIXI.Graphics()
    .beginFill(COLORS.PRIMARY, 1)
    .drawRoundedRect(150, 125, W - 300, 100, 15)
    .endFill();

const topText = new PIXI.Text('How to play', TEXTSTYLE);
topText.anchor.set(0.5);
topText.position.set(topRect.getBounds().x + topRect.width / 2, topRect.getBounds().y + topRect.height / 2);

Home.addChild(topRect, topText);

// --- Middle ---
const midRect = new PIXI.Graphics()
    .beginFill(COLORS.PRIMARY, 1)
    .drawRoundedRect(100, 250, W - 200, 200, 15)
    .endFill();

const midText = new PIXI.Text('Remember and\nRepeat the sequence\nof color.', Object.assign({}, TEXTSTYLE, { lineHeight: 40 }));
midText.anchor.set(0.5);
midText.position.set(midRect.getBounds().x + midRect.width / 2, midRect.getBounds().y + midRect.height / 2);

Home.addChild(midRect, midText);

// --- Bottom ---
const botRect = new PIXI.Graphics()
    .beginFill(COLORS.TITLE, 0.8)
    .drawRoundedRect(200, 0.8 * H, 200, 90, 15)
    .endFill()
    .beginFill(COLORS.TEXT_PRIMARY, 1)
    .drawRoundedRect(200, 0.8 * H, 200, 80, 15)
    .endFill();
botRect.pivot.set(W / 2, 0.8 * H + 40);
botRect.position.set(botRect.pivot.x, botRect.pivot.y);
botRect.interactive = true;
botRect.buttonMode = true;

const botText = new PIXI.Text('Play', Object.assign({}, TEXTSTYLE, { fill: COLORS.TITLE }));
botText.anchor.set(0.5);
botText.position.set(botRect.getBounds().x + botRect.width / 2, botRect.getBounds().y + botRect.height / 2);

botRect.on('pointerover', () => {
    // console.log('over');
    botRect.scale.set(1.1, 1.1);
    botText.scale.set(1.1, 1.1);
});
botRect.on('pointerout', () => {
    // console.log('out');
    botRect.scale.set(1, 1);
    botText.scale.set(1, 1);
});
botRect.on('pointerup', () => {
    console.log('Starting the Game..');
    gameStart = true;
});

Home.addChild(botRect, botText);
//---- ----- -----

export { Home, gameStart, setGameStart };
