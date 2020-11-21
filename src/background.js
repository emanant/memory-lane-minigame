const bg = new PIXI.Application({
    height: window.innerHeight,
    window: window.innerWidth,
    antialias: true,
    resizeTo: window,
});

document.getElementById('bg').appendChild(bg.view);

// bg.view.style.zIndex = -1;
// bg.view.style.position = 'absolute';
// bg.view.style.top = 0;
// bg.view.style.left = 0;
const bgTicker = (delta) => {
    bg.view.style.transformOrigin = '0 0';
};
bg.ticker.add(bgTicker);

// particles
let numParticles = 250;
const drops = new PIXI.ParticleContainer(numParticles, {
    scale: true,
    position: true,
    alpha: true,
});
bg.stage.addChild(drops);

const UL_Y = 20,
    UL_X = 2,
    LL_X = -2;

const generateParticles = (texture) =>
    new Array(numParticles).fill().map((p) => {
        p = new PIXI.Sprite.from(texture);
        p.scale.set(Math.random() * 0.1);
        // console.log(p.scale.x, p.scale.y, p.height, p.width);
        p.x = Math.floor(Math.random() * bg.renderer.width);
        p.y = Math.floor(Math.random() * bg.renderer.height);
        p.vx = Math.floor(Math.random() * UL_X) - UL_X;
        p.vy = Math.floor(Math.random() * UL_Y);
        p.alpha = Math.random();
        drops.addChild(p);
        return p;
    });

const ball = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 100).endFill();
const ballTexture = bg.renderer.generateTexture(ball);
let particles = generateParticles(ballTexture);

bg.ticker.add((delta) => {
    let H = bg.renderer.height,
        W = bg.renderer.width;

    for (let p of particles) {
        // console.log(p.x);
        p.x += p.vx;
        p.y += p.vy;
        if (Math.random() > 0.9) p.vx = Math.random() > 0.5 ? Math.max(LL_X, p.vx - 1) : Math.min(p.vx + 1, UL_X);
        if (Math.random() > 0.9) p.vy = Math.min(p.vy + 1, UL_Y);
        if (p.x > W || p.y > H || p.x < 0) {
            p.x = Math.floor(Math.random() * W);
            p.y = -(Math.floor(Math.random() * H) + p.height);
            // p.y = -p.height);
            p.vy = Math.floor(Math.random() * UL_Y);
        }
    }
});
