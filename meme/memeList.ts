import {Meme} from "./meme";

export class MemeList {

    #list: Meme[] = [];

    constructor() {
        console.log("Creating memeList...");/*
        db.all(`SELECT name FROM sqlite_master WHERE type='table' and name='memes';`, (err, rows) => {
            if (err) {
              console.log(err);
              reject('DB Error');
              return;
            }

            if (rows.length === 1) return;

            console.log("Creating 'memes' db table...");
            db.run(`CREATE TABLE memes (
              id INTEGER PRIMARY KEY,
              name TEXT,
              url TEXT,
              price INTEGER,
              old_prices TEXT);`, (err2) => {
                if (err2) {
                  reject('DB Error');
                  return;
                }
                console.log('Adding sample memes...');

            });
          });*/

    }

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