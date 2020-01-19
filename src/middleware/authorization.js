/**
 * Our Authorization is handled here
 */

const  bcrypt =  require('bcrypt');
const salt = bcrypt.genSaltSync(10)
let config = require('../config/config');
const  jwt = require('jsonwebtoken');

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;


let options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwtSecret
};

const comparePassword =  (candidatePassword, hashedPassword) => {
	return bcrypt.compareSync(candidatePassword, hashedPassword);
};

const hashPassword = (password) => {
	return bcrypt.hashSync(password, salt);
}

const generateToken = (id, email) => {
	return jwt.sign({id, email}, config.jwtSecret, {
		expiresIn: 86400		// Any issued token EXPIRES IN 1 day
	});
}

module.exports = { hashPassword, comparePassword, generateToken };