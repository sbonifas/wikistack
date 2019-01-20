const express = require('express');
const main = require('../views/main');
const addPage = require('../views/addPage');
const wikiPage = require('../views/wikiPage');
const editPage = require('../views/editPage');
const { Page } = require('../models/index');
const { User } = require('../models/index');

const router = express.Router();

router.get('/', async(req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) { next(error) }
});

router.post('/', async(req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
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
  } catch (error) { next(error) }
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
    const author = await User.findOne({
      where: {
        id: page.authorId
      }
    })
    res.send(wikiPage( page, author));
  } catch ( error) { next( error) }
});
router.get(`/:slug/edit`, async( req, res, next) => {
  try{
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    })
    const author = await User.findOne({
      where: {
        id: page.authorId
      }
    })
    res.send( editPage(page, author));
  } catch( error) { next( error)}
})
router.post(`/:slug`, async( req, res, next) => {
  try{
    console.log( `1: ${ req.body.title} ******************`)
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    })
    page.set({title: req.body.title,
      content: req.body.content,
      status: req.body.status})
      await page.save()
      res.redirect(`/wiki/${page.slug}`);
    } catch( error) { next( error)}
  })
  router.get(`/:slug/delete`, async( req, res, next) => {
    try{
      const page = await Page.findOne({
        where: {
          slug: req.params.slug
        }
      })
      page.destroy({ force: true})
      res.redirect(`/wiki`);
    } catch( error) { next( error)}
  })

module.exports = router;
