import * as sqlite from 'sqlite3';
import * as crypto from 'crypto-js';

async function create_users(db: sqlite.Database) : Promise<void> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM sqlite_master WHERE type='table' and name='users';`, (err, rows) => {
      if (err) {
        console.log(err);
        reject('DB Error');
        return;
      }

      if (rows.length === 1) {
        console.log('Database tables already exist.');
        resolve();
        return;
      }

      console.log('Creating users db tables...');
      db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);`, (err2) => {
        if (err2) {
          reject('DB Error');
          return;
        }
        console.log('Adding users...');
        db.run(`
          INSERT INTO users (id, username, password)
          VALUES (1, ?, ?);`,
          ["user1", crypto.SHA256("12345").toString(crypto.enc.Base64)], (err3) => {
            if (err3) {
              console.log(err3);
              reject('DB Error');
              return;
            }
            console.log('Done.');
            console.log('Added user user1/12345.');
            resolve();
          });
      });
    });
})
}
/*
async function create_memes(db: sqlite.Database) : Promise<void> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM sqlite_master WHERE type='table' and name='users';`, (err, rows) => {
      if (err) {
        console.log(err);
        reject('DB Error');
        return;
      }

      if (rows.length === 1) {
        console.log('Database tables already exist.');
        resolve();
        return;
      }

      console.log('Adding sample memes...');

    });
})
}
*/
export async function create_tables_if_needed(db: sqlite.Database) : Promise<void> {
  await create_users(db);
}