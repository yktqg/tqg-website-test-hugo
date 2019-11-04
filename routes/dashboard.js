const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET about page
router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    db.query("select * from contacts", function (err, result) {
      let contacts = [];
      if(err){
        contacts = []
        res.render('dashboard', { contacts: contacts });
      }

      contacts = JSON.parse(JSON.stringify(result));

      res.render('dashboard', { contacts: contacts });
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
