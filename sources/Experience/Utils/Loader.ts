import EventEmitter from './EventEmitter';
import Experience from '../Experience';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from 'three';

interface Resource {
    name: string;
    source: string;
}

interface LoaderItem {
    extensions: string[];
    action: (resource: Resource) => void;
}

export default class Resources extends EventEmitter {
    public experience: Experience;
    public renderer: THREE.WebGLRenderer;
    public loaders!: LoaderItem[];
    public toLoad: number;
    public loaded: number;
    public items: { [key: string]: any };

    /**
     * Constructor
     */
    constructor() {
        super();

        this.experience = new Experience();
        this.renderer = this.experience.renderer.instance;

        this.setLoaders();

        this.toLoad = 0;
        this.loaded = 0;
        this.items = {};
    }

    /**
     * Set loaders
     */
    setLoaders(): void {
        this.loaders = [];

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource: Resource) => {
                const image = new Image();

                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image);
                });

                image.src = _resource.source;
            }
        });

        // Draco
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource: Resource) => {
                dracoLoader.load(_resource.source, (_data: THREE.BufferGeometry) => {
                    this.fileLoadEnd(_resource, _data);
                    // DRACOLoader.releaseDecoderModule(); // Method may not exist in newer versions
                });
            }
        });

        // GLTF
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource: Resource) => {
                gltfLoader.load(_resource.source, (_data: any) => {
                    this.fileLoadEnd(_resource, _data);
                });
            }
        });

        // FBX
        const fbxLoader = new FBXLoader();

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource: Resource) => {
                fbxLoader.load(_resource.source, (_data: THREE.Group) => {
                    this.fileLoadEnd(_resource, _data);
                });
            }
        });

        // RGBE | HDR
        const rgbeLoader = new RGBELoader();

        this.loaders.push({
            extensions: ['hdr'],
            action: (_resource: Resource) => {
                rgbeLoader.load(_resource.source, (_data: THREE.DataTexture) => {
                    this.fileLoadEnd(_resource, _data);
                });
            }
        });
    }

    /**
     * Load
     */
    load(_resources: Resource[] = []): void {
        for (const _resource of _resources) {
            this.toLoad++;
            const extensionMatch = _resource.source.match(/\.([a-z]+)$/);

            if (extensionMatch && typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1];
                const loader = this.loaders.find((_loader) => 
                    _loader.extensions.find((_extension) => _extension === extension)
                );

                if (loader) {
                    loader.action(_resource);
                } else {
                    console.warn(`Cannot found loader for ${_resource.source}`);
                }
            } else {
                console.warn(`Cannot found extension of ${_resource.source}`);
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource: Resource, _data: any): void {
        this.loaded++;
        this.items[_resource.name] = _data;

        this.trigger('fileEnd', [_resource, _data]);

        if (this.loaded === this.toLoad) {
            this.trigger('end');
        }
    }
}