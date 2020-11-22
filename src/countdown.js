import { COLORS, TEXTSTYLE } from './consts.js';

const W = 600,
    H = 800;

const Countdown = new PIXI.Container();
const sound_cd_count = PIXI.sound.Sound.from('../assets/sounds/countdown_count.mp3');
const sound_cd_go = PIXI.sound.Sound.from('../assets/sounds/countdown_go.mp3');
// Countdown.pivot.set(W / 2, H / 2);

let finished = false;
const initCountDown = () => {
    PIXI.Ticker.shared.add(countdownTicker);
};
const resetCountdown = () => {
    i1 = 60;
    i2 = 4;
    arr = ['GO', '1', '2', '3'];
    i = 0;
    wait = 60;
    finished = false;
    text.text = '3';
    text.angle = 0;
};
const circle = new PIXI.Graphics()
    .lineStyle(2, COLORS.TEXT_PRIMARY, 1)
    .beginFill(COLORS.PRIMARY)
    .drawCircle(W / 2, H / 2, 50)
    .endFill();
circle.position.set(W / 2, H / 2);
circle.pivot.set(W / 2, H / 2);
const text = new PIXI.Text('3', Object.assign({}, TEXTSTYLE, { fontSize: 60 }));
text.anchor.set(0.5);
text.position.set(W / 2, H / 2);
// text.rotation = -Math.PI / 2;

Countdown.addChild(circle, text);
// Countdown.visible = false;

let i1 = 60,
    i2 = 4,
    arr = ['GO', '1', '2', '3'],
    i = 0,
    wait = 60;

const countdownTicker = (delta) => {
    if (!wait) {
        // Countdown.visible = true;
        if (!i1) {
            text.text = arr[i2 - 2];
            console.log(i1, i2);
        }
        if (i1 === 40) i2 === 1 ? sound_cd_go.play() : sound_cd_count.play();
        i2 ? (i1 ? (i2 == 1 && i1 == 30 ? (i1 = 0) : (i1 -= 1)) : (i1 = 60) && (i2 -= 1)) : (finished = true && PIXI.Ticker.shared.remove(countdownTicker));
        i = Math.sin((Math.PI * i1) / 60);
        // console.log(i);
        circle.scale.x = circle.scale.y = i;
        text.scale.x = text.scale.y = i;
        text.angle = -i * 90 + 80;
    } else {
        wait -= 1;
        circle.scale.x = circle.scale.y = wait / 60;
        text.scale.x = text.scale.y = wait / 60;
    }
};

export { Countdown, initCountDown, resetCountdown, finished };
