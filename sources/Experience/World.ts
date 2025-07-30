import * as THREE from 'three';
import Experience from './Experience';

export default class World {
    public experience: Experience;
    public config: any;
    public scene: THREE.Scene;
    public resources: any;

    constructor(_options?: any) {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on('groupEnd', (_group: any) => {
            if (_group.name === 'base') {
                this.setDummy();
            }
        });
    }

    setDummy(): void {
        this.resources.items.lennaTexture.colorSpace = THREE.SRGBColorSpace;

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
        );
        this.scene.add(cube);
    }

    resize(): void {
        // Resize logic can be added here
    }

    update(): void {
        // Update logic can be added here
    }

    destroy(): void {
        // Destroy logic can be added here
    }
}