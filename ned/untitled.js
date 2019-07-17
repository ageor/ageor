(function(document, window) {
    window.addEventListener("load", function() {
        document.getElementById("spinner").style.opacity = 0;
        document.getElementById("message").style.opacity = 1;
        document.getElementById("begin_quest").onclick = function() {            
            let welcome = document.getElementById("welcome");
            welcome.style.opacity = 0;

            setTimeout(function() {
                welcome.remove();
            }, 300);
        };

        initRunes();
    });

    let runes = {
        "riddle": false,
        "torch": false,
        "maze": false,
        "math": false,
        "harmonic": false,
        "reflection": false,
    };

    let solved = false;

    function hidePuzzles() {
        document.getElementById("riddle").classList.remove("open");
        document.getElementById("torch").classList.remove("open");
        document.getElementById("maze").classList.remove("open");
        document.getElementById("math").classList.remove("open");
        document.getElementById("harmonic").classList.remove("open");
        document.getElementById("reflection").classList.remove("open");

        document.getElementById("gate").classList.add("completed");
    }

    function hideGate() {
        document.getElementById("gate").classList.remove("active");
    }

    function showFinale() {
        document.getElementById("finale").classList.add("active");
        initFinale();
    }

    window.solveRune = function(name) {
        document.getElementById(name + "_rune").classList.add("solved")
        runes[name] = true;

        solved = true;
        for (let val of Object.values(runes)) {
            solved = solved && val;
        }

        if (solved) {
            setTimeout(hidePuzzles, 1000);
            setTimeout(hideGate, 4000);
            setTimeout(showFinale, 4000);
        }
    }

    function initRunes() {
        function click() {
            if (solved) return;

            let rune = this.dataset.rune;
            document.querySelector(".open").classList.remove("open");
            document.getElementById(rune).classList.add("open");

            reflectorControls(rune == "reflection");
        }

        reflectorControls(false);

        document.getElementById("riddle_rune").onclick = click;
        document.getElementById("torch_rune").onclick = click;
        document.getElementById("maze_rune").onclick = click;
        document.getElementById("math_rune").onclick = click;
        document.getElementById("harmonic_rune").onclick = click;
        document.getElementById("reflection_rune").onclick = click;
    }
})(document, window);
