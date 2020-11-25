const response = require('./response');
const PaymentsDB = require('../repositories/paymentsdb');

async function createPayment(ctx) {
	const {
		clientId = null,
		description = null,
		value = null,
		dueDate = null,
	} = ctx.request.body;

	if (!clientId || !description || !value || !dueDate) {
		return response(ctx, 400, { message: 'Pedido mal formatado.' });
	}

	// Corrigir, não posso checar se a cobrança existe pelo client id
	const payment = await PaymentsDB.getPaymentsByClientId(clientId);

	if (payment) {
		return response(ctx, 400, {
			message: 'Essa cobrança já foi criada no nosso banco de dados.',
		});
	}

	const newPayment = await PaymentsDB.insertPayment(
		clientId,
		description,
		value,
		dueDate
	);

	if (newPayment) {
		return response(ctx, 201, {
			payment: {
				clientId: newPayment.clientId,
				description: newPayment.description,
				value: newPayment.value,
				dueDate: newPayment.dueDate,
				paymentSlipLink: paymentSlipLink,
				status: 'AGUARDANDO',
			},
		});
	}

	return response(ctx, 400, { message: 'Erro desconhecido.' });
}

module.exports = {
	createPayment,
};
