interface AssetItem {
    name: string;
    source: string;
    type: string;
}

interface Asset {
    name: string;
    data: any;
    items: AssetItem[];
}

const assets: Asset[] = [
    {
        name: 'base',
        data: {},
        items: [
            { name: 'lennaTexture', source: '/assets/lenna.png', type: 'texture' },
        ]
    }
];

export default assets;