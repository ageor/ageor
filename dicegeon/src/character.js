import { Sprite, Container } from '/src/lib/pixi.min.js';
import * as Assets from '/src/assets.js';
import * as Utils from '/src/utils.js';

export function createCharacterAvatar() {
  let body = Sprite.from(Assets.Atlas.character[Assets.HumanID.human1]);
  let hair = Sprite.from(Assets.Atlas.character[Assets.HairID.hair1]);
  let beard = Sprite.from(Assets.Atlas.character[Assets.BeardID.beard1]);
  let helmet = Sprite.from(Assets.Atlas.character[Assets.HelmID.helm36]);;
  let armor = Sprite.from(Assets.Atlas.character[Assets.ChestID.top120]);;
  let pants = Sprite.from(Assets.Atlas.character[Assets.BottomID.bottom1]);;
  let shoes = Sprite.from(Assets.Atlas.character[Assets.ShoeID.shoes1]);;
  let mainHand = Sprite.from(Assets.Atlas.character[Assets.BladeID.blade4]);;
  let offHand = Sprite.from(Assets.Atlas.character[Assets.ShieldID.shield60]);;

  const root = new Container();
  root.addChild(body);
  root.addChild(pants);
  root.addChild(shoes);
  root.addChild(armor);
  root.addChild(hair);
  root.addChild(beard);
  root.addChild(helmet);
  root.addChild(offHand);
  root.addChild(mainHand);

  function equipMainHand(id) {
    mainHand.x = mainHand.y = 0;
    mainHand.scale.set(1);

    if (id in Assets.AxeID) {
      mainHand.x = 4;
      mainHand.y = 1;
      mainHand.scale.x = -1;
    }

    if (id in Assets.MaceID || id in Assets.BladeID) {
      mainHand.x = -1;
    }

    if (id in Assets.FlailID) {
      mainHand.x = -2;
    }

    if (id in Assets.BowID) {
      mainHand.y = 1;
      mainHand.x = 17;
      mainHand.scale.x = -1;
    }

    if (id in Assets.HatchetID) {
      mainHand.scale.x = -1;
      mainHand.y = 1;
      mainHand.x = 3;
    }

    if (id in Assets.HammerID) {
      mainHand.x = -1;
      mainHand.y = 1;
    }

    mainHand.texture = Assets.Atlas.character[id];
  }

  const character = {};

  Object.defineProperties(character, {
    root: {
      value: root,
    },
    pos: {
      value: root.position,
    },
    scale: {
      value: root.scale,
    },
    pivot: {
      value: root.pivot,
    },
    body: {
      set: (v) => body.texture = Assets.Atlas.character[v],
    },
    hair: {
      set: (v) => hair.texture = Assets.Atlas.character[v],
    },
    beard: {
      set: (v) => beard.texture = Assets.Atlas.character[v],
    },
    helmet: {
      set: (v) => helmet.texture = Assets.Atlas.character[v],
    },
    armor: {
      set: (v) => armor.texture = Assets.Atlas.character[v],
    },
    pants: {
      set: (v) => pants.texture = Assets.Atlas.character[v],
    },
    shoes: {
      set: (v) => shoes.texture = Assets.Atlas.character[v],
    },
    // Need to make the adjustments here
    offHand: {
      set: (v) => offHand.texture = Assets.Atlas.character[v],
    },
    mainHand: {
      set: equipMainHand,
    },
  });

  return character;
}

export function randomiseAvatar(avatar) {
  const humanoids = [...Object.values(Assets.HumanID), ...Object.values(Assets.HumanoidID)];

  avatar.body = Utils.randomFromArray(humanoids);
  avatar.helmet = Utils.randomFromArray(Object.values(Assets.HelmID));
  avatar.offHand = Utils.randomFromArray(Object.values(Assets.ShieldID));
  avatar.armor = Utils.randomFromArray(Object.values(Assets.ChestID));
  avatar.pants = Utils.randomFromArray(Object.values(Assets.BottomID));
  avatar.shoes = Utils.randomFromArray(Object.values(Assets.ShoeID));

  // need to be in pairs somehow
  avatar.hair = Utils.randomFromArray(Object.values(Assets.HairID));
  avatar.beard = Utils.randomFromArray(Object.values(Assets.BeardID));

  const meleeWeapons = [
    ...Object.values(Assets.BladeID),
    ...Object.values(Assets.AxeID),
    ...Object.values(Assets.HatchetID),
    ...Object.values(Assets.FlailID),
    ...Object.values(Assets.SpearID),
    ...Object.values(Assets.PoleID),
    ...Object.values(Assets.ScytheID),
  ];

  avatar.mainHand = Utils.randomFromArray(meleeWeapons);
}
