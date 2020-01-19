const express = require('express');
const Router = express.Router();
const UserRoutes = require("./user-route");
const TransactionLogRoutes = require("./transaction-log-route");

Router.get('/', (req, res) => {
	res.json({message: 'Hello! API server is working fine'});
});
Router.use('/user', UserRoutes);
Router.use('/transaction-log', TransactionLogRoutes);


module.exports = Router;