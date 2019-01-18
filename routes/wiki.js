const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikiPage');
const { Page} = require(`../models/index`)

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send(main());
});
router.post('/', async(req, res, next) => {
  const page = new Page({
    title: req.body.title,
    slug: req.body.title,
    content: req.body.content,
    status: req.body.status
  });
  console.log( page)
  try {
    await page.save();
    res.redirect('/');
  } catch (error) { next(error) }
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});
router.get('/:slug', async(req, res, next) => {
  const page = await Page.findOne({ where: { slug: req.params.slug}

  })
  res.json(page)
  res.send(wikiPage(page));
});

module.exports = router;
