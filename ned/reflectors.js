(function(window, document) {
    function initReflectors() {
        let solved = false;
        let scene, renderer, camera, colliders, controls;
        let container = document.getElementById("reflector_container");
        let lasers = [];
        let reflectors = [];
        let laserTargetIndex = 0;

        window.reflectorControls = function(enabled) {
            controls.enabled = enabled;
        }

        const laserTargets = [
            [
                { up: Math.PI * 0.4, back: Math.PI * 0.1, },
                { up: -Math.PI * 0.8, back: Math.PI * 0.45, },
                { up: -Math.PI * 0.12, back: Math.PI * 0.68, },
                { up: Math.PI * 0.9, back: Math.PI * 0.7, },
            ],
            [
                { up: Math.PI * 0.33, back: Math.PI * 0.2, },
                { up: -Math.PI * 0.66, back: Math.PI * 0.4, },
                { up: -Math.PI * 0.33, back: Math.PI * 0.6, },
                { up: Math.PI * 0.99, back: Math.PI * 0.8, },
            ],
            [
                { up: Math.PI * 0.1, back: Math.PI * 0.4, },
                { up: -Math.PI * 0.73, back: Math.PI * 0.63, },
                { up: -Math.PI * 0.33, back: -Math.PI * 0.4, },
                { up: Math.PI * 0.99, back: Math.PI * 0.8, },
            ],
        ];

        let rotations = [];

        function bakeRotations() {
            let testObject = new THREE.Object3D();
            for (let targetSet of laserTargets) {
                let rot = [];
                
                for (let target of targetSet) {
                    testObject.rotation.set(0, 0, 0);
                    testObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), target.up);
                    testObject.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI * 0.5);
                    testObject.rotateOnAxis(new THREE.Vector3(0, 0, -1), target.back);

                    let tation = new THREE.Vector3(testObject.rotation.x, testObject.rotation.y, testObject.rotation.z);
                    tation.x < 0 && (tation.x += Math.PI * 2);
                    tation.y < 0 && (tation.y += Math.PI * 2);
                    tation.z < 0 && (tation.z += Math.PI * 2);
                    rot.push(tation);
                }

                rotations.push(rot);
            }
        }

        bakeRotations();

        function initLights() {
            let spotLight = new THREE.SpotLight(0xffffff, 0.6, 30, 0.674);
            spotLight.position.set(5, 10, 5);
            spotLight.castShadow = true;
            scene.add(spotLight);

            spotLight = new THREE.SpotLight(0xffffff, 0.4, 30, 0.674);
            spotLight.position.set(-5, -10, 5);
            spotLight.castShadow = true;
            scene.add(spotLight);

            let hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.1);
            scene.add(hemiLight);
        }

        function initLasers() {
            let laserBeam = new THREEx.LaserBeam(0xffcc99);
            scene.add(laserBeam.object);
            let laserTarget = rotations[laserTargetIndex][0];
            laserBeam.object.rotation.set(laserTarget.x, laserTarget.y, laserTarget.z);
            let laserImpact = new THREEx.LaserImpact(laserBeam, colliders);
            lasers.push(laserImpact);
            laserImpact.beam.target = laserBeam.object.rotation.clone();

            laserBeam = new THREEx.LaserBeam(0xff99ff);
            scene.add(laserBeam.object);
            laserTarget = rotations[laserTargetIndex][1];
            laserBeam.object.rotation.set(laserTarget.x, laserTarget.y, laserTarget.z);
            laserImpact = new THREEx.LaserImpact(laserBeam, colliders);
            lasers.push(laserImpact);
            laserImpact.beam.target = laserBeam.object.rotation.clone();

            laserBeam = new THREEx.LaserBeam(0x99ffcc);
            scene.add(laserBeam.object);
            laserTarget = rotations[laserTargetIndex][2];
            laserBeam.object.rotation.set(laserTarget.x, laserTarget.y, laserTarget.z);
            laserImpact = new THREEx.LaserImpact(laserBeam, colliders);
            lasers.push(laserImpact);
            laserImpact.beam.target = laserBeam.object.rotation.clone();

            laserBeam = new THREEx.LaserBeam(0x66aacc);
            scene.add(laserBeam.object);
            laserTarget = rotations[laserTargetIndex][3];
            laserBeam.object.rotation.set(laserTarget.x, laserTarget.y, laserTarget.z);
            laserImpact = new THREEx.LaserImpact(laserBeam, colliders);
            lasers.push(laserImpact);
            laserImpact.beam.target = laserBeam.object.rotation.clone();
        }

        function initScene() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(camConfig.FOV, camConfig.ASPECT, camConfig.NEAR, camConfig.FAR);
            camera.position.set(camConfig.POS.x, camConfig.POS.y, camConfig.POS.z);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialiasing: true });
            renderer.setSize(window.innerWidth, sceneConfig.HEIGHT);
            renderer.setClearColor(0x000000, 1);

            controls = new THREE.OrbitControls(camera);
            controls.enableDamping = true;
            controls.enableZoom = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.2;
            controls.maxPolarAngle = Math.PI * 0.6;
            controls.minPolarAngle = Math.PI * 0.4;

            container.appendChild(renderer.domElement);
        }

        function initGeometry() {
            colliders = new THREE.Group();
            scene.add(colliders);

            function initCore() {
                let material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.7,
                    metalness: 0.6,
                    flatShading: true,
                });

                let ico = new THREE.IcosahedronGeometry(0.4, 2);
                let icoMesh = new THREE.Mesh(ico, material);

                scene.add(icoMesh);
            }

            function initShell() {
                let material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 0.8,
                    metalness: 0.2,
                    flatShading: true,
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                    depthTest: false,
                });

                let ico = new THREE.IcosahedronGeometry(2.6, 2);
                let icoMesh = new THREE.Mesh(ico, material);

                colliders.add(icoMesh);
            }

            function initReflector(color) {
                let material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.7,
                    metalness: 0.6,
                    flatShading: true,
                });

                let ico = new THREE.IcosahedronGeometry(0.2, 1);
                let icoMesh = new THREE.Mesh(ico, material);

                colliders.add(icoMesh);

                return icoMesh;
            }

            initCore();
            initShell();

            let position = new THREE.Vector3(0, 2, 0);
            position.applyAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI * 0.2);
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 0.33);
            let a = initReflector(0xffcc99);
            a.position.add(position);
            a.target = position.clone();
            reflectors.push(a);

            position = new THREE.Vector3(0, 2, 0);
            position.applyAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI * 0.4);
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.33);
            let b = initReflector(0xff99ff);
            b.position.add(position);
            b.target = position.clone();
            reflectors.push(b);

            position = new THREE.Vector3(0, 2, 0);
            position.applyAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI * 0.6);
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI * 0.66);
            let c = initReflector(0x99ffcc);
            c.position.add(position);
            c.target = position.clone();
            reflectors.push(c);

            position = new THREE.Vector3(0, 2, 0);
            position.applyAxisAngle(new THREE.Vector3(0, 0, -1), Math.PI * 0.8);
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.99);
            let d = initReflector(0x66aacc);
            d.position.add(position);
            d.target = position.clone();
            reflectors.push(d);
        }

        function tick() {
            update(window.performance.now());

            controls.update();

            renderer.render(scene, camera);

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);

        function update(currentTime) {
            let time = currentTime / 1000;

            for (let laser of lasers) {
                let rot = laser.beam.rotation.toVector3();
                laser.beam.rotation.setFromVector3(rot.lerp(laser.beam.target, 0.2));
                laser.update();
            }

            for (let reflector of reflectors) {
                reflector.position.lerp(reflector.target, 0.2);
            }
        }

        function checkSolution() {
            let l = laserTargetIndex == 1;
            let a = ((reflectors[0].target.x * 1000) | 0) == 577 && ((reflectors[0].target.z * 1000) | 0) == -1024;
            let b = ((reflectors[1].target.x * 1000) | 0) == -968 && ((reflectors[1].target.z * 1000) | 0) == 1637;
            let c = ((reflectors[2].target.x * 1000) | 0) == 985 && ((reflectors[2].target.z * 1000) | 0) == 1626;
            let d = ((reflectors[3].target.x * 1000) | 0) == -1174 && ((reflectors[3].target.z * 1000) | 0) == -36;
            
            return l && a && b && c && d;
        }

        function initButtons() {
            for (let i = 0; i < 4; i++) {
                document.getElementById("sphere_" + (i + 1)).onclick = function() {
                    if (solved) return;

                    reflectors[i].target.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3);

                    solved = checkSolution();

                    if (solved) solveRune("reflection");
                }
            }

            document.getElementById("lasers").onclick = function() {
                if (solved) return;

                laserTargetIndex = (laserTargetIndex + 1) % laserTargets.length;

                for (let i = 0; i < lasers.length; i++) {
                    let beam = lasers[i].beam;
                    let laserTarget = rotations[laserTargetIndex][i];
                    beam.target.set(laserTarget.x, laserTarget.y, laserTarget.z);
                }

                solved = checkSolution();

                if (solved) solveRune("reflection");
            }
        }

        let sceneConfig = {
            HEIGHT: 500,
        };

        let camConfig = {
            FOV: 90,
            ASPECT: window.innerWidth / sceneConfig.HEIGHT,
            NEAR: 0.1,
            FAR: 20000,
            POS: {
                x: 0,
                y: 0,
                z: 4.5,
            },
        };

        initScene();
        initLights();
        initGeometry();
        initLasers();
        initButtons();

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / sceneConfig.HEIGHT;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, sceneConfig.HEIGHT);
        }
    }

    window.addEventListener("load", function() {
        initReflectors();
    });
})(window, document);
