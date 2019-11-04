const express = require('express');
const router = express.Router();
const fs = require('fs');

// for file downloads
router.get('/:fileName', (req, res) => {
  var tempFile=`public/pdf/${req.params.fileName}.pdf`;
  console.log(tempFile)
  fs.readFile(tempFile, function (err,data){
     res.contentType("application/pdf");
     res.end(data);
  });
});

module.exports = router;
