import {Meme} from "./meme";

export class MemeList {

    #list: Meme[] = [];

    addMeme(meme: Meme) {
        this.#list.push(meme);
    }

    get list() {
        return this.#list;
    }

    compareMemes(meme1: Meme, meme2: Meme) {
        if (meme1.price < meme2.price) return 1;
        if (meme1.price > meme2.price) return -1;
        return 0;
    }

    get mostExpensive() {
        this.#list.sort(this.compareMemes);
        return this.#list.slice(0, 3);
    }

    getMemeById(id: number) {
        for (const m of this.#list)
            if (m.id === id)
                return m;
    }
}