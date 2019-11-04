const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('1_8kw_power_supply');
});

module.exports = router;
