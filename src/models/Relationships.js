/**
 * This manages the relationship between a user who has many transaction logs
 * Each transaction log also belongs to a user as defined here
 */
const User = require('./User');
const TransactionLog = require('./TransactionLog');

exports = User.hasMany(TransactionLog, {
	foreignKey: 'user_id',
	as: 'transactionLogs'
});

exports = TransactionLog.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
});
