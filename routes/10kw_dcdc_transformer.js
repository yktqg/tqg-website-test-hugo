const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('10kw_dcdc_transformer');
});

module.exports = router;
