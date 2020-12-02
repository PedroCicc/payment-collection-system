const db = require('../utils/database');

async function insertPayment(clientId, description, value, dueDate, linkDoBoleto, codebar) {
	const query = `INSERT INTO payments (
		client_id, description, value, due_date, payment_slip_link, codebar
	) values ($1, $2, $3, $4, $5, $6)
	RETURNING *`;
	console.log(clientId, description, value, dueDate, linkDoBoleto, codebar);
	const result = await db.query({
		text: query,
		values: [clientId, description, value, dueDate, linkDoBoleto, codebar],
	});
	// console.log(result);
	return result.rows.shift();
}

async function getPaymentById(idDaCobranca) {
	const query = `SELECT * FROM payments WHERE id = $1`;

	const result = await db.query({
		text: query,
		values: [idDaCobranca],
	});

	return result.rows.shift();
}

module.exports = {
	insertPayment,
	getPaymentById
};
