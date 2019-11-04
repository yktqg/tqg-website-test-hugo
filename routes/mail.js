const express = require('express');
const router = express.Router();
const API_KEY = '0a98e767024f339985a40eec93099c5d-c27bf672-180902ee';
const DOMAIN = 'mg.johnssonswebb.com';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN, host: "api.eu.mailgun.net"});
const db = require('../db.js');


// GET send contact mail
router.post('/contact', function(req, res) {
  const data = {
    from: 'Contact form TheQuantumGuys.com <me@samples.mailgun.org>',
    to: 'prospects@tqg.se',
    subject: 'A new message from the website',
    html: `<html><p><b>Message</b>: ${req.body.message}</p><br/><br/><p><b>Phone:</b> ${req.body.phone}</p></html>`,
  };

  mailgun.messages().send(data, (error, body) => {
    if(error) {
      console.log(error);
    }

    db.query("select * from contacts where email = ?", req.body.email, function (err, result) {
      if(result.length === 0) {
        db.query("insert into contacts set email = ?, timestamp = ?", [req.body.email, new Date()])
      }
    });

    res.redirect('/thanks');
  });

  return;
});

// GET send download mail
router.post('/:fileName', function(req, res) {
  const data = {
    from: 'TQG Email <me@samples.mailgun.org>',
    to: req.body.to_email,
    subject: 'Here is your requested file from TheQuantumGuys.com',
    text: 'Here is your file',
    attachment: `public/pdf/${req.params.fileName}.pdf`
  };

  mailgun.messages().send(data, (error, body) => {
    if(error) {
      console.log(error);
    }
    res.send(body);
  });

  return;
});

// GET about "download"
router.post('/download/about', (req, res) => {
  const data = {
    from: 'TQG Email <me@samples.mailgun.org>',
    to: req.body.to_email,
    subject: 'You requested to download the paper "about us" on The Quantum Guys website.',
    text: 'The content currently under development, for further questions please contact The Quantum Guys using the Contact Form in the webpage.',
  };

  mailgun.messages().send(data, (error, body) => {
    if(error) {
      console.log(error);
    }
    res.send(body);
  });

  return;
});

// GET send download mail
router.post('/message_contact/:to_email', function(req, res) {
  const data = {
    from: 'The Quantum Guys <me@samples.mailgun.org>',
    to: req.params.to_email,
    subject: 'You have a new message from The Quantum Guys',
    text: req.body.message,
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body)
    res.redirect('/dashboard')
  });

  return;
});

module.exports = router;
