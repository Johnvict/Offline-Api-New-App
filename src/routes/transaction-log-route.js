/**
 * This file manages all the routes that come in via /transaction-log/*
 */
const express = require('express');
const Router = express.Router();
const transactionLogCtrl  = require('./../controllers/transactionLog');

var userMiddleware = require('./../middleware/user-middleware');
const app = express(); 

const passport = require('passport');
app.use(passport.initialize());
passport.use(userMiddleware);
const userAuth = passport.authenticate('jwt', {session: false});


Router.get('/all', (req, res) => transactionLogCtrl .alltransactionLog(req, res));
Router.get('/one/:token', (req, res) => transactionLogCtrl .oneTransactionLog(req, res));
Router.get('/check-exist/:token', (req, res) => transactionLogCtrl.checkTransactionLog(req, res));
Router.post('/create',  userAuth, (req, res) => transactionLogCtrl .createTransactionLog(req, res)); 

Router.delete('/delete/:token', (req, res) => transactionLogCtrl .deleteTransactionLog(req, res));


module.exports = Router;
