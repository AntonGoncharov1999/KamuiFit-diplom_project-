const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
// eslint-disable-next-line node/no-unpublished-require
const session = require('express-session');
// eslint-disable-next-line node/no-unpublished-require
const MongoStore = require('connect-mongo')(session);
const config = require('./config');
const routes = require('./routes');
const datab = require('./models/index')

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });
mongoose.connect(config.MONGO_URL, { useMongoClient: true });

// express
const app = express();

//sessions
app.use(session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    })
  })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts',express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

// Get
app.get('/registration', (req, res) => {
  res.render('index');
});

app.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin; 
  res.render('start', {user:{
    id,
    login
  }});
});

app.get('/autorization', (req, res) => {
  res.render('autorization')
});

app.get('/createPost', (req, res)=>{
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('create', { user: { id, login } });
});

app.get('/createCard', (req, res)=>{
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('createCard', { user: { id, login } });
});

app.get('/news', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  datab.Post.find({}).then( posts =>{
    res.render('news', { posts:posts, user: { id, login } });
  });
});

app.get('/prais', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  datab.Card.find({}).then( cards =>{
    res.render('prais', { cards:cards, user: { id, login } });
  });
});

app.get('/cloub', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('cloub', { user: { id, login } });
});

app.get('/otzev', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  datab.Otzev.find({}).then( otzevs =>{
    res.render('otzev', { otzevs:otzevs, user: { id, login } });
  });
});

app.get('/comand', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  datab.Trener.find({}).then( trener =>{
    res.render('comand', { trener:trener, user: { id, login } });
  });
});

//Post
app.post('/comand', (req,res)=>{
  const {title,body}= req.body;
  datab.Trener.create({
    title:title,
    body:body
  }).then(trener => console.log(trener.id));
  res.redirect('/');
})

app.post('/createPost', (req, res)=>{
  const {title,body}= req.body;
  datab.Post.create({
    title:title,
    body:body
  }).then(post => console.log(post.id));
  res.redirect('/');
});

app.post('/createCard', (req, res)=>{
  const {title,body,cost}= req.body;
  datab.Card.create({
    title:title,
    body:body,
    cost:cost
  }).then(card => console.log(card.id));
  res.redirect('/');
});

app.post('/otzev', (req,res)=>{
  const {body} = req.body;
  const autor = req.session.userLogin;
  datab.Otzev.create({
    body: body,
    autor: autor
  }).then(otzev => console.log(otzev.id));
  res.redirect('/otzev');
  console.log(body);
})
/*
app.post('/news', (req, res)=>{
  const {id}= req.body;
  console.log(id);
});
*/



app.use('/api/auth', routes.auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);
