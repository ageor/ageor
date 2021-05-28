const _anims = {
  select: {
    duration: 0.2,
    scale: 1.1,
    ease: 'back.out(3)',
  },
  deselect: {
    duration: 0.1,
    scale: 0.9,
    ease: 'power1.out',
  },
  clear: {
    duration: 0.4,
    scale: 0,
    ease: 'back.in(1.3)',
  },
};

export default class Cell {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.scale = 0.9;

    this.posLerp;
    this.scaleLerp;

    this.dom;
    this.outer;
    this.idx;
  }

  setSize(size) {
    this.outer.style.width = size + 'px';
    this.outer.style.height = size + 'px';

    this.size = size;

    return this;
  }

  setPosition(x, y, immediate) {
    if (immediate) {
      this.posLerp?.kill();
      this.outer.style.transform = `translate(${x}px, ${y}px)`;
    } else if (this.x !== x || this.y !== y) {
      this.posLerp?.kill();
      this.posLerp = gsap.to(this.outer, { duration: 0.1, x, y, ease: 'out' });
    }

    this.x = x;
    this.y = y;

    return this;
  }

  setStyle(className) {
    this.dom.setAttribute('class', '');
    this.dom.classList.add(className);

    return this;
  }

  setScale(scale, immediate) {
    if (immediate) {
      this.scaleLerp?.kill();
      this.dom.style.transform = `scale(${scale})`;
    } else if (this.scale !== scale) {
      this.scaleLerp?.kill();
      this.scaleLerp = gsap.to(this.dom, { duration: 0.1, scale, ease: 'out' });
    }

    this.scale = scale;

    return this;
  }

  hide() {
    this.scaleLerp?.kill();

    gsap.fromTo(this.dom, { scale: this.scale }, { ..._anims.clear });
  }

  init(container, grid, size, idx) {
    this.idx = idx;

    this.outer = document.createElement('DIV');
    this.dom = document.createElement('DIV');

    this.outer.appendChild(this.dom);
    container.appendChild(this.outer);

    this.dom.style.width = this.dom.style.height = '100%';
    this.dom.style.transform = `scale(${this.scale})`;
    // this.dom.style.transform = `scale(0)`;
    this.dom.style.pointerEvents = 'none';

    this.setSize(size);

    const row = (idx / grid.gridSize.y) | 0;
    const col = idx % grid.gridSize.x;
    this.outer.style.top = row * this.size + 10 + 'px';
    this.outer.style.left = col * this.size + 10 + 'px';

    const delay = (grid.gridSize.y - row) * 0.05 + Math.random() * 0.05;

    this.posLerp = gsap.fromTo(
      this.outer,
      { y: -360 + (260 - row * 50) },
      {
        y: 0,
        duration: 0.6,
        ease: 'expo.out',
      },
    ).delay(delay);

    // this.scaleLerp = gsap.to(this.dom, {
    //   scale: 0.9,
    //   duration: 0.4,
    //   ease: 'expo.out',
    // }).delay(delay);
  }

  select() {
    const top = document.querySelector('.top');

    if (top) {
      top.classList.toggle('top', false);
    }

    this.outer.classList.toggle('top', true);

    this.scaleLerp?.kill();

    this.scaleLerp = gsap.to(this.dom, _anims.select);

    this.scale = _anims.select.scale;

    return this;
  }

  deselect() {
    this.scaleLerp?.kill();

    this.scaleLerp = gsap.to(this.dom, _anims.deselect);

    this.scale = _anims.deselect.scale;

    return this;
  }
}