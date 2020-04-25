# Idler Game

The idler game is a game you don't need to play actively. The basic loop is spending capital on generators that generate capital for even more generators. The trick is that generator cost scales exponentially, while the profit scales linearly, which results in an infinite loop of buying and generating. A key feature to all idle games is the ability to progress without being in the game. Upon returning, you receive all the income you would have, had you not left at all. Buying generator automation is usually present in such games.

# Resources
* [The Math of Idle Games](https://gameanalytics.com/blog/idle-game-mathematics.html) - a brilliant article from Anthony Pecorella on the math that used in this implementation.
* [AdVenture Capitalist Wiki](https://adventure-capitalist.fandom.com/wiki/AdVenture_Capitalist_Wiki) - a great source with math and balancing.

# Implementation

This specific spin on the idler game genre has multiple "businesses" that each have to be bought separately and each have generators that can be bought afterwards. The focus is a simplistic and easy to use UI. Progress is stored using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) so the game can be played without having to rely on a server for it to be accessible. The downside of this is that progress can't be transferred between devices.

The source uses modern JavaScript that makes use of [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [classes](https://developer.mozilla.org/bg/docs/Web/JavaScript/Reference/Classes) among others.

The UI utilizes the very powerful and mature HTML+CSS combination. The reason for this choice is the author's familiarity with the technology. This does make implementing eye-candy features complex as it is siply not designed for common game features like particles. Future iteration might replace the rendering with a dedicated renderer like [PixiJS](https://github.com/pixijs/pixi.js) as the Hardly engine is designed to allow quick iteration and replacing modules with ease.

The game uses a minimalistic engine/framework codenamed Hardly. The goal of the engine is to allow full development freedom, while handling commonly implemented features like object caching to avoid GC spikes. The focus of this project is not the engine, but the game itself and the challenge was to make an [MVP](https://en.wikipedia.org/wiki/Minimum_viable_product) within two to three days. Like the UI, the engine is chosen, because of the author's familiarity with it as it is the same author.

All of the code relevant to the game can be found in `index.html`, `main.js`, `hardly/components` and `hardly/systems`. `hardly/prototypes` contains the prototypes from which entities are created. The UI styling is in `style.css`.

# Engine
The engine implements a simple [ECS](https://en.wikipedia.org/wiki/Entity_component_system) architecture inspired by the [Fungi engine by SketchPunk](https://github.com/sketchpunk/Fungi).
* Components - mainly data holders. Properties are defined within them and the do the occasional transfiormation of the data they hold. (e.g. `0.1` to `10%`)
* Entities - containers of components. They are used by the engine to deliver to systems what they need to function. Can be used to store utility data.
* Systems - feature implementors. Systems hold the logic for everything. The operate on entities and their components. Systems can request entities with a given set of components and they will receive those entities to work with. They have four hooks: `init`, `added`, `removed`, `update`.

An example of a system:

```javascript
// Data only visible to the system can go here
const _somePrivateData = {
    greeting: "Hello, World!"
};

class Example {
    // Define which components an entity must have in order to be passed to the system
    static entityQuery = ["ComponentA", "ComponentB"];

    // The constructor is optional and allows systems to store state in the engine
    constructor(engine) {
        engine.state = _somePrivateData;
    }
    
    // The init is the de facto constructor within the engine
    // It should only be called once after the after all the systems are added to the engine 
    init() {
        console.log(_somePrivateData.greeting);
    }
    
    // Called when an entity is created in the engine
    added(entity) {
        // These will both be true
        console.log("A:", !!entity.ComponentA);
        console.log("B:", !!entity.ComponentB);
        
        // This may be true if the component also has a ComponentC
        console.log("C:", !!entity.ComponentC);
    }
    
    // Called when an entity is destroyed
    // All the same rules apply as in the added hook
    // After this point the entity will be invalid references should not be used
    removed(entity) {}
    
    // Called by the engine and can be used in the update loop of games
    // Entities that match the query can be accessed with this.entities
    update() {
        for (let e of this.entities) {
            if (e.AomponentA) console.log("Amazing!");
        }
    }
}
```

The engine wraps the ECS in a much easier to use `Hardly` class. Instances of this class allow adding systems, initializing and updating them and handles asset loading for you. Since this is not the focus of this project more explanation will have to wait.


An example initializer:

```javascript
// Import the Hardly class
import Hardly from "./hardly/hardly.js";

function init() {
    const hardly = new Hardly();

    // If you want you can make it globally visible in the web console.
    window.Debug = hardly;

    // Asynchronously import all code and download all assets.
    await hardly.init();

    // Add some systems with priorities
    // The lower the priority, the earlier the init and update of the system will be called
    // Systems with equal priorities execute in the order they are added
    hardly.addSystem("Example0", 2);
    hardly.addSystem("Example1", 1); // init before Example0
    hardly.addSystem("Example2", 1); // init before Example0, but after Example1
    
    // Calls init on all systems
    hardly.initSystems();

    // Load some prototypes (simple json objects describing entities and their components)
    hardly.load("locale/en");
    hardly.load("biomes/west_town");

    // A simple update loop
    function update() {
        hardly.update();
        
        requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
}
```

# Feature Plans

Adding the ability for users to transfer their save games between devices. This can be achieved with a dedicated server or possibly a login with Google or Facebook or any other platform that allows storage.

Visual polish. Due to time restrictions few images are used with differing styles and very little time was spent on the visual quality of the game. The priority was to get it functional. A dedicated renderer can be added easily and various eye-candy can be added.

Sound is always delayed to the end and often cut for MVP.

General refactoring. The UI took a hit to code quality in order for the core code not to. It can and should be better.

The save systems is quite basic. Validation, versioning and obviosly could storage can be implemented.

More features. The code supports multiple "biomes" with separate businesses, generators and currencies. More businesses can be added within minutes, excluding the time to work out the balancing and asset eneration.

"Prestiege" - The ability to reset your progress for a permanent boost to profits is a core mechanic to idle games.

Events - it is possible to add time limited events even in an offline game. A way to do it is to check the day of the week or month or any other easily attainable number for time and have a special "biome" during that time. This gives players a reason to keep playing past buying everything available in the base game. Rewards could be cosmetics or boots, but they should be rare and hard to mass.

Localization - localization is implemented and functional, but only english is implemented. More languages can't hurt.

Settings - With more languages and audio a settings menu will allow users to tweak volume and change locales.

Rested rewards - upon returning to the game users can be awarded bonues for the time they've been away. This is usually where ads are implemented and gives incentives to players to take a break and avoid burnout.

Better desktop version - the game is primarily aimed at mobile, but works perfectly fine on desktops. However the UI is clearly designed for touchscreens and does not utilize a full keyboard and mouse.

Device support - while everything should work, proper testing should be done for various devices and fixes should be implemented to support them properly.

Tutorial - the game is simple and has few buttons that users may be able to figure out by themselves, but a dedicated tutorial is always welcome.

# Quick Guide

At the top is your current capital. You will initially be prompted to purchase a business. There are two businesses to choose from, that are identical aside from the visuals.

After purchasing a business, you can buy the various generators multiple times. Clicking on the icon of the generator will begin generation and after a short while you will receive the profits.

At the bottom of the screen there are three buttons. The leftmost button opens the manager screen where you can purchase managers to automatically run your generators.

The middle button will switch between the different businesses, curently "The Barn" and "The Farm".

The rightmost button will start all idle generators in the selected business.
