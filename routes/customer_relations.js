const express = require('express');
const router = express.Router();

// GET investor relations page
router.get('/', (req, res) => {
  res.render('customer_relations');
});

module.exports = router;
