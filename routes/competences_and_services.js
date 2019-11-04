const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('competences_and_services');
});

module.exports = router;
