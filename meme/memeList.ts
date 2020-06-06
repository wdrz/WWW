import * as sqlite from 'sqlite3';

interface Meme {
  id?: number,
  name: string,
  url: string,
  price?: number
}

interface Price {
  id?: number,
  memeId: number,
  user: string,
  price: number,
  miliseconds: number
}

export class MemeList {

  #db: sqlite.Database;

  constructor(db: sqlite.Database) {
    this.#db = db;
  }

  async create_prices_table() : Promise<void> {
    console.log('Creating prices table...');
    return new Promise((resolve, reject) => {
      this.#db.run(`CREATE TABLE prices (
        id INTEGER PRIMARY KEY,
        memeId INTEGER NOT NULL,
        price INTEGER,
        user TEXT,
        miliseconds INTEGER,
        FOREIGN KEY (memeId)
        REFERENCES memes (id));`, async (err2) => {
          if (err2) {
            reject('DB Error (CREATE prices)' + err2);
            return;
          }
          resolve();
      });
    });
  }


  async create_prices_table_if_needed() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.#db.all(`SELECT name FROM sqlite_master WHERE type='table' and name='prices';`, async (err, rows) => {
        if (err) {
          console.log(err);
          reject('DB (table prices) Error');
        } else if (rows.length === 1) {
          console.log('Table prices already exists.');
          resolve();
        } else {
          this.create_prices_table().then(() => resolve()).catch(() => reject("Error while creating prices table."));
        }
      });
    });
  }

  async create_memes_table(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Creating memes db tables...');
      this.#db.run(`CREATE TABLE memes (
        id INTEGER PRIMARY KEY,
        name TEXT,
        url TEXT);`, async (err) => {
          if (err) {
            reject('DB Error (CREATE memes)');
            return;
          }
          await this.add_sample_memes();
          resolve();
      });
    });
  }

  async create_memes_table_if_needed() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.#db.all(`SELECT name FROM sqlite_master WHERE type='table' and name='memes';`, (err, rows) => {
        if (err) {
          console.log(err);
          reject('DB (Meme) Error');
        } else if (rows.length === 1) {
          console.log('Database table memes already exists.');
          resolve();
        } else {
          this.create_memes_table().then(() => resolve()).catch(() => reject());
        }
      });
    })
  }

  async add_sample_memes() : Promise<void> {
    console.log('Adding sample memes and their prices...');
    await this.addMeme({id: 1, name: "Gold", url: "https://i.redd.it/ktm2s80sdfs41.jpg"});
    await this.addMeme({id: 2, name: "Platinum", url: "https://i.redd.it/03isifla0tx41.jpg"});
    await this.addMeme({id: 3, name: "Elite", url: "https://i.redd.it/ghgtq9k9swx41.jpg"});
    await this.addMeme({id: 4, name: "Hehe", url: "https://i.redd.it/h7rplf9jt8y21.png"});
    await this.addMeme({id: 5, name: "Haha", url: "http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg"});
    await this.addMeme({id: 6, name: "Meme", url: "https://i.imgflip.com/30zz5g.jpg"});

    const time : number = Date.now();

    await this.addPrice({memeId: 1, user: "SYSTEM", price: 1000, miliseconds: time});
    await this.addPrice({memeId: 1, user: "SYSTEM", price: 10, miliseconds: time - 1});
    await this.addPrice({memeId: 1, user: "SYSTEM", price: 600, miliseconds: time - 2});

    await this.addPrice({memeId: 2, user: "SYSTEM", price: 1100, miliseconds: time});
    await this.addPrice({memeId: 3, user: "SYSTEM", price: 1200, miliseconds: time});
    await this.addPrice({memeId: 4, user: "SYSTEM", price:  200, miliseconds: time});
    await this.addPrice({memeId: 5, user: "SYSTEM", price:  100, miliseconds: time});
    await this.addPrice({memeId: 6, user: "SYSTEM", price:  300, miliseconds: time});
  }

  async create_tables_if_needed() : Promise<void> {
    await this.create_prices_table_if_needed();
    await this.create_memes_table_if_needed();
  }


  async addMeme(meme : Meme) : Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      this.#db.all("INSERT INTO memes (id, name, url) VALUES (?, ?, ?);", [meme.id || null, meme.name, meme.url], (err) => {
        if (err) {
          console.log(err);
          reject('DB Error: meme could not be added');
          return;
        }
        console.log('Added meme ' + meme.name);
        resolve();
      });
    });
  }

  async addPrice(pr: Price) : Promise<void> {
    return new Promise<void> ((resolve, reject) => {
      this.#db.all("INSERT INTO prices (id, memeId, user, price, miliseconds) VALUES (?, ?, ?, ?, ?);",
        [pr.id || null, pr.memeId, pr.user, pr.price, pr.miliseconds], (err) => {
          if (err) {
            console.log(err);
            reject('DB Error: price could not be added');
            return;
          }
          resolve();
      });
    });
  }

  async changePrice(memeId: number, user: string, price: number) : Promise<void> {
    const time : number = Date.now();
    this.addPrice({memeId, user, price, miliseconds: time});
  }

  async getOldPrices(memeId: number): Promise<Price[]>  {
    return new Promise<Price[]> ((resolve, reject) => {
      this.#db.all(`
        SELECT * FROM prices
        WHERE memeId = ?
        ORDER BY miliseconds DESC;`, [memeId], (err, rows) => {
          if (err) {
            console.log(err);
            reject('DB Error while searching for historic prices.');
          } else {
            // console.log(rows);
            resolve(rows);
          }
        });
    });
  }

  async getPriceOfMeme(memeId: number) : Promise<number> {
    return new Promise<number> ((resolve, reject) => {
      this.getOldPrices(memeId).then((prices) => resolve(prices[0].price)).catch((err) => reject(err));
    });
  }


  async mostExpensive() : Promise<Meme[]> {
    return new Promise<Meme[]> ((resolve, reject) => {
      this.#db.all(`
        SELECT memes.*, tab.price
        FROM memes
        INNER JOIN (
          SELECT MAX(miliseconds), price, memeId
          FROM prices
          GROUP BY memeId
        ) tab
        ON memes.id=tab.memeId
        ORDER BY price DESC LIMIT 3;`, async (err, rows) => {
          // console.log(rows);
          if (err) {
            console.log(err);
            reject('DB Error: unsuccessfull search for top 3 memes');
            return;
          }
          resolve(rows);
        });
    });
  }

  async getMemeById(id: number) : Promise<Meme> {
    return new Promise<Meme> ((resolve, reject) => {
      this.#db.all("SELECT * FROM memes WHERE id = ?;", [id], async (err, rows) => {
        if (err || rows.length !== 1) {
          console.log(err);
          reject('Error while getting meme by id.');
        } else {
          const meme : Meme = rows[0];
          meme.price = await this.getPriceOfMeme(meme.id);
          resolve(meme);
        }
      });
    });
  }

}