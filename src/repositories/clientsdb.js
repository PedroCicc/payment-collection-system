const { off } = require('../utils/database');
const db = require('../utils/database');

async function getClientByEmail(userId, email) {
	const query = `SELECT * FROM clients
	WHERE user_id = $1 AND email = $2`;
	const result = await db.query({
		text: query,
		values: [userId, email],
	});

	return result.rows.shift();
}

async function getClientById(userId, idDoCliente) {
	const query = `SELECT * FROM clients
	WHERE user_id = $1 AND id = $2`;

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
	const query = `UPDATE clients
	SET name = $2, cpf = $3, email = $4
	WHERE id = $1 RETURNING *`;

	const result = await db.query({
		text: query,
		values: [id, nome, cpf, email],
	});

	return result.rows.shift();
}

async function getClients(userId, clientesPorPagina, offset) {
	const query = `SELECT clients.name, clients.email
	FROM clients
	LEFT JOIN payments
	ON clients.id = payments.client_id
	WHERE clients.user_id = $1 LIMIT $2 OFFSET $3`;

	const result = await db.query({
		text: query,
		values: [userId, clientesPorPagina, offset],
	});

	return result.rows;
}

async function getAllClients(userId) {
	const query = `SELECT clients.id
	FROM clients
	WHERE clients.user_id = $1`;

	const result = await db.query({
		text: query,
		values: [userId],
	});

	return result.rows;
}

async function countClientsByPage(userId) {
	const query = `SELECT count(*)::INTEGER as contagem_de_clientes
	FROM clients
	INNER JOIN payments
	ON clients.id = payments.client_id
	WHERE clients.user_id = $1`;

	const result = await db.query({
		text: query,
		values: [userId]
	});

	return result.rows.shift();
}

async function countPaymentsByClient(userId) {
	const query = `SELECT count(clients.id)::INTEGER as contagem_de_cobrancas
	FROM payments
	INNER JOIN clients
	ON payments.client_id = clients.id
	WHERE clients.user_id = $1`;
	
	const result = await db.query({
		text: query,
		values: [userId]
	});

	return result.rows.shift();
}

module.exports = {
	getClientByEmail,
	getClientById,
	insertClient,
	editClient,
	getClients,
	countClientsByPage,
	countPaymentsByClient,
	getAllClients,
};
