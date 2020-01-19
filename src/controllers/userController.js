const User= require('./../models/User');
const TransactionLog = require('./../models/TransactionLog');

const Auth = require('./../middleware/authorization');
const Validator = require('./../middleware/validator');
const Op = require('sequelize').Op;

// For a super admin who wants to see all registered users
const allUsers = (req, res) => {	
	User.findAll({include: { model: TransactionLog, as: "transactionLogs" }}).then(users => {
		return res.status(200).json({ status: 1, data: users });
	});
}

// To get a single user
const oneUser = (req, res) => {	
	const {id }= req.params;
	User.findByPk(id, {include: { model: TransactionLog, as: "transactionLogs" }}).then(user => {
		return res.status(200).json({
			status: 1,
			data: user
		});
	});
}

const getOneUser = async (pk) => {
	return await User.findByPk(pk, {include: { model: TransactionLog, as: "transactionLogs" }}).then( data => data);
}

// Get the data of an authenticated user
const getAuthUser = async (pk) => {
	return await User.findByPk(pk, {include: { model: TransactionLog, as: "transactionLogs" }}).then( data => data);
}

// Check if a phone number is already registered with a user
// Phone number is unique on the system
/**
 * 
 * @param {phone} res {found}: true | false
 */
const checkPhone  = (req, res) => {
	const { phone } = req.params;
	User.findOne({where: {phone}}).then( data => {
		return res.status(200).json({ status: 1, found: data ? true : false });
	});
}

// Check if an email is already registered with a user
// Email  is unique on the system
/**
 * 
 * @param {email} res {found}: true | false
 */
const checkEmail  = (req, res) => {
	const { email } = req.params;
	User.findOne({where: {email}}).then( data => {
		return res.status(200).json({ status: 1, found: data ? true : false });
	});
}


// Logic to create a new user
const createUser = (req, res) => {
	if (!req.body) return res.status(403).json({message: "user data required"});
	const newUserData = req.body;
	const isDataValid = Validator.validator(Validator.newUserStruct, newUserData);
	if (isDataValid !== true) return res.status(403).json(isDataValid);
	newUserData.password = Auth.hashPassword(newUserData.password);
	const dataToStore = {client_id, location_id, username, address, phone, email, password }  = newUserData;
	User.findOrCreate({
		where: {[Op.or]: [{phone}, {email}, {username}]},
		defaults: { ...dataToStore } 
	}).then( async (queryRes) => {
		if (queryRes[1]) return res.status(201).json({ status: 1, data: await getOneUser(queryRes[0].id).then(Data => Data) });
		return res.status(403).json({ status: 0, message: "data already exists" });
	})
	.catch(e => console.log(e));
};

const updateUser = async (req, res) => {
	if (!req.body) return res.status(403).json({message: "user data required"});

	const latestUserData = req.body;
	const isDataValid = Validator.validator(Validator.updateUserStruct, latestUserData);

	if (isDataValid !== true) return res.status(403).json(isDataValid);
	const user = await getOneUser(req.body.id);
	if (!user) return res.status(403).json({status: -1, message: "user not found"});
	const dataToStore = { address, location_id, phone, email }  = latestUserData;
	User.update({ ...dataToStore }, {returning: true, where: { id: latestUserData.id }})
	.then( async (updatedUser) => {
		return res.status(200).json({
			status: 1,
			data: await getAuthUser(latestUserData.id, latestUserData.client_id).then(Data => Data)
		});
	})
	.catch(e => console.log(e))
};


const deleteUser = (req, res) => {	
	const {id }= req.params;
	User.destroy ({where: {id}}).then(user => {
		return res.status(200).json({
			status: user < 1 ? -1 : 1,
			message: user < 1 ? 'data not found' : 'data deleted successfully'
		});
	}).catch(err => console.log('Error: ', err))
}

const changePassword = async (req, res) => {
	if (!req.body) return res.status(421).json({message: "password data required"});
	const userPasswordData = req.body;
	const isDataValid = Validator.validator(Validator.passwordData, userPasswordData);
	
	console.table(isDataValid);
	if (isDataValid !== true) return res.status(422).json(isDataValid);
	await getOneUser(userPasswordData.id).then(Data => {
		userPasswordData['existing_password'] = Data.password;
	});
	const isPasswordValid = Validator.validatePassword(userPasswordData);
	if (!isPasswordValid) return res.status(401).json({ status: -1, message: 'old password is invalid' });
	userPasswordData.new_password = Auth.hashPassword(userPasswordData.new_password);
	console.log(userPasswordData);
	User.update({ password: userPasswordData.new_password }, {returning: true, where: { id: userPasswordData.id }})
	.then( async (updatedUser) => {
		const user = await getOneUser(userPasswordData.id);
		return res.status(201).json({
			status: 1,
			data: await getAuthUser(userPasswordData.id, user.client_id).then(Data => Data)
		});
	});
}

const login = (req, res) => {
	const data = { username, password } = req.body;
	const isRequestValid = Validator.validator(Validator.userLoginData, data);
	if (isRequestValid !== true) return res.status(403).json(isRequestValid);
	User.findOne({where: {[Op.or]: [{email: username}, { username }]}}).then( async (user) => {
		if (!user) return res.status(401).json({status: -1, message: 'invalid credentials'});
		if (!Auth.comparePassword(password, user.password)) return res.status(401).json({status: '-1', message: 'invalid credentials'});
		return res.json({
			status: 1,
			token:  Auth.generateToken(user.id, user.email),
			data: await getAuthUser(user.id, user.client_id).then(Data => Data)
		});
	});
}




module.exports = { allUsers, oneUser, getOneUser, createUser, updateUser, deleteUser, checkPhone, checkEmail, changePassword, login  }