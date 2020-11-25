const db = require('../utils/database');

async function getClientByEmail(email) {
	const query = 'SELECT * FROM clients WHERE email = $1';

	const result = await db.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
}

async function insertClient(name, cpf, email, tel, userId) {
	const query = `INSERT INTO clients (
		name, cpf, email, tel, user_Id
		) values ($1, $2, $3, $4, $5)
		RETURNING *`;

	const result = await db.query({
		text: query,
		values: [name, cpf, email, tel, userId],
	});

	return result.rows.shift();
}

module.exports = {
	getClientByEmail,
	insertClient,
};
