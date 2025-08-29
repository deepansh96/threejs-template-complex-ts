import * as THREE from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface CameraMode {
    instance: THREE.PerspectiveCamera;
    orbitControls?: OrbitControls;
    active?: boolean;
}

interface CameraModes {
    default: CameraMode;
    debug: CameraMode;
    [key: string]: CameraMode;
}

export default class Camera {
    public experience: Experience;
    public config: any;
    public debug: any;
    public time: any;
    public sizes: any;
    public targetElement: HTMLElement;
    public scene: THREE.Scene;
    public instance!: THREE.PerspectiveCamera;
    public mode: string;
    public modes!: CameraModes;

    constructor(_options?: any) {
        // Options
        this.experience = new Experience();
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.targetElement = this.experience.targetElement;
        this.scene = this.experience.scene;

        // Set up
        this.mode = 'debug'; // defaultCamera \ debugCamera

        this.setInstance();
        this.setModes();
    }

    setInstance(): void {
        // Set up
        this.instance = new THREE.PerspectiveCamera(25, this.config.width / this.config.height, 0.1, 150);
        this.instance.rotation.reorder('YXZ');

        this.scene.add(this.instance);
    }

    setModes(): void {
        this.modes = {} as CameraModes;

        // Default
        this.modes.default = {} as CameraMode;
        this.modes.default.instance = this.instance.clone();
        this.modes.default.instance.rotation.reorder('YXZ');

        // Debug
        this.modes.debug = {} as CameraMode;
        this.modes.debug.instance = this.instance.clone();
        this.modes.debug.instance.rotation.reorder('YXZ');
        this.modes.debug.instance.position.set(5, 5, 5);

        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement);
        this.modes.debug.orbitControls.enabled = this.modes.debug.active || true;
        this.modes.debug.orbitControls.screenSpacePanning = true;
        // this.modes.debug.orbitControls.enableKeys = false; // Property removed in newer versions
        this.modes.debug.orbitControls.zoomSpeed = 0.25;
        this.modes.debug.orbitControls.enableDamping = true;
        this.modes.debug.orbitControls.update();
    }

    resize(): void {
        this.instance.aspect = this.config.width / this.config.height;
        this.instance.updateProjectionMatrix();

        this.modes.default.instance.aspect = this.config.width / this.config.height;
        this.modes.default.instance.updateProjectionMatrix();

        this.modes.debug.instance.aspect = this.config.width / this.config.height;
        this.modes.debug.instance.updateProjectionMatrix();
    }

    update(): void {
        // Update debug orbit controls
        this.modes.debug.orbitControls?.update();

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position);
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
        this.instance.updateMatrixWorld(); // To be used in projection
    }

    destroy(): void {
        this.modes.debug.orbitControls?.dispose();
    }
}