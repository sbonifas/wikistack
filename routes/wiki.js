const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikiPage');
const { Page } = require('../models/index');
const { User } = require('../models/index');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) { next(error) };
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });

    const page = await Page.create({
      title: req.body.title,
      slug: req.body.title,
      content: req.body.content,
      status: req.body.status
    });

    page.setAuthor(user);

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
