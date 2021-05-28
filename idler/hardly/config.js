export default {
    debug: true,
    systemLoad: [
        { name: 'Time', order: 1 },
        { name: 'Localization', order: 2 },
        { name: 'Event', order: 3 },

        { name: 'Biome', order: 50 },
        { name: 'Biz', order: 51 },
        { name: 'Generator', order: 51 },

        { name: 'BiomeUi', order: 70 },
        { name: 'BizUi', order: 70 },
        { name: 'GeneratorUi', order: 70 },

        { name: 'Save', order: 100 },
    ],
    protoLoad: ['locale/en', 'biomes/west_town'],
};
