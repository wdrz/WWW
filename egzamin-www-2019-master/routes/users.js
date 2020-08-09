var express = require('express');
var router = express.Router();
var csurf = require('csurf');

const csrfProtection = csurf({cookie: true});

const ENTRIES_ON_PAGE = 5;

const user_query = `
  SELECT wpis.tresc, wpis.login_osoby, wpis.timestamp, wpis.rowid
  FROM sledzacy
  LEFT JOIN wpis
  ON wpis.login_osoby = sledzacy.login_sledzonego
  WHERE sledzacy.login_osoby = ?
  ORDER BY wpis.timestamp DESC;
`;

const own_query = `
  SELECT login_osoby, tresc, timestamp, rowid
  FROM wpis
  WHERE login_osoby = ?
  ORDER BY wpis.timestamp DESC;
`;

function is_page_active(page, numOfAllEntries) {
  if (page < 0) return false;
  else if (page === 0) return true;
  else if (page * ENTRIES_ON_PAGE >= numOfAllEntries) return false;
  else return true;
}

function user_pagination(req, res, next, page, query, is_own) {
  let db =req.app.locals.db;

  db.all(query, [req.session.login], (err, rows) => {
      if (err) {
        console.log(err);
        res.send("DB error");
      } else {
        console.log(page, rows.length);
        if (!is_page_active(page, rows.length)) {
          res.status(404);
          res.render('error', {message: "404: Page Not Found"});
          return;
        }

        res.render(is_own ? 'ownentries' : 'users', {
          entries: rows.slice(ENTRIES_ON_PAGE * page, (page + 1) * ENTRIES_ON_PAGE),
          title: "Wpisy śledzonych użytkowników",
          back: is_page_active(page - 1, rows.length),
          next: is_page_active(page + 1, rows.length),
          number_from: ENTRIES_ON_PAGE * page + 1,
          page,
          isteacher: req.session.role,
          del: is_own,
          nav_path: is_own ? "/users/my_entries/" : "/users/page/",
          csrfToken: is_own ? req.csrfToken() : undefined
        });
      }
  });
}

function block_unlogged(req, res, next) {
  if (!req.session.login) {
    res.status(403);
    res.render('error', {message: "403: Forbidden"});
  } else {
    next();
  }
}

function block_pupils(req, res, next) {
  if (!req.session.role) {
    res.status(403);
    res.render('error', {message: "403: Forbidden"});
  } else {
    next();
  }
}

router.get('/', block_unlogged, (req, res, next) => user_pagination(req, res, next, 0, user_query, false));
router.get('/page/:p1(\\d+)', block_unlogged, (req, res, next) => 
  user_pagination(req, res, next, parseInt(req.params.p1), user_query, false)
);

router.get('/my_entries', block_unlogged, block_pupils, csrfProtection,
  (req, res, next) => user_pagination(req, res, next, 0, own_query, true)
);
router.get('/my_entries/:p1(\\d+)', block_unlogged, block_pupils, csrfProtection, (req, res, next) => 
  user_pagination(req, res, next, parseInt(req.params.p1), own_query, true)
);


router.post('/delete/:p1(\\d+)', block_unlogged, block_pupils, csrfProtection, (req, res) => {
  let db = req.app.locals.db;

  db.all(`
    DELETE FROM wpis
    WHERE rowid = ?;
  `, [req.params.p1], (err, rows) => {
      if (err) {
        console.log(err);
        res.send("DB error");
      } else {
        res.redirect("back");
      }
  });
});

router.post('/newentry', block_unlogged, block_pupils, csrfProtection, (req, res) => {
  let db = req.app.locals.db;

  db.all(`
    INSERT INTO wpis (login_osoby, timestamp, tresc)
    VALUES (?, ?, ?);
  `, [req.session.login, new Date().toISOString(), req.body.newentry], (err, rows) => {
      if (err) {
        console.log(err);
        res.send("DB error");
      } else {
        res.redirect("back");
      }
  });
});

module.exports = router;
