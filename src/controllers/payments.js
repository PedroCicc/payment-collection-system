const response = require('./response');
const ClientsDB = require('../repositories/clientsdb');
const PaymentsDB = require('../repositories/paymentsdb');
const Pagarme = require('../utils/pagarme');

async function createPayment(ctx) {
	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	const userId = ctx.state.id;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const cliente = await ClientsDB.getClientById(userId, idDoCliente);

	if (!cliente) {
		return response(ctx, 400, { mensagem: 'O cliente não existe.' });
	}

	const boletoBancario = await Pagarme.gerarBoleto(
		cliente.name,
		cliente.cpf,
		descricao,
		valor,
		vencimento
	);

	if (!boletoBancario) {
		return response(ctx, 400, {
			mensagem: 'Não foi possível gerar o boleto.',
		});
		// Exibir erro da pagarme
	}

	const newPayment = await PaymentsDB.insertPayment(boletoBancario);

	if (newPayment) {
		return response(ctx, 201, {
			cobranca: {
				idDoCliente: newPayment.idDoCliente,
				descricao: newPayment.descricao,
				valor: newPayment.valor,
				vencimento: newPayment.vencimento,
				linkDoBoleto: transaction.boletoUrl,
				status: 'AGUARDANDO',
			},
		});
	}

	// return response(ctx, 200, { mensagem: 'Sucesso.', boletoBancario });

	return response(ctx, 400, { mensagem: 'Erro desconhecido.' });
}

module.exports = {
	createPayment,
};
