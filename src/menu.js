import { COLORS, TEXTSTYLE } from './consts.js';

let Menu = new PIXI.Container();
// let H = window.innerHeight,
//     W = window.innerWidth;
let W = 600,
    H = 800;

// Container handle
let startGame = false;
const resetMenu = () => {
    startGame = false;
    botRect.visible = true;
    botText.visible = true;
    instructions.visible = true;
};

const soundBtn = PIXI.sound.Sound.from('../assets/sounds/tap.wav');

const showInstructions = (show) => {
    // instructions.visible = show ? show : !show;
    botRect.visible = false;
    botText.visible = false;
};

// const toggleInfo = () => {
//     instructions.visible = !instructions.visible;
// };

// --- Top ---
const topRect = new PIXI.Graphics()
    .beginFill(COLORS.PRIMARY, 1)
    .drawRoundedRect(150, 125, W - 300, 100, 15)
    .endFill();

const topText = new PIXI.Text('How to play', TEXTSTYLE);
topText.anchor.set(0.5);
topText.position.set(topRect.getBounds().x + topRect.width / 2, topRect.getBounds().y + topRect.height / 2);

// Menu.addChild(topRect, topText);

// --- Middle ---
const midRect = new PIXI.Graphics()
    .beginFill(COLORS.PRIMARY, 1)
    .drawRoundedRect(100, 250, W - 200, 200, 15)
    .endFill();

const midText = new PIXI.Text('Remember and\nRepeat the sequence\nof color.', Object.assign({}, TEXTSTYLE, { lineHeight: 40 }));
midText.anchor.set(0.5);
midText.position.set(midRect.getBounds().x + midRect.width / 2, midRect.getBounds().y + midRect.height / 2);

// Menu.addChild(midRect, midText);

// Instructions
let instructions = new PIXI.Container();
instructions.addChild(topRect, topText, midRect, midText);
Menu.addChild(instructions);

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
    soundBtn.play();
    startGame = true;
    botRect.visible = false;
    botText.visible = false;
});

Menu.addChild(botRect, botText);
//---- ----- -----

export { Menu, startGame, resetMenu, showInstructions };
