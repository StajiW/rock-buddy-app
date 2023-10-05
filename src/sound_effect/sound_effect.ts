export default class SoundEffect {
    sounds: HTMLAudioElement[] = [];
    lastMisses?: number;
    enabled: boolean = false;

    constructor() {
        this.enable()
    }

    async enable() {
        const path = await window.api.getSrcDir();
        const sounds = [];

        for (let i = 0; i < 6; i++) {
            sounds.push(new Audio(path + `/sound_effect/miss${i + 1}.mp3`));
        }

        this.sounds = sounds;

        // Make sure it doesn't play straight after disabling and enabling
        this.lastMisses = undefined;
        this.enabled = true;
    }

    disable() {
        for (let sound of this.sounds) {
            sound.remove();
        }

        this.enabled = false;
    }

    update(misses: number | undefined) {
        if (!this.enabled) return;
        if (misses === undefined) return;

        if (this.lastMisses !== undefined) {
            if (misses > this.lastMisses) this.playSound()
        }

        this.lastMisses = misses
    }

    playSound() {
        if (this.sounds.length === 0) return;

        this.sounds[Math.floor(Math.random() * this.sounds.length)].play().catch(err => console.log(err))
    }
}