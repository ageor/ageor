(function(window, document) {
    function initHarmonic() {
        let solved = false;
        let scene, renderer, camera, group;
        let container = document.getElementById("harmonic_container");
        const geometryCount = 100;

        function initLights() {
            let spotLight = new THREE.SpotLight(0xffffff, 0.8, 30, 0.674);
            spotLight.position.set(5, 10, 5);
            spotLight.castShadow = true;
            scene.add(spotLight);

            let hemiLight = new THREE.HemisphereLight(0xbbffff, 0x080820, 0.65);
            scene.add(hemiLight);
        }

        function initScene() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(camConfig.FOV, camConfig.ASPECT, camConfig.NEAR, camConfig.FAR);
            camera.position.set(camConfig.POS.x, camConfig.POS.y, camConfig.POS.z);
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialiasing: true });
            renderer.setSize(window.innerWidth, sceneConfig.HEIGHT);
            renderer.setClearColor(0x000000, 1);

            initLights();

            container.appendChild(renderer.domElement);
        }

        function initGeometry() {
            let boxGeometry = new THREE.BoxGeometry(1, 1, 0.1);
            let material = new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.8,
                metalness: 0.4,
            });

            let box = new THREE.Mesh(boxGeometry, material);

            group = new THREE.Group();
            scene.add(group);

            for (let i = 0; i < geometryCount; i ++) {
                let j = (i / geometryCount) * Math.PI * 2;

                let clone = box.clone();
                clone.material = box.material.clone();
                clone.position.x = Math.cos(j) * 2;
                clone.position.y = Math.sin(j) * 2;
                clone.rotation.x = Math.PI / 2;
                clone.rotation.y = j;
                group.add(clone);
            }
        }

        function tick() {
            update(window.performance.now());

            renderer.render(scene, camera);

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);

        let harmonics = [false, false, false, false, false, false];

        function checkHarmonics() {
            return harmonics[0] && !harmonics[1] && harmonics[2] && !harmonics[3] && harmonics[4] && harmonics[5];
        }

        function update(currentTime) {
            let time = currentTime / 1000;

            for (let i = 0; i < geometryCount; i++) {
                let value = Math.sin(time * 0.567 + (i / 16.0)) +
                    Math.sin(time * 2.345 + (i / 8.0)) +
                    Math.sin(time * 1.456 + (i / 4.0));

                i % 8 == 0 && harmonics[1] && (value += Math.cos(time * 3.112 + (i / 2.0)));

                i % 3 == 0 && harmonics[3] && (value += Math.sin(time * 6.345 + (i / 8.0)));

                let r = 0;

                if (!harmonics[2]) {
                    r = Math.sin(time + (i / 16)) / 3;
                }

                if (i % 2 == 0) {
                    !harmonics[0] && (value *= Math.sin(time * 0.123));
                } else if (i % 3 == 0) {
                    !harmonics[2] && (value *= Math.sin(time * 0.123));
                }

                let object = group.children[i];
                if (harmonics[4] || i % 4) {
                    object.scale.x = value * 0.2 + 0.7;
                }

                object.scale.y = value * 0.2 + 0.7;
                
                if (harmonics[5] || i % 7 != 0) {
                    object.rotation.z = value;
                }

                let g = 0;
                harmonics[4] && (g = Math.pow(value, 4.0) * 0.024);
                object.material.emissive.g = g;

                let b = 0;
                harmonics[5] && (b = Math.pow(value, 6.0) * 0.0083);
                object.material.emissive.b = b;

                object.material.emissive.r = r;                
            }

            scene.rotation.x = time / 9.0;
            scene.rotation.y = time / 8.0;
        }

        function initButtons() {
            for (let i = 0; i < 6; i++) {
                document.getElementById("harmonic_" + (i + 1)).onclick = function() {
                    if (solved) return;

                    harmonics[i] = !harmonics[i];

                    if (harmonics[i]) {
                        document.getElementById("harmonic_" + (i + 1) + "_visual").classList.add("active");
                    } else {
                        document.getElementById("harmonic_" + (i + 1) + "_visual").classList.remove("active");
                    }

                    solved = checkHarmonics();
                    if (solved) solveRune("harmonic");
                }
            }
        }

        let sceneConfig = {
            HEIGHT: 500,
        };

        let camConfig = {
            FOV: 60,
            ASPECT: window.innerWidth / sceneConfig.HEIGHT,
            NEAR: 0.1,
            FAR: 20000,
            POS: {
                x: 0,
                y: 0,
                z: 6,
            },
        };

        initScene();
        initLights();
        initGeometry();
        initButtons();

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / sceneConfig.HEIGHT;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, sceneConfig.HEIGHT);
        }
    }

    window.addEventListener("load", function() {
        initHarmonic();
    });

})(window, document);