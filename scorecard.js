import { COLORS, TEXTSTYLE } from './consts.js';
import { scoreArr } from './game1.js';
let ScoreCard = new PIXI.Container();

let H = 800,
    W = 600;

let endSession = false;

const initScorecard = () => {
    endSession = false;
    let temp = scoreArr.map((e, i) => (!i ? e : e - scoreArr[i - 1]));
    let iMax = temp.indexOf(Math.max(...temp));
    for (let i = 0; i < 3; i++) {
        containers[i].getChildAt(1).text = `${temp[i]}`;
        // scores[i].text = `${!i ? scoreArr[i] : scoreArr[i] - scoreArr[i - 1]}`;
        if (i === iMax) {
            highlighterRect.position.set(containers[i].x - 25, containers[i].y - 40);
            starBadge.position.set(highlighterRect.x + highlighterRect.width, highlighterRect.y + highlighterRect.height / 2);
        }
    }
};

const resetScorecard = () => {
    endSession = false;
};

const midRect = new PIXI.Graphics().beginFill(COLORS.PRIMARY, 1).drawRect(0, -40, W, 80).endFill();
midRect.transform.position.set(0, H / 2 - 75 / 2);

const midText = new PIXI.Text('Scorecard', TEXTSTYLE);
midText.anchor.set(0.5);
midText.position.set(W / 2, midRect.position.y);
ScoreCard.addChild(midRect, midText);

// let scoreArr = [4, 3, 1];
let iMax = scoreArr.indexOf(Math.max(...scoreArr)) || 0;
// console.log(iMax);

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