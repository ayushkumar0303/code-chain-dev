import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
// import fs from 'fs';
// import { createObjectCsvWriter } from 'csv-writer';

const router = express.Router();

function isAuthenticated(req, res, next) {
  console.log(req.session);
  if (req.session.user){
    req=req.session;
    return next();
  }
  res.redirect('/login');
}


function isUserLogin(req, res, next) {
  // console.log(req.session);
    req=req.session;
    return next();
  // res.render('home.html',{username:null});
}


router.get('/', isUserLogin, (req, res) => {
  const username = req.session.user?.username || null;

  res.render('home.html', { username:username });
});


router.get('/register', (req, res) => res.render('register.html'));

router.post('/register', async (req, res) => {
  const { firstName, lastName, userName, password } = req.body;
  // console.log(firstName);
  // console.log(lastName);
  // console.log(userName);
  // console.log(password);
  const hash = await bcrypt.hash(password, 10);
  db.run(
    `INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)`,
    [firstName, lastName, userName, hash],
    (err) => {
      if (err) return res.render('error.html',{error:'Registration failed'});
      res.redirect('/login');
    }
  );
});

router.get('/contact-us',isUserLogin, (req, res) => {
  const username = req.session.user?.username || null;
  res.render('contact.html',{username});
});
router.get('/login', (req, res) => res.render('login.html'));

router.post('/login', (req, res) => {
  const { userName, password } = req.body;

  console.log(userName);
  console.log(password);
  // if(userName==='superadmin' && password==='superadmin'){
  //   res.redirect('/admin');
  //   return
  // }

  db.get(`SELECT * FROM users WHERE username = ?`, [userName], async (err, user) => {
    if (err || !user) return res.render('error.html',{error:'Invalid credentials'});

    const match = await bcrypt.compare(password, user.password);
    // console.log(user);
    if (match) {
      req.session.user=user;
      return user.username === 'admin123' ? res.redirect('/admin') : res.redirect('/survey');
    } else {
      res.render('error.html',{error:'Invalid credentials'});
    }
  });
});

router.get('/survey', isAuthenticated,(req, res) => res.render('survey.html'));

router.post('/survey',isAuthenticated, (req, res) => {
  const {
    name, age, occupation, gender, income,
    educationLevel, currentSkills, skillsToLearn,
    preferredLanguage, contactNumber
  } = req.body;

  const {username} = req.session.user;
  // console.log(username);

  db.run(
    `INSERT INTO survey (username,name, age, gender, occupation, anualIncome, educationLevel, currentSkills, skillsToLearn, preferredLanguage, contactNumber)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [username,name, age, gender, occupation, income, educationLevel, currentSkills, skillsToLearn, preferredLanguage, contactNumber],
    (err) => {
      if (err) return res.render('error.html',{error:'Survey submission failed'});
      res.render('thankyou.html');
    }
  );
});

router.get('/admin', isAuthenticated, (req, res) => {
  db.all(`
    SELECT * FROM survey
  `, [], (err, data) => {
    if (err) {
      return res.render('error.html',{error:err.message});
    }
    console.log(data);
    res.render('adminResponse.html', { data });
  });
});


export default router;
