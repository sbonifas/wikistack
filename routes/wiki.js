const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send(main());
});

router.post('/', (req, res, next) => {
  res.send('wiki');
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

module.exports = router;