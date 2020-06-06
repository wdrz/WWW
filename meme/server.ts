import express from "express";
import {MemeList} from "./memeList";
import {create_tables_if_needed} from "./dbcheck";
import session from 'express-session';
import * as sqlite from 'sqlite3';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import * as crypto from 'crypto-js';

// tslint:disable-next-line: no-var-requires
const sqliteStore = require('connect-sqlite3')(session);

sqlite.verbose();
const db = new sqlite.Database('userStorage.db');
const dbMeme = new sqlite.Database('memeStorage.db');

const secretkey = "a@3aFANp38ah"

async function main() : Promise<void> {
  const app = express();
  const port = 3000;

  const csrfProtection = csurf({cookie: true});

  const memeList = new MemeList(dbMeme);
  await memeList.create_tables_if_needed();
  await create_tables_if_needed(db);

  app.set("view engine", "pug");
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser(secretkey));
  app.use(express.static("public"));
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: secretkey,
    cookie: { maxAge: 15 * 60 * 1000 }, // session length: 15 min
    store: new sqliteStore()
  }));

  app.get("/", async (req, res) => {
    res.render('index', {
      title: 'Meme market',
      message: 'Meme list',
      memes: await memeList.mostExpensive(),
      user: req.session.login});
  });

  app.get("/meme/:p1(\\w+)", csrfProtection, async (req, res, next) => {
    memeList.getMemeById(Number(req.params.p1)).then(async (mem) => {
      res.render('meme', {
        title: "Meme market",
        meme: mem,
        prices: await memeList.getOldPrices(mem.id),
        csrfToken: req.csrfToken(),
        user: req.session.login})
      }).catch((err) => {
        res.status(404);
        res.render('error', {message: "404: Not Found"});
      });
  });

  app.get("/login", csrfProtection, (req, res, next) => {
    res.render('login', {csrfToken: req.csrfToken()});
  });

  app.post("/login", csrfProtection, (req, res) => {
    console.log("Login request POST");
    db.all(`SELECT * FROM users WHERE username = ? AND password = ?;`,
      [req.body.username, crypto.SHA256(req.body.password).toString(crypto.enc.Base64)], (err, rows) => {

      if (err) {
        console.log('DB Error');
        console.log(err);
        res.redirect("back");
      } else if (rows.length === 0) {
        console.log("Incorrect login and/or password.");

        res.render('login', {
          csrfToken: req.csrfToken(),
          error: "Incorrect credentials",
          username: req.body.username
        });
      } else {
        req.session.login = rows[0].username;
        req.session.user_id = rows[0].id;
        console.log("Logged successfully.");
        res.redirect("/");
      }
    });
  });

  app.post("/meme/:p1(\\w+)", csrfProtection, (req, res) => {
    if (!req.session.login) {
      res.status(403);
      res.render('error', {message: "403: Forbidden"});
      return;
    }

    memeList.getMemeById(Number(req.params.p1)).then(async (mem) => {
      if (isNaN(Number(req.body.nprice)) || req.body.nprice === "") {
        res.render('error', {message: "String must be numeric"});
      } else {
        memeList.changePrice(mem.id, req.session.login, req.body.nprice);
        res.redirect('back');
      }

      }).catch((err) => {
        res.status(404);
        res.render('error', {message: "404: Not Found"});
      });
  });

  app.get('/logout', (req, res) => {
    delete(req.session.login);
    delete(req.session.user_id);
    res.redirect('/');
  });

  app.use((req, res, next) => {
    res.status(404);
    res.render('error', {message: "404: Page not found"});
  });

  app.listen(port, () => {
    console.log(`server started at http://localhost:${ port }`);
  });
}

main();