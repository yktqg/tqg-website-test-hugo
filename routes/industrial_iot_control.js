const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('industrial_iot_control');
});

module.exports = router;
