import express from "express";
import {MemeList} from "./memeList";
import {Meme} from "./meme";

const app = express();

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
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render('index', { title: 'Meme market', message: 'Meme list', memes: memeList.mostExpensive});
});
app.get("/meme/:p1(\\w+)", (req, res, next) => {
    const memTemp = memeList.getMemeById(Number(req.params.p1));
    if (memTemp === undefined) {
        res.render('error', {message: "Wrong meme id"});
    } else {
        res.render('meme', { title: "Meme market", meme: memTemp});
    }
});

app.post("/meme/:p1(\\w+)", (req, res) => {
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