import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
    public start: number;
    public current: number;
    public elapsed: number;
    public delta: number;
    public playing: boolean;
    private ticker?: number;

    /**
     * Constructor
     */
    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
        this.playing = true;

        this.tick = this.tick.bind(this);
        this.tick();
    }

    play(): void {
        this.playing = true;
    }

    pause(): void {
        this.playing = false;
    }

    /**
     * Tick
     */
    tick(): void {
        this.ticker = window.requestAnimationFrame(this.tick);

        const current = Date.now();

        this.delta = current - this.current;
        this.elapsed += this.playing ? this.delta : 0;
        this.current = current;

        if (this.delta > 60) {
            this.delta = 60;
        }

        if (this.playing) {
            this.trigger('tick');
        }
    }

    /**
     * Stop
     */
    stop(): void {
        if (this.ticker) {
            window.cancelAnimationFrame(this.ticker);
        }
    }
}