var express = require('express');
var router = express.Router();

router.get('/newentries', function(req, res) {
  let db =req.app.locals.db;

  db.all(`
    SELECT login_osoby, timestamp, tresc
    FROM wpis
    ORDER BY timestamp DESC
    LIMIT 5
      `, (err, rows) => {
      if (err) {
        console.log(err);
        res.send("DB error");
      } else {
        console.log(rows);
        res.json(JSON.stringify(rows));
      }
  });
});

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Logowanie'});
});

router.post('/', function(req, res, next) {
  let db =req.app.locals.db;

  db.all(`
    SELECT login, haslo, nauczyciel
    FROM osoba
    WHERE login = ? AND haslo = ?
      `, [req.body.login, req.body.haslo], (err, rows) => {
      if (err) {
        console.log(err);
        res.send("DB error");
      } else if (rows.length === 0) {
        res.render('index', {rows, title:"Logowanie", err: "Login lub hasło niepoprawne"});
      } else {
        req.session.login = rows[0].login
        req.session.role = rows[0].nauczyciel
        console.log(req.session.role);
        res.redirect('/users');
      }
  });
});

router.get('/logout', function(req, res, next) {
  req.session.login = undefined;
  req.session.role = undefined;
  res.redirect("/");
});

module.exports = router;
