const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('short_pulse_transformers');
});

module.exports = router;
