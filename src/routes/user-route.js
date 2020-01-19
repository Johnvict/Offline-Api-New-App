/**
 * This file manages all the routes that come in via /user/*
 */

const express = require('express');
const Router = express.Router();
const userCtrl = require('./../controllers/userController');

var userMiddleware = require('./../middleware/user-middleware');
const app = express(); 

const passport = require('passport');
app.use(passport.initialize());
passport.use(userMiddleware);
const userAuth = passport.authenticate('jwt', {session: false});

Router.get('/all', userAuth, (req, res) => userCtrl.allUsers(req, res));
Router.get('/one/:id', (req, res) => userCtrl.oneUser(req, res));
Router.get('/check-phone/:phone', (req, res) => userCtrl.checkPhone(req, res));
Router.get('/check-email/:email', (req, res) => userCtrl.checkEmail (req, res));
Router.post('/create', (req, res) => userCtrl.createUser(req, res));

Router.put('/update', userAuth, (req, res) => userCtrl.updateUser(req, res));
Router.delete('/delete/:id', userAuth, (req, res) => userCtrl.deleteUser(req, res));

Router.put('/update-password', userAuth, (req, res) => userCtrl.changePassword(req, res));
Router.post('/login', (req, res) => userCtrl.login(req, res));

module.exports = Router;
