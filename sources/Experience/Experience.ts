import * as THREE from 'three';
import GUI from 'lil-gui';

import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import Stats from './Utils/Stats';

import Resources from './Resources';
import Renderer from './Renderer';
import Camera from './Camera';
import World from './World';

import assets from './assets';

interface ExperienceConfig {
    debug: boolean;
    pixelRatio: number;
    width: number;
    height: number;
}

interface ExperienceOptions {
    targetElement?: HTMLElement;
}

export default class Experience {
    static instance: Experience;

    public targetElement!: HTMLElement;
    public config!: ExperienceConfig;
    public debug?: GUI;
    public stats?: Stats;
    public time!: Time;
    public sizes!: Sizes;
    public scene!: THREE.Scene;
    public camera!: Camera;
    public renderer!: Renderer;
    public resources!: Resources;
    public world!: World;
    public rendererInstance?: THREE.WebGLRenderer;

    constructor(_options: ExperienceOptions = {}) {
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;

        // Options
        this.targetElement = _options.targetElement!;

        if (!this.targetElement) {
            console.warn('Missing \'targetElement\' property');
            return;
        }

        this.time = new Time();
        this.sizes = new Sizes();
        this.setConfig();
        this.setDebug();
        this.setStats();
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setResources();
        this.setWorld();

        this.sizes.on('resize', () => {
            this.resize();
        });

        this.update();
    }

    setConfig(): void {
        this.config = {} as ExperienceConfig;

        // Debug
        this.config.debug = window.location.hash === '#debug';

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect();
        this.config.width = boundings.width;
        this.config.height = boundings.height || window.innerHeight;
    }

    setDebug(): void {
        if (this.config.debug) {
            this.debug = new GUI();
        }
    }

    setStats(): void {
        if (this.config.debug) {
            this.stats = new Stats(true);
        }
    }

    setScene(): void {
        this.scene = new THREE.Scene();
    }

    setCamera(): void {
        this.camera = new Camera();
    }

    setRenderer(): void {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance });

        this.targetElement.appendChild(this.renderer.instance.domElement);
    }

    setResources(): void {
        this.resources = new Resources(assets);
    }

    setWorld(): void {
        this.world = new World();
    }

    update(): void {
        if (this.stats)
            this.stats.update();

        this.camera.update();

        if (this.world)
            this.world.update();

        if (this.renderer)
            this.renderer.update();

        window.requestAnimationFrame(() => {
            this.update();
        });
    }

    resize(): void {
        // Config
        const boundings = this.targetElement.getBoundingClientRect();
        this.config.width = boundings.width;
        this.config.height = boundings.height;

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

        if (this.camera)
            this.camera.resize();

        if (this.renderer)
            this.renderer.resize();

        if (this.world)
            this.world.resize();
    }

    destroy(): void {
        // Implementation can be added here
    }
}