const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET about page
router.delete('/contacts/:contactId', (req, res) => {
  db.query("DELETE FROM contacts WHERE id=?", [req.params.contactId], function (err, result) {
    if (err) {
      res.status(500).send({ error: err });
    }
    res.status(200).send({ result })
  });
});

router.post('/auth', (req, res) => {
  var username = req.body.username;
	var password = req.body.password;
	if (username === 'admin' && password === 'tqg-admin-pass!2019') {
	   req.session.loggedIn = true;
     res.redirect('/dashboard')
	} else {
		res.redirect('/login')
	}
})

module.exports = router;
