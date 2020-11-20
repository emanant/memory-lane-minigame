import { COLORS, TEXTSTYLE } from './consts.js';
import { scoreArr } from './game1.js';
let ScoreCard = new PIXI.Container();

let H = 800,
    W = 600;

const sound_success = PIXI.sound.Sound.from('./assets/sounds/success.mp3');

let endSession = false;

const initScorecard = () => {
    endSession = false;
    console.log('scra', scoreArr);
    let temp = scoreArr.length ? scoreArr.map((e, i) => (!i ? e : e - scoreArr[i - 1])) : [0, 0, 0];

    let iMax = temp.indexOf(Math.max(...temp));
    for (let i = 0; i < 3; i++) {
        containers[i].getChildAt(1).text = `${temp[i] ? temp[i] : 0}`;
        // scores[i].text = `${!i ? scoreArr[i] : scoreArr[i] - scoreArr[i - 1]}`;
        if (i === iMax) {
            highlighterRect.position.set(containers[i].x - 25, containers[i].y - 40);
            starBadge.position.set(highlighterRect.x + highlighterRect.width, highlighterRect.y + highlighterRect.height / 2);
        }
    }
    starText.text = `${temp[iMax]}`;
    console.log('starting');
    PIXI.Ticker.shared.add(initTicker);
    sound_success.play();
};

const resetScorecard = () => {
    PIXI.Ticker.shared.remove(initTicker);
    for (let i = 0; i < 5; i++) {
        stars[i].sprite.scale.set(0.5);
        // console.log('scale', stars[i].sprite.scale.x);
        stars[i].sprite.position.set(star2.x, star2.y);
        stars[i].sprite.alpha = 1;
    }
    scale = 0;
    endSession = false;
};

// Top
const topContainer = new PIXI.Container();
ScoreCard.addChild(topContainer);
const starTexture = PIXI.Texture.from('assets/star.png');
const star2 = new PIXI.Sprite.from('assets/star2.png');
star2.position.set(W / 2, H / 4 - 10);
// star2.alpha = 0.1;
star2.anchor.set(0.5, 0.5);
star2.scale.set(0.5);
star2.tint = 0xffff00;
const conicTexture = PIXI.Texture.from('assets/conic.png');
let conics = [];
const num_conics = 8;
for (let i = 0; i < num_conics; i++) {
    const conic = new PIXI.Sprite(conicTexture);
    conic.anchor.set(0, 0.5);
    conic.position.set(star2.position.x, star2.position.y);
    conic.rotation += (2 * Math.PI * i) / num_conics;
    conics.push(conic);
    topContainer.addChild(conic);
}
const starText = new PIXI.Text('1', {
    fontSize: '35px',
    align: 'center',
});
starText.anchor.set(0.5);
starText.position.set(star2.x, star2.y + 5);
topContainer.addChild(star2, starText);
topContainer;
let stars = [];
for (let i = 0; i < 5; i++) {
    const star = {
        sprite: new PIXI.Sprite.from(starTexture),
        deg: 2 * Math.PI * (i / 5),
    };
    star.sprite.anchor.set(0.5);
    star.sprite.position.set(star2.x, star2.y);
    star.sprite.scale.set(0.5);
    star.sprite.x = star2.x + Math.cos(star.deg);
    star.sprite.y = star2.y + Math.sin(star.deg);
    stars.push(star);
    topContainer.addChild(star.sprite);
}
let mask = new PIXI.Graphics();
mask.beginFill(0x000000);
mask.drawRect(0, 75, W, H / 2 - 75);
mask.endFill();
topContainer.mask = mask;

let scale = 0;
const initTicker = (delta) => {
    scale += delta * 0.01;
    star2.scale.x += 0.01 * Math.sin(scale * 10);
    star2.scale.y += 0.01 * Math.sin(scale * 10);
    for (let i = 0; i < num_conics; i++) {
        conics[i].rotation += delta * 0.01;
    }
    if (scale < 1)
        for (let i = 0; i < 5; i++) {
            // stars[i].sprite.pivot.set(star2.position.x, star2.position.y);
            stars[i].sprite.rotation += delta * 0.01;
            stars[i].sprite.position.x += Math.cos(stars[i].deg) * 5;
            stars[i].sprite.position.y += Math.sin(stars[i].deg) * 5;
            stars[i].sprite.scale.x += 0.02;
            stars[i].sprite.scale.y += 0.02;
            stars[i].sprite.alpha -= 0.02;
        }
};

// middle
const midRect = new PIXI.Graphics().beginFill(COLORS.PRIMARY, 1).drawRect(0, -40, W, 80).endFill();
midRect.transform.position.set(0, H / 2 - 75 / 2);

const midText = new PIXI.Text('Scorecard', TEXTSTYLE);
midText.anchor.set(0.5);
midText.position.set(W / 2, midRect.position.y);
ScoreCard.addChild(midRect, midText);

let iMax = scoreArr.indexOf(Math.max(...scoreArr)) || 0;

const highlighterRect = new PIXI.Graphics()
    .beginFill(COLORS.TITLE, 0.5)
    .drawRoundedRect(0, 0, W - 90, 75)
    .endFill();
const starBadge = PIXI.Sprite.from('assets/star_badge.png');
starBadge.anchor.set(0.5);
starBadge.scale.set(0.8);
ScoreCard.addChild(highlighterRect, starBadge);
let containers = [];
for (let i = 0; i < 3; i++) {
    const roundContainer = new PIXI.Container();
    const round = new PIXI.Text(`Round ${i + 1}`, TEXTSTYLE);
    round.anchor.set(0, 0.5);
    // round.position.x = 75;
    const score = new PIXI.Text(`${scoreArr[i]}`, TEXTSTYLE);
    score.anchor.set(1, 0.5);
    score.position.x = W - 150;
    roundContainer.addChild(round, score);
    roundContainer.position.set(75, H / 2 + 75 * (i + 1));
    containers.push(roundContainer);
    ScoreCard.addChild(roundContainer);
    if (iMax === i) {
        highlighterRect.position.set(roundContainer.x - 25, roundContainer.y - 40);
        // highlighterRect.pivot.set(roundContainer.x - 25, roundContainer.y - 40);

        starBadge.position.set(highlighterRect.x + highlighterRect.width, highlighterRect.y + highlighterRect.height / 2);
    }
}
// continue btn
const botRect = new PIXI.Graphics()
    .beginFill(COLORS.TEXT_PRIMARY, 0.8)
    .drawRoundedRect(200, 0.8 * H, 200, 90, 15)
    .endFill()
    .beginFill(COLORS.TITLE)
    .drawRoundedRect(200, 0.8 * H, 200, 80, 15)
    .endFill();
botRect.position.set(0, 30);
botRect.interactive = true;
botRect.buttonMode = true;
botRect.on('pointerup', () => {
    endSession = true;
});

const botText = new PIXI.Text('Continue', Object.assign({}, TEXTSTYLE, { fill: COLORS.TEXT_PRIMARY }));
botText.anchor.set(0.5);
botText.position.set(botRect.getBounds().x + botRect.width / 2, botRect.getBounds().y + botRect.height / 2 - 5);

ScoreCard.addChild(botRect, botText);

export { ScoreCard, endSession, initScorecard, resetScorecard };
