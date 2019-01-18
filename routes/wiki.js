const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikiPage');
const { Page } = require('../models/index');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const pages = await Page.findAll();
  res.send(main(pages));
});

router.post('/', async (req, res, next) => {
  const page = new Page({
    title: req.body.title,
    slug: req.body.title,
    content: req.body.content,
    status: req.body.status
  });
  try {
    await page.save();
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) { next(error) };
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    res.send(wikiPage(page));
  } catch (error) { next(error) };
});

module.exports = router;
