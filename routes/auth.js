const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// POST is registration
router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!login || !password || !passwordConfirm) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    if (!passwordConfirm) fields.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Длина логина от 3 до 16 символов!',
      fields: ['login']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['password', 'passwordConfirm']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Минимальная длина пароля 5 символов!',
      fields: ['password']
    });
  } else {
    models.User.findOne({
      login
    }).then(user => {
      if (!user) {
        bcrypt.hash(password, null, null, (err, hash) => {
          models.User.create({
            login,
            password: hash
          })
            .then(user => {
              console.log(user);
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              res.json({
                ok: true
              });
            })
            .catch(err => {
              console.log(err);
              res.json({
                ok: false,
                error: 'Ошибка, попробуйте позже!'
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Имя занято!',
          fields: ['login']
        });
      }
    });
  }
});

// POST is registration
router.post('/login', (req, res)=> {
  //console.log(req.body);
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else{
    console.log("vse ok");
    models.User.findOne({
      login
    }).then(user =>{
      if(!user){
        res.json({
          ok: false,
          error: "Не верный логин или пароль",
          fields: ['login', 'password']
        });
      } else{
        bcrypt.compare(password, user.password, function(err, result){
          console.log(result, ": проежай");
          if(!result){
            res.json({
              ok: false,
              error: "Не верный логин или пароль",
              fields: ['login', 'password']
            });
          }else{
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.json({
              ok:true
            });
          }
        });
      }
    }).catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: 'Ошибка, попробуйте позже!'
      });
    });
  }
});

//GET is logout
router.get('/logout', (req, res) => {
  if(req.session){
    //delete session 
    req.session.destroy(()=>{
      res.redirect('/');
    });
  } else{
    res.redirect('/');
  }
});

// remove
/*
router.post('/news', (req, res)=>{
  const {id} = req.body;
  console.log(id);
  
  models.Post.findOneAndRemove(id,(err,doc)=>{
    if(err) return console.log(err);
    console.log(id);
    console.log("Удалена запись ", doc);
  });
  res.redirect('/news');
});
*/

module.exports = router;
