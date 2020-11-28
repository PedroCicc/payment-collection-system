const { off } = require('../utils/database');
const db = require('../utils/database');

async function getClientByEmail(email) {
	const query = 'SELECT * FROM clients WHERE email = $1';
	// Pegar userID
	const result = await db.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
}

async function getClientById(userId, idDoCliente) {
	const query = 'SELECT * FROM clients WHERE user_id = $1 AND id = $2';

	const result = await db.query({
		text: query,
		values: [userId, idDoCliente],
	});

	return result.rows.shift();
}

async function insertClient(nome, cpf, email, tel, idDoUsuario) {
	const query = `INSERT INTO clients (
		name, cpf, email, tel, user_id
		) values ($1, $2, $3, $4, $5)
		RETURNING *`;

	const result = await db.query({
		text: query,
		values: [nome, cpf, email, tel, idDoUsuario],
	});

	return result.rows.shift();
}

async function editClient(id, nome, cpf, email) {
	const query = `UPDATE clients SET
	name = $2, cpf = $3, email = $4
	WHERE id = $1 RETURNING *`;

	const result = await db.query({
		text: query,
		values: [id, nome, cpf, email],
	});

	return result.rows.shift();
}

async function getClients(userId, clientesPorPagina, offset) {
	const query = `SELECT * FROM clients WHERE user_id = $1 LIMIT $2 OFFSET $3`;

	const result = await db.query({
		text: query,
		values: [userId, clientesPorPagina, offset],
	});

	return result.rows;
}

// Formular função searchClients

module.exports = {
	getClientByEmail,
	getClientById,
	insertClient,
	editClient,
	getClients,
};
