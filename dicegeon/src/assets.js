import { Loader, Spritesheet } from '/src/lib/pixi.min.js';

export const HumanID = {
  human1: 'human1',
  human2: 'human2',
  human3: 'human3',
};

export const HumanoidID = {
  orc: 'orc',
};

const humanFrames = {
  [HumanID.human1]: {
    frame: { 
      x: 0,
      y: 0,
      w: 16,
      h: 16,
    },
  },
  [HumanID.human2]: {
    frame: { 
      x: 0,
      y: 17 * 1,
      w: 16,
      h: 16,
    },
  },
  [HumanID.human3]: {
    frame: { 
      x: 0,
      y: 17 * 2,
      w: 16,
      h: 16,
    },
  },
};

const humanoidFrames = {
  [HumanoidID.orc]: {
    frame: { 
      x: 0,
      y: 17 * 3,
      w: 16,
      h: 16,
    },
  },
};

function genIDs(prefix, count) {
  const ids = {};

  for (let i = 1; i <= count; i++) {
    ids[prefix + i] = prefix + i;
  }

  return ids;
}

export const ChestID = genIDs('top', 120);
export const BottomID = genIDs('bottom', 8);
export const ShoeID = genIDs('shoes', 12);
export const HairID = genIDs('hair', 60);
export const BeardID = genIDs('beard', 20);
export const HelmID = genIDs('helm', 36);
export const ShieldID = genIDs('shield', 60);
export const StaffID = genIDs('staff', 20);
export const MaceID = genIDs('mace', 6);
export const FlailID = genIDs('flail', 6);
export const SpearID = genIDs('spear', 6);
export const PikeID = genIDs('pike', 6);
export const PoleID = genIDs('pole', 12);
export const AxeID = genIDs('axe', 6);
export const HammerID = genIDs('hammer', 6);
export const HatchetID = genIDs('hatchet', 6);
export const ScytheID = genIDs('scythe', 6);
export const BowID = genIDs('bow', 10);
export const BladeID = genIDs('blade', 20);

function genSingleFrame(x, y) {
  return {
    frame:{
      x: 17 * x + 1,
      y: 17 * y,
      w: 16,
      h: 16,
    },
  };
}

function genFrames(assetIDs, x, y, w) {
  const frames = {};

  let col = x;
  let row = y;

  for (let id of assetIDs) {
    frames[id] = genSingleFrame(col, row);

    col++;

    if (col >= x + w) {
      col = x;
      row++;
    }
  }

  return frames;
}

const chestFrames = genFrames(Object.keys(ChestID), 6, 0, 12);

const bottomFrames = {
  ...genFrames(Object.keys(BottomID).slice(0, 4), 3, 0, 1),
  ...genFrames(Object.keys(BottomID).slice(4), 3, 5, 1),
};

const shoeFrames = {
  ...genFrames(Object.keys(ShoeID).slice(0, 4), 4, 0, 1),
  ...genFrames(Object.keys(ShoeID).slice(4, 8), 4, 5, 1),
  ...genFrames(Object.keys(ShoeID).slice(8, 10), 3, 4, 2),
  ...genFrames(Object.keys(ShoeID).slice(10), 3, 9, 2),
};

const hairFrames = {
  ...genFrames(Object.keys(HairID).slice(0, 24), 19, 0, 8),
  ...genFrames(Object.keys(HairID).slice(24, 48), 19, 4, 8),
  ...genFrames(Object.keys(HairID).slice(48, 60), 19, 8, 4),
};

const beardFrames = {
  ...genFrames(Object.keys(BeardID).slice(0, 8), 19, 3, 8),
  ...genFrames(Object.keys(BeardID).slice(8, 16), 19, 7, 8),
  ...genFrames(Object.keys(BeardID).slice(16, 20), 19, 11, 4),
};

const helmFrames = genFrames(Object.keys(HelmID), 28, 0, 4);

const shieldFrames = {
  ...genFrames(Object.keys(ShieldID).slice(0, 16), 33, 0, 8),
  ...genFrames(Object.keys(ShieldID).slice(16, 18), 33, 2, 2),
  ...genFrames(Object.keys(ShieldID).slice(18, 20), 37, 2, 2),
  ...genFrames(Object.keys(ShieldID).slice(20, 36), 33, 3, 8),
  ...genFrames(Object.keys(ShieldID).slice(36, 38), 33, 5, 2),
  ...genFrames(Object.keys(ShieldID).slice(38, 40), 37, 5, 2),
  ...genFrames(Object.keys(ShieldID).slice(40, 56), 33, 6, 8),
  ...genFrames(Object.keys(ShieldID).slice(56, 58), 33, 8, 2),
  ...genFrames(Object.keys(ShieldID).slice(58, 60), 37, 8, 2),
};

const staffFrames = genFrames(Object.keys(StaffID), 42, 0, 5);

