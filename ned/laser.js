window.THREEx = window.THREEx || {}

THREEx.LaserBeam = function(color) {
    this.object = new THREE.Object3D();
    this.color = color;

    let canvas = generateLaserBodyCanvas();
    let texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    let material = new THREE.MeshBasicMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        color: color,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true,
        // depthTest: false,
    });

    let geometry = new THREE.PlaneGeometry(1, 0.1)
    let nPlanes = 4;

    for (let i = 0; i < nPlanes; i++) {
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 0.5;
        mesh.rotation.x = i / nPlanes * Math.PI;

        this.object.add(mesh);
    }

    return;
    
    function generateLaserBodyCanvas(){
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = 1;
        canvas.height = 64;

        let gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);      
        gradient.addColorStop(0.0, 'rgba(  0,  0,  0,0.1)');
        gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
        gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }
}

THREEx.LaserImpact = function(laserBeam, scene) {
    this.beam = laserBeam.object;
    let object = laserBeam.object

    let textureUrl = 'particle.jpg';
    let texture = new THREE.TextureLoader().load(textureUrl);
    let material = new THREE.SpriteMaterial({
        color: laserBeam.color,
        map: texture,
        blending: THREE.AdditiveBlending,
    });

    let sprite  = new THREE.Sprite(material);
    sprite.scale.x = 0.25;
    sprite.scale.y = 1;

    sprite.position.x = 0.99;
    object.add(sprite);

    // add a point light
    let light = new THREE.PointLight( 0x4444ff);
    light.intensity = 0.5;
    light.distance = 4;
    // light.position.x = -0.05;
    light.position.x = 0.99;
    this.light = light;
    object.add(light);

    // to exports last intersects
    let lastIntersects = [];

    let raycaster = new THREE.Raycaster();
    // TODO assume object.position are worldPosition. works IFF attached to scene
    raycaster.ray.origin.copy(object.position);

    this.update = function() {
        // get laserBeam matrixWorld
        object.updateMatrixWorld();
        let matrixWorld = object.matrixWorld.clone();
        // set the origin
        raycaster.ray.origin.setFromMatrixPosition(matrixWorld);
        // keep only the roation
        matrixWorld.setPosition(new THREE.Vector3(0, 0, 0)); 
        // set the direction
        raycaster.ray.direction.set(1, 0, 0)
            .applyMatrix4(matrixWorld)
            .normalize();

        let intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            let position = intersects[0].point;
            let distance = position.distanceTo(raycaster.ray.origin);
            object.scale.x = distance;
        } else {
            object.scale.x = 10;
        }

        lastIntersects = intersects;
    };
}
