const express = require('express');
const morgan = require('morgan');
const { db } = require('./models/index');
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  res.redirect('/wiki');
});

app.use('/wiki', wikiRouter);
app.use('/user', userRouter);

db.authenticate().
then(() => {
  console.log('Connected to the database');
});

const PORT = 3000;

const init = async() => {
  await db.sync({ force: false });
  app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
  });
}

init();