// -1h?
const maceFrames = {
  [MaceID.mace1]: genSingleFrame(47, 0),
  [MaceID.mace2]: genSingleFrame(47, 2),
  [MaceID.mace3]: genSingleFrame(47, 4),
  [MaceID.mace4]: genSingleFrame(42, 4),
  [MaceID.mace5]: genSingleFrame(47, 6),
  [MaceID.mace6]: genSingleFrame(47, 8),
};

const flailFrames = {
  [FlailID.flail1]: genSingleFrame(48, 0),
  [FlailID.flail2]: genSingleFrame(48, 2),
  [FlailID.flail3]: genSingleFrame(48, 4),
  [FlailID.flail4]: genSingleFrame(43, 4),
  [FlailID.flail5]: genSingleFrame(48, 6),
  [FlailID.flail6]: genSingleFrame(48, 8),
};
//

const spearFrames = {
  [SpearID.spear1]: genSingleFrame(49, 0),
  [SpearID.spear2]: genSingleFrame(49, 2),
  [SpearID.spear3]: genSingleFrame(49, 4),
  [SpearID.spear4]: genSingleFrame(44, 4),
  [SpearID.spear5]: genSingleFrame(49, 6),
  [SpearID.spear6]: genSingleFrame(49, 8),
};

const pikeFrames = {
  [PikeID.pike1]: genSingleFrame(50, 0),
  [PikeID.pike2]: genSingleFrame(50, 2),
  [PikeID.pike3]: genSingleFrame(50, 4),
  [PikeID.pike4]: genSingleFrame(45, 4),
  [PikeID.pike5]: genSingleFrame(50, 6),
  [PikeID.pike6]: genSingleFrame(50, 8),
};

const poleFrames = {
  ...genFrames(Object.keys(PoleID).slice(0, 6), 51, 0, 1),
  [PoleID.pole7]: genSingleFrame(46, 4),
  [PoleID.pole8]: genSingleFrame(46, 5),
  ...genFrames(Object.keys(PoleID).slice(8, 12), 51, 6, 1),
};

const axeFrames = {
  [AxeID.axe1]: genSingleFrame(47, 1),
  [AxeID.axe2]: genSingleFrame(47, 3),
  [AxeID.axe3]: genSingleFrame(47, 5),
  [AxeID.axe4]: genSingleFrame(42, 5),
  [AxeID.axe5]: genSingleFrame(47, 7),
  [AxeID.axe6]: genSingleFrame(47, 9),
};

const hammerFrames = {
  [HammerID.hammer1]: genSingleFrame(48, 1),
  [HammerID.hammer2]: genSingleFrame(48, 3),
  [HammerID.hammer3]: genSingleFrame(48, 5),
  [HammerID.hammer4]: genSingleFrame(43, 5),
  [HammerID.hammer5]: genSingleFrame(48, 7),
  [HammerID.hammer6]: genSingleFrame(48, 9),
};

const hatchetFrames = {
  [HatchetID.hatchet1]: genSingleFrame(49, 1),
  [HatchetID.hatchet2]: genSingleFrame(49, 3),
  [HatchetID.hatchet3]: genSingleFrame(49, 5),
  [HatchetID.hatchet4]: genSingleFrame(44, 5),
  [HatchetID.hatchet5]: genSingleFrame(49, 7),
  [HatchetID.hatchet6]: genSingleFrame(49, 9),
};

const scytheFrames = {
  [ScytheID.scythe1]: genSingleFrame(50, 1),
  [ScytheID.scythe2]: genSingleFrame(50, 3),
  [ScytheID.scythe3]: genSingleFrame(50, 5),
  [ScytheID.scythe4]: genSingleFrame(45, 5),
  [ScytheID.scythe5]: genSingleFrame(50, 7),
  [ScytheID.scythe6]: genSingleFrame(50, 9),
};

const bowFrames = genFrames(Object.keys(BowID), 52, 0, 2);
const bladeFrames = genFrames(Object.keys(BladeID), 42, 6, 5);

export const Atlas = {
  character: null,
};


export function load(cb) {
  const loader = new Loader()
    .add('character', '/img/roguelikeChar_transparent.png');

  loader.load((loader, assets) => {
    const sheet = new Spritesheet(assets['character'].texture, {
      meta: {
        scale: 1,
      },
      frames: {
        ...humanFrames,
        ...humanoidFrames,
        ...chestFrames,
        ...bottomFrames,
        ...shoeFrames,
        ...hairFrames,
        ...beardFrames,
        ...helmFrames,
        ...shieldFrames,
        ...staffFrames,
        ...maceFrames,
        ...flailFrames,
        ...spearFrames,
        ...pikeFrames,
        ...poleFrames,
        ...bowFrames,
        ...axeFrames,
        ...hammerFrames,
        ...hatchetFrames,
        ...scytheFrames,
        ...bladeFrames,
      },
    });

    sheet.parse(() => {
      Atlas.character = sheet.textures;

      cb();
    });
  });
}
