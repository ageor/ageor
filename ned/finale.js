(function(document, window) {
    function init() {
        let solved = false;
        let scene, renderer, camera;
        let container = document.getElementById("finale");

        let fruits = [];
        let groups = [];
        let leaves = [];

        let camConfig = {
            FOV: 60,
            ASPECT: window.innerWidth / window.innerHeight,
            NEAR: 0.1,
            FAR: 20000,
            POS: {
                x: 0,
                y: 0,
                z: 4.5,
            },
        };

        let rotStep = Math.PI / (6 / 2);

        function initScene() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(camConfig.FOV, camConfig.ASPECT, camConfig.NEAR, camConfig.FAR);
            camera.position.set(camConfig.POS.x, camConfig.POS.y, camConfig.POS.z);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialiasing: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 1);

            container.appendChild(renderer.domElement);

            groups.push(new THREE.Group());
            groups.push(new THREE.Group());
            groups.push(new THREE.Group());
            groups.push(new THREE.Group());

            for (let group of groups) {
                group.position.z = -2;
                scene.add(group);
            }
        }

        function checkSolution() {
            for (let group of groups) {
                if ((group.target + 0.002) % (Math.PI * 2) > 0.005) return false;
            }

            return true;
        }

        function initGeometry() {
            let material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 3,});
            let lg0 = new THREE.Geometry();
            let lg1 = new THREE.Geometry();
            let lg2 = new THREE.Geometry();
            let lg3 = new THREE.Geometry();

            const letter = {
                w: 0.6,
                h: 1,
                s: 0.12,
                l: 0.2,
            };

            let x = letter.w * 1.6;
            let y = 0;

            lg2.vertices.push(new THREE.Vector3(x, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.03, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.96, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h * 0.45, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.55, 0));

            x += letter.w + letter.s;
            lg0.vertices.push(new THREE.Vector3(x, y, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w * 0.56, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.56, y + letter.h, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.35, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.3, 0));

            x += letter.w + letter.s;
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.05, y, 0));
            lg2.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.7, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.45, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.7, 0));

            x += letter.w + letter.s;
            lg1.vertices.push(new THREE.Vector3(x, y, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.05, y + letter.h, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.95, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.65, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h * 0.4, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.65, 0));

            x += letter.w + letter.s;
            lg2.vertices.push(new THREE.Vector3(x, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h * 0.96, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w * 0.5, y + letter.h * 0.45, 0));

            x = 0;
            y -= letter.h + letter.l;

            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.05, y, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.65, 0));
            lg2.vertices.push(new THREE.Vector3(x, y + letter.h * 0.35, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.65, 0));
            lg0.vertices.push(new THREE.Vector3(x, y, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.35, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.55, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.35, 0));

            x += letter.w + letter.s;
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.5, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.5, y + letter.h, 0));

            x += letter.w + letter.s;
            lg3.vertices.push(new THREE.Vector3(x, y, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w * 0.03, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.6, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h * 0.4, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.6, 0));
            lg2.vertices.push(new THREE.Vector3(x, y + letter.h * 0.45, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w, y, 0));

            x += letter.w + letter.s;
            lg3.vertices.push(new THREE.Vector3(x + letter.w * 0.53, y, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w * 0.5, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h * 0.82, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.8, 0));

            x += letter.w + letter.s;
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.03, y, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w * 0.96, y, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h * 0.47, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.53, 0));

            x += letter.w + letter.s;
            lg2.vertices.push(new THREE.Vector3(x, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.06, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.44, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.44, 0));
            lg2.vertices.push(new THREE.Vector3(x, y, 0));

            x += letter.w + letter.s;
            lg0.vertices.push(new THREE.Vector3(x, y, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w * 0.43, y + letter.h, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.43, y + letter.h, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.35, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.37, 0));

            x += letter.w + letter.s;
            lg0.vertices.push(new THREE.Vector3(x + letter.w * 0.08, y, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.96, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.5, y + letter.h * 0.45, 0));

            x = letter.w * 2.9;
            y -= letter.h + letter.l;

            lg3.vertices.push(new THREE.Vector3(x, y, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w * 0.03, y + letter.h, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.96, y, 0));
            lg1.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h * 0.92, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.03, 0));

            x += letter.w + letter.s;
            lg1.vertices.push(new THREE.Vector3(x + letter.w * 0.02, y, 0));
            lg1.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.94, 0));
            lg2.vertices.push(new THREE.Vector3(x, y + letter.h * 0.5, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.8, y + letter.h * 0.5, 0));
            lg3.vertices.push(new THREE.Vector3(x, y + letter.h * 0.02, 0));
            lg3.vertices.push(new THREE.Vector3(x + letter.w * 0.9, y + letter.h * 0.03, 0));

            x += letter.w + letter.s;
            lg2.vertices.push(new THREE.Vector3(x, y, 0));
            lg2.vertices.push(new THREE.Vector3(x + letter.w * 0.03, y + letter.h, 0));
            lg0.vertices.push(new THREE.Vector3(x, y + letter.h * 0.96, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.48, 0));
            lg0.vertices.push(new THREE.Vector3(x + letter.w, y + letter.h * 0.52, 0));
            lg0.vertices.push(new THREE.Vector3(x, y, 0));

            let lines0 = new THREE.LineSegments(lg0, material);
            lines0.position.x = -3;
            lines0.position.y = 1;

            let lines1 = new THREE.LineSegments(lg1, material);
            lines1.position.x = -3;
            lines1.position.y = 1;

            let lines2 = new THREE.LineSegments(lg2, material);
            lines2.position.x = -3;
            lines2.position.y = 1;

            let lines3 = new THREE.LineSegments(lg3, material);
            lines3.position.x = -3;
            lines3.position.y = 1;

            groups[0].add(lines0);
            groups[1].add(lines1);
            groups[2].add(lines2);
            groups[3].add(lines3);
            groups[0].rotation.z = groups[0].target = rotStep;
            groups[1].rotation.z = groups[1].target = rotStep * 3;
            groups[2].rotation.z = groups[2].target = rotStep * 5;
            groups[3].rotation.z = groups[3].target = rotStep * 2;
        }

        function rotate(i) {
            groups[i].target += rotStep;
            console.log(checkSolution());
        }

        function initTrees() {
            let treeGroup = new THREE.Group();
            initTree(treeGroup);
            treeGroup.position.x = -5;
            treeGroup.position.y = -3;
            treeGroup.position.z = -2.4;
            scene.add(treeGroup);

            treeGroup = new THREE.Group();
            initTree(treeGroup);
            treeGroup.position.x = 4.4;
            treeGroup.position.y = -3;
            treeGroup.position.z = -2.4;
            scene.add(treeGroup);

            let ico = new THREE.IcosahedronGeometry(0.2, 1);

            let material = new THREE.MeshStandardMaterial({
                color: 0x4682B4,
                emissive: 0x4682B4,
                emissiveIntensity: 0.3,
                flatShading: true,
            });

            let fruit = new THREE.Mesh(ico, material);
            fruit.position.x = 3.6;
            fruit.position.z = -3.2;
            fruit.position.y = -3;
            scene.add(fruit);
            fruits.push(fruit);
            fruit.emissiveTarget = 0.3;

            fruit = new THREE.Mesh(ico, material);
            fruit.position.x = 3.8;
            fruit.position.z = -2.2;
            fruit.position.y = -3;
            scene.add(fruit);
            fruits.push(fruit);
            fruit.emissiveTarget = 0.3;

            fruit = new THREE.Mesh(ico, material);
            fruit.position.x = -4.3;
            fruit.position.z = -2.4;
            fruit.position.y = -3;
            scene.add(fruit);
            fruits.push(fruit);
            fruit.emissiveTarget = 0.3;

            fruit = new THREE.Mesh(ico, material);
            fruit.position.x = -2.8;
            fruit.position.z = -2.2;
            fruit.position.y = -3;
            scene.add(fruit);
            fruits.push(fruit);
            fruit.emissiveTarget = 0.3;
        }

        function initTree(scope) {
            const MAX_LIFE = 5;

            let geometry = new THREE.CubeGeometry();
            geometry.translate(0, 0.5, 0);
            let ico = new THREE.IcosahedronGeometry(0.8, 1);
            ico.translate(0, 0.5, 0);

            let material = new THREE.MeshStandardMaterial({ color: 0x444444, flatShading: true });
            let material2 = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });

            let tree = new THREE.Group();

            let root = new THREE.Mesh(geometry, material);
            root.castShadow = true;
            root.receiveShadow = true;

            let baseLeaf = new THREE.Mesh(ico, material2);

            function addBranch(child, life) {
                let progress = 1.05 - (life / MAX_LIFE);
                
                let scale = child.scale.y - Math.random() / 5;
                child.scale.set(progress / 10, scale, progress / 10);

                if (life > 0) {
                    child.translateY(scale);
                    child.rotation.x += Math.random() - 0.5;
                    child.rotation.y += Math.random() - 0.5;
                    child.rotation.z += Math.random() - 0.5;
                }

                child.updateMatrix();
                tree.add(child);

                if (life < Math.random() * MAX_LIFE) {
                    life = life + 1;
                    
                    for (let i = 0; i < 5; i++) {
                        if (Math.random() > 0.1) {
                            addBranch(child.clone(), life);
                        }
                    }
                } else {
                    if (Math.random() > 0.7) {
                        let leaf = baseLeaf.clone();
                        leaf.material = material2.clone();
                        leaf.applyMatrix(child.matrix);
                        leaf.translateY(leaf.scale.y);
                        leaf.scale.setScalar(0.1 + Math.random() * 0.1);
                        leaf.userData.life = life;
                        scope.add(leaf);
                        leaves.push(leaf);
                    }
                }
            }

            addBranch(root, 0);

            // Merge branches

            let branches = new THREE.Geometry();

            for (let i = 0; i < tree.children.length; i++) {
                let branch = tree.children[i];
                branches.merge(branch.geometry, branch.matrix);
            }

            let mesh = new THREE.Mesh(branches, material);
            scope.add(mesh);
        }

        function initLights() {
            let spotLight = new THREE.PointLight(0xffffff, 0.8, 30, 0.674);
            spotLight.position.set(2, 2, 3);
            spotLight.castShadow = true;
            scene.add(spotLight);

            let point = new THREE.PointLight(0xffffff, 0.6, 30, 0.674);
            point.position.set(-2, 1, -3);
            point.castShadow = true;
            scene.add(point);
        }

        function initRandom() {
            // change the behavior of the random function
            // var _seed = 45678951585492565678;
            var _seed = 136761585419565278;
            
            var _offset = _seed;
            Math.random = function(){

                var s = _seed;
                var square = s *s;

                var nseed = Math.floor( square / 1000 ) % 10000000000;

                if( nseed != _seed )
                    _seed = nseed;
                else
                    _seed = nseed + _offset;
                return ( _seed / 10000000000 );
            }
        }

        initScene();
        initGeometry();
        initRandom();
        initTrees();
        initLights();

        function update(time) {
            for (let group of groups) {
                group.rotation.z = THREE.Math.lerp(group.rotation.z, group.target, 0.2);
            }

            for (let i = 0; i < leaves.length; i++) {
                let leaf = leaves[i];
                let life = time / 1200;

                let sin = Math.sin(life + i / 16) * 0.25 + 0.25;

                leaf.material.emissive.setRGB(sin / 2, 0, 0.25);
            }

            for (let fruit of fruits) {
                fruit.material.emissiveIntensity = THREE.Math.lerp(fruit.material.emissiveIntensity, fruit.emissiveTarget, 0.1);
            }
        }

        function tick() {
            update(window.performance.now());

            renderer.render(scene, camera);

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);

        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.initFinale = function() {
            for (let i = 0; i < fruits.length; i++) {
                let fruit = fruits[i];
                fruit.callback = function() {
                    if (solved) return;
                    rotate(i);

                    solved = checkSolution();

                    if (solved) {
                        for (let fruit of fruits) {
                            fruit.emissiveTarget = 0;
                        }
                    }
                }
            }

            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            window.addEventListener('click', onDocumentMouseDown, false);
            function onDocumentMouseDown(event) {
                event.preventDefault();

                mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);

                let intersects = raycaster.intersectObjects(fruits); 

                if (intersects.length > 0) {
                    intersects[0].object.callback();
                }
            }
        }
    }

    window.addEventListener("load", function() {
        init();
    });
})(document, window);
