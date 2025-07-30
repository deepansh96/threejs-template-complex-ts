import * as THREE from 'three';
import EventEmitter from './Utils/EventEmitter';
import Loader from './Utils/Loader';

interface AssetGroup {
    name: string;
    data: any;
    items: AssetItem[];
    toLoad?: number;
    loaded?: number;
}

interface AssetItem {
    name: string;
    source: string;
    type: string;
}

interface ResourceGroups {
    assets: AssetGroup[];
    loaded: AssetGroup[];
    current: AssetGroup | null;
}

interface InstancedMeshGroup {
    name: string;
    regex: RegExp;
    meshesGroups: any[];
    instancedMeshes: any[];
}

export default class Resources extends EventEmitter {
    public items: { [key: string]: any };
    public loader: Loader;
    public groups: ResourceGroups;

    constructor(_assets: AssetGroup[]) {
        super();

        // Items (will contain every resources)
        this.items = {};

        // Loader
        this.loader = new Loader();

        this.groups = {
            assets: [..._assets],
            loaded: [],
            current: null
        };
        this.loadNextGroup();

        // Loader file end event
        this.loader.on('fileEnd', (_resource: AssetItem, _data: any) => {
            let data = _data;

            // Convert to texture
            if (_resource.type === 'texture') {
                if (!(data instanceof THREE.Texture)) {
                    data = new THREE.Texture(_data);
                }
                data.needsUpdate = true;
            }

            this.items[_resource.name] = data;

            // Progress and event
            if (this.groups.current) {
                this.groups.current.loaded!++;
                this.trigger('progress', [this.groups.current, _resource, data]);
            }
        });

        // Loader all end event
        this.loader.on('end', () => {
            if (this.groups.current) {
                this.groups.loaded.push(this.groups.current);

                // Trigger
                this.trigger('groupEnd', [this.groups.current]);
            }

            if (this.groups.assets.length > 0) {
                this.loadNextGroup();
            } else {
                this.trigger('end');
            }
        });
    }

    loadNextGroup(): void {
        this.groups.current = this.groups.assets.shift() || null;
        if (this.groups.current) {
            this.groups.current.toLoad = this.groups.current.items.length;
            this.groups.current.loaded = 0;

            this.loader.load(this.groups.current.items);
        }
    }

    createInstancedMeshes(_children: any[], _groups: { name: string; regex: RegExp }[]): { [key: string]: any[] } {
        // Groups
        const groups: InstancedMeshGroup[] = [];

        for (const _group of _groups) {
            groups.push({
                name: _group.name,
                regex: _group.regex,
                meshesGroups: [],
                instancedMeshes: []
            });
        }

        // Result
        const result: { [key: string]: any[] } = {};

        for (const _group of groups) {
            result[_group.name] = _group.instancedMeshes;
        }

        return result;
    }

    destroy(): void {
        for (const _itemKey in this.items) {
            const item = this.items[_itemKey];
            if (item instanceof THREE.Texture) {
                item.dispose();
            }
        }
    }
}