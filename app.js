const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Post = require('./models/post');

const app = express();

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
/*app.post('/registration', (req, res) => {
  const {login, password, email}= req.body;
  User.create({
    login:login,
    password:password,
    email:email
  }).then(post => console.log(post.id));
  res.redirect('/autorization');
});*/
//app.post('/autorization', (req, res) => {});

module.exports = app;
