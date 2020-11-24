const bcrypt = require('bcryptjs');

async function check(password, hash) {
	const comparison = await bcrypt.compare(password, hash);
	return comparison;
}

module.exports = { check };
