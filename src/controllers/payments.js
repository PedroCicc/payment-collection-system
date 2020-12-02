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
	// console.log(boletoBancario);
	if (!boletoBancario) {
		return response(ctx, 400, {
			mensagem: 'Não foi possível gerar o boleto.',
		});
		// Exibir erro da pagarme
	}
	
	const newPayment = await PaymentsDB.insertPayment(idDoCliente, descricao, valor, vencimento, boletoBancario.boleto_url, boletoBancario.boleto_barcode, boletoBancario.status);
	// console.log(newPayment);

	if (newPayment) {
		return response(ctx, 201, {
			cobranca: {
				idDoCliente,
				descricao,
				valor,
				vencimento,
				linkDoBoleto: boletoBancario.boleto_url,
				status: 'AGUARDANDO'
			},
		});
	}
	// return response(ctx, 200, { mensagem: 'Sucesso.', boletoBancario });

	return response(ctx, 400, { mensagem: 'Erro desconhecido.' });
}

async function payPayment(ctx) {
	const { idDaCobranca = null } = ctx.request.body;
	console.log(idDaCobranca);
	if (!idDaCobranca) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const payment = await PaymentsDB.getPaymentById(idDaCobranca);
	console.log(`Payment: ${payment}`);
	if (!payment) {
		return response(ctx, 400, { mensagem: 'A cobrança não existe.' });
	}

	// Payment tá dando undefined, pq?
	// Como pegar boleto exato que eu quero pagar se não tá indo pelo id dele? Pego id do usuario?
}

module.exports = {
	createPayment,
	payPayment
};
