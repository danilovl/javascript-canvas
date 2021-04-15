export default class Draw {
    constructor(isCanvas) {
        this.canvas = document.getElementById(isCanvas);
        this.rotateSun = 0;
        this.rotateMoon = 0;
        this.speedEarth = .02;
        this.speedMoon = .01;
        this.rotateSpeedSun = 300;
        this.rotateSpeedMoon = 700;

        this.renderer = null;
        this.camera = null;
        this.scene = null;
        this.sunLight = null;
        this.generalShadeLight = null;
        this.earthMesh = null;
        this.sunMesh = null;
        this.moonMesh = null;

        this.initWebGLRenderer()
        this.initPerspectiveCamera()
        this.initParameters()
        this.initEventListeners()
    }

    initWebGLRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(innerWidth, innerHeight);
    }

    initPerspectiveCamera() {
        this.camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 250);

        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
    }

    initParameters() {
        this.rotateSun = 0;
        this.rotateMoon = 0;

        this.sunLight = this.getSunLight();
        this.generalShadeLight = this.getGeneralShadeLight();
        this.earthMesh = this.getEarthMesh();
        this.sunMesh = this.getSunSphere();
        this.moonMesh = this.getMoonSphere();

        this.scene.add(this.sunLight);
        this.scene.add(this.generalShadeLight);
        this.scene.add(this.earthMesh);
        this.scene.add(this.sunMesh);
        this.scene.add(this.moonMesh);
    }

    initEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        this.initWebGLRenderer();
        this.initPerspectiveCamera();
        this.initParameters();
    }

    getSunLight() {
        let sunLight = new THREE.PointLight('#ffed7a', 1);
        sunLight.position.x = 450;
        sunLight.position.y = 0;
        sunLight.position.z = -450;

        return sunLight;
    }

    getGeneralShadeLight() {
        let generalShadeLight = new THREE.PointLight('#0000FF', .4);
        generalShadeLight.position.z = 400;

        return generalShadeLight;
    }

    getEarthMesh() {
        let earthMaterial = new THREE.MeshPhongMaterial();
        earthMaterial.map = THREE.ImageUtils.loadTexture('image/earth.jpg');

        let earthGeometry = new THREE.SphereGeometry(50, 32, 32);

        return new THREE.Mesh(earthGeometry, earthMaterial);
    }

    getSunSphere() {
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({color: '#f9d71c'});
        const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

        sunMesh.position.x = 250;
        sunMesh.position.y = 0;
        sunMesh.position.z = -350;

        return sunMesh;
    }

    getMoonSphere() {
        const moonMaterial = new THREE.MeshPhongMaterial();
        moonMaterial.map = THREE.ImageUtils.loadTexture('image/moon.jpg');

        const moonGeometry = new THREE.SphereGeometry(25, 32, 32);
        const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

        moonMesh.position.x = 150;
        moonMesh.position.y = 0;
        moonMesh.position.z = -150;

        return moonMesh;
    }

    rotateMesh(object, radians) {
        this.rotateMeshX(object, radians);
        this.rotateMeshY(object, radians);
        this.rotateMeshZ(object, radians);
    }

    rotateMeshX(object, radians) {
        let y = object.position.y;

        object.position.y = (y * Math.cos(radians)) + (object.position.z * Math.sin(radians) * -1.0);
        object.position.z = (y * Math.sin(radians)) + (object.position.z * Math.cos(radians));
    }

    rotateMeshY(object, radians) {
        let x = object.position.x;

        object.position.x = (x * Math.cos(radians)) + (object.position.z * Math.sin(radians) * -1.0);
        object.position.z = (x * Math.sin(radians)) + (object.position.z * Math.cos(radians));
    }

    rotateMeshZ(object, radians) {
        let x = object.position.x;

        object.position.x = (x * Math.cos(radians)) - (object.position.y * Math.sin(radians) * -1.0);
        object.position.y = (x * Math.sin(radians)) - (object.position.y * Math.cos(radians));
    }

    start() {
        window.requestAnimationFrame(this.start.bind(this));

        this.renderer.render(this.scene, this.camera);

        this.earthMesh.rotation.y += this.speedEarth;
        this.moonMesh.rotation.y += this.speedMoon;

        let rotateSun = Math.PI / this.rotateSpeedSun;
        let rotateMoon = Math.PI / this.rotateSpeedMoon;

        this.rotateMesh(this.sunLight, rotateSun);
        this.rotateMesh(this.sunMesh, rotateSun);
        this.rotateMesh(this.moonMesh, rotateMoon);
    }
}
