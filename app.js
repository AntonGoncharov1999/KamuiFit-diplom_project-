const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Post = require('./models/post');
const mongoose = require('mongoose');
const config = require('./config');

//database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () =>{
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });

mongoose.connect(config.MONGO_URL, { useMongoClient: true });

//express
const app = express();

//sets end uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts', express.static(path.join(__dirname,'node_modules', 'jquery', 'dist')));

//get request
app.get('/', (req, res) => {
  Post.find({}).then(posts =>{
    res.render('index', { posts:posts })
  });
});
app.get('/create', (req, res) => res.render('create'));
app.get('/registration', (req, res) => res.render('registration'));
app.get('/autorization', (req, res) => res.render('autorization'));

//post request
app.post('/create', (req, res) => {
  const {title,body}= req.body;
  Post.create({
    title:title,
    body:body
  }).then(post => console.log(post.id));
  res.redirect('/');
});

// catch 404 and orward to error handler
app.use((req, res, next) =>{
  const err = new Erorr('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-dlisable-next-line no-unused-vars
app.use((error, req, res, next) =>{
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

//start server
app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);
