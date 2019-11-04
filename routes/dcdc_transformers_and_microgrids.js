const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('dcdc_transformers_and_microgrids');
});

module.exports = router;
