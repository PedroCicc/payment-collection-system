const db = require('../utils/database');

async function insertPayment(clientId, description, value, dueDate, linkDoBoleto, codebar) {
	const query = `INSERT INTO payments (
		client_id, description, value, due_date, payment_slip_link, codebar
	) values ($1, $2, $3, $4, $5, $6)
	RETURNING *`;

	const result = await db.query({
		text: query,
		values: [clientId, description, value, dueDate, linkDoBoleto, codebar],
	});

	return result.rows.shift();
}

async function setPaymentAsPaid(idDaCobranca, currentDate) {
	const query = `UPDATE payments SET payment_date = $2
	WHERE payments.id = $1
	RETURNING *`;

	const result = await db.query({
		text: query,
		values: [idDaCobranca, currentDate],
	});

	return result.rows.shift();
}

async function getPayments(userId, cobrancasPorPagina, offset) {
	const query = `SELECT payments.id, payments.client_id, payments.description, payments.value,
		payments.due_date, payments.payment_date, payments.payment_slip_link
		FROM payments
		INNER JOIN clients
		ON payments.client_id = clients.id
		WHERE clients.user_id = $1
		LIMIT $2 OFFSET $3;`;

	const result = await db.query({
		text: query,
		values: [userId, cobrancasPorPagina, offset]
	});

	return result.rows;
}

async function countPaymentsByPage(userId) {
	const query = `SELECT count(*)::INTEGER as contagem_de_cobrancas FROM payments
	INNER JOIN clients
	ON payments.client_id = clients.id
	WHERE clients.user_id = $1;`;

	const result = await db.query({
		text: query,
		values: [userId]
	});

	return result.rows.shift();
}

module.exports = {
	insertPayment,
	setPaymentAsPaid,
	getPayments,
	countPaymentsByPage,
};
