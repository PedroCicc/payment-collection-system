const db = require('../utils/database');

async function getUserByEmail(email) {
	const query = `SELECT * FROM users WHERE email = $1`;

	const result = await db.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
}

async function insertUser(email, password) {
	const query = `INSERT INTO users
	(email, password)
	values ($1, $2)
	RETURNING *`;

	const result = await db.query({
		text: query,
		values: [email, password],
	});

	return result.rows.shift();
}

module.exports = {
	getUserByEmail,
	insertUser,
};
