const express = require('express');
const router = express.Router();

// GET about page
router.get('/', (req, res) => {
  res.render('opc_ua');
});

module.exports = router;
