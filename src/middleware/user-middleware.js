let User = require('../models/User');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let config = require('../config/config');

let options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwtSecret
};

module.exports = new JwtStrategy(options, (jwt_payload, done) => {
	User.findOne({where: { id: jwt_payload.id }}).then( user => {
		return user ? done(null, user) : done(null, false);
	});
});
