import express from "express";
import {MemeList} from "./memeList";
import {Meme} from "./meme";
import {create_tables_if_needed} from "./dbcheck";
import * as sqlite from 'sqlite3';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

sqlite.verbose();
const db = new sqlite.Database('userStorage.db');
create_tables_if_needed(db).then(run).catch((err) => {console.log("Promise rejected." + err)});

async function run() : Promise<void> {
  const app = express();

  const csrfProtection = csurf({cookie: true});

  const port = 3000;

  const memeList = new MemeList();
  memeList.addMeme(new Meme(1, "Gold", "https://i.redd.it/ktm2s80sdfs41.jpg", 1000));
  memeList.addMeme(new Meme(2, "Platinum", "https://i.redd.it/03isifla0tx41.jpg", 1100));
  memeList.addMeme(new Meme(3, "Elite", "https://i.redd.it/ghgtq9k9swx41.jpg", 1200));
  memeList.addMeme(new Meme(10, "Hehe", "https://i.redd.it/h7rplf9jt8y21.png", 200));
  memeList.addMeme(new Meme(9, "Haha", "http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg", 100));
  memeList.addMeme(new Meme(8, "Meme", "https://i.imgflip.com/30zz5g.jpg", 300));

  app.set("view engine", "pug");
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser());
  app.use(express.static("public"));


  app.get("/", (req, res) => {
    res.render('index', { title: 'Meme market', message: 'Meme list', memes: memeList.mostExpensive, user: "admin"});
  });
  app.get("/meme/:p1(\\w+)", csrfProtection, (req, res, next) => {
    const memTemp = memeList.getMemeById(Number(req.params.p1));
    if (memTemp === undefined) {
      res.render('error', {message: "Wrong meme id"});
    } else {
      res.render('meme', { title: "Meme market", meme: memTemp, csrfToken: req.csrfToken() });
    }
  });
  app.get("/login", csrfProtection, (req, res, next) => {
    res.render('login', {csrfToken: req.csrfToken()});
  });

  app.post("/login", csrfProtection, (req, res) => {
    console.log("Login request POST");

    db.all(`SELECT * FROM users WHERE username = ? AND password = ?`,
      [req.body.username, req.body.password], (err, rows) => {

      if (err) {
        console.log('DB Error');
        console.log(err);
        res.redirect("back");
      } else if (rows.length === 0) {
        console.log("Incorrect login and/or password.");
        console.log(req.body.username + " " + req.body.password);
        // res.set("error", "ZLE HASLO");
        // res.end();
        // res.redirect("back");
        res.render('login', {csrfToken: req.csrfToken(), error: "Incorrect credentials", username: req.body.username});
      } else {
        console.log("Logged successfully.");
        res.redirect("/");
      }

    });
  });

  app.post("/meme/:p1(\\w+)", csrfProtection, (req, res) => {
    console.log(req.body);
    const memTemp = memeList.getMemeById(Number(req.params.p1))

    if (memTemp === undefined || isNaN(Number(req.body.nprice))) {
      res.render('error', {message: "String must be numeric"});
    } else if (req.body.nprice === "") {
      res.render('error', {message: "String cannot be empty"});
    } else {
      memTemp.changePrice(Number(req.body.nprice));
      res.redirect('back');
    }

  });

  app.use((req, res, next) => {
    res.status(404);

    if (req.accepts('html')) {
      res.render('error', {message: "Page not found"});
    }
  });

  app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
  });
}