const prototypes = {};

prototypes["biomes/west_town"] = {
    "name": "WestTown",
    "components": {
        "Biome": {
            "biomeTag": "west",
            "initialCapital": 10000,
            "baseBizCost": 9996,
            "exponent": 19,
            "bizList": ["biz/farm", "biz/barn"]
        },
        "BiomeDom": {
            "selector": ".container",
            "klass": "biome west"
        }
    }
};

prototypes["biz/barn"] = {
    "name": "Barn",
    "components": {
        "Biz": {
            "biomeTag": "west",
            "generators": [
                "generator/chicken",
                "generator/sheep",
                "generator/goat",
                "generator/cow",
                "generator/donkey",
                "generator/horse"
            ]
        },
        "BizDom": {
            "bizNameKey": "barn",
            "selector": ".container .biome.west .biz",
            "klass": "generators barn"
        }
    }
};

prototypes["biz/farm"] = {
    "name": "Farm",
    "components": {
        "Biz": {
            "biomeTag": "west",
            "generators": [
                "generator/carrots",
                "generator/beets",
                "generator/apples",
                "generator/pears",
                "generator/wheat",
                "generator/corn"
            ]
        },
        "BizDom": {
            "bizNameKey": "farm",
            "selector": ".container .biome.west .biz",
            "klass": "generators farm"
        }
    }
};

prototypes["generator/apples"] = {
    "name": "Apples",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 720,
            "exponent": 1.14,
            "baseRevenue": 540,
            "baseCycle": 6,
            "managerCost": 400000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "apples"
        }
    }
};

prototypes["generator/beets"] = {
    "name": "Beets",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 60,
            "exponent": 1.15,
            "baseRevenue": 60,
            "baseCycle": 3,
            "managerCost": 200000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "beets"
        }
    }
};

prototypes["generator/carrots"] = {
    "name": "Chicken",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 4,
            "exponent": 1.07,
            "baseRevenue": 1,
            "baseCycle": 0.6,
            "managerCost": 10000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "carrots"
        }
    }
};

prototypes["generator/chicken"] = {
    "name": "Chicken",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 4,
            "exponent": 1.07,
            "baseRevenue": 1,
            "baseCycle": 0.6,
            "managerCost": 10000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "chicken"
        }
    }
};

prototypes["generator/corn"] = {
    "name": "Corn",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 1244160,
            "exponent": 1.11,
            "baseRevenue": 622080,
            "baseCycle": 96,
            "managerCost": 5000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "corn"
        }
    }
};

prototypes["generator/cow"] = {
    "name": "Cow",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 8640,
            "exponent": 1.13,
            "baseRevenue": 4320,
            "baseCycle": 12,
            "managerCost": 1000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "cow"
        }
    }
};

prototypes["generator/donkey"] = {
    "name": "Donkey",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 103680,
            "exponent": 1.12,
            "baseRevenue": 51840,
            "baseCycle": 24,
            "managerCost": 2000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "donkey"
        }
    }
};

prototypes["generator/goat"] = {
    "name": "Goat",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 720,
            "exponent": 1.14,
            "baseRevenue": 540,
            "baseCycle": 6,
            "managerCost": 400000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "goat"
        }
    }
};

prototypes["generator/horse"] = {
    "name": "Horse",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 1244160,
            "exponent": 1.11,
            "baseRevenue": 622080,
            "baseCycle": 96,
            "managerCost": 5000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "horse"
        }
    }
};

prototypes["generator/pears"] = {
    "name": "Cow",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 8640,
            "exponent": 1.13,
            "baseRevenue": 4320,
            "baseCycle": 12,
            "managerCost": 1000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "pears"
        }
    }
};

prototypes["generator/sheep"] = {
    "name": "Sheep",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 60,
            "exponent": 1.15,
            "baseRevenue": 60,
            "baseCycle": 3,
            "managerCost": 200000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.barn",
            "klass": "generator",
            "nameKey": "sheep"
        }
    }
};

prototypes["generator/wheat"] = {
    "name": "Wheat",
    "components": {
        "Generator": {
            "biomeTag": "west",
            "baseCost": 103680,
            "exponent": 1.12,
            "baseRevenue": 51840,
            "baseCycle": 24,
            "managerCost": 2000000
        },
        "GeneratorDom": {
            "selector": ".container .biome.west .biz .generators.farm",
            "klass": "generator",
            "nameKey": "wheat"
        }
    }
};

prototypes["locale/en"] = {
    "name": "English",
    "components": {
        "TextSet": {
            "language": "en",
            "texts": {
                "na": "N/A",
                "barn": "The Barn",
                "farm": "The Farm",
                "buy": "Buy!",
                "managers_title": "Managers",
                "managers_desc": "Managers run your businesses for you while you enjoy the profits!",
                "switch": "Switch",
                "auto": "Auto",
                "million": "million",
                "billion": "billion",
                "trillion": "trillion",
                "quadrillion": "quadrillion",
                "passiveGainHTML": "Profits since your last visit:<br>",
                "carrots": "Carrots",
                "beets": "Beets",
                "corn": "Corn",
                "wheat": "Wheat",
                "apples": "Apples",
                "pears": "Pears",
                "chicken": "Chicken",
                "sheep": "Sheep",
                "goat": "Goat",
                "cow": "Cow",
                "donkey": "Donkey",
                "horse": "Horse"
            }
        }
    }
};

Object.freeze(prototypes);

export default prototypes;
