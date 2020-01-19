const bcrypt = require('bcrypt');

module.exports = {
	jwtSecret: 'offline-online-api-for-senior-programmer-is-gonna-be-wonderful',
	salt: bcrypt.genSaltSync(10)
}