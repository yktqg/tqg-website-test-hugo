const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('50kv_100a_short_pulse');
});

module.exports = router;
