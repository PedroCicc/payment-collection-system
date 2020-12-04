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

	const pagarmeResponse = await Pagarme.gerarBoleto(
		cliente.name,
		cliente.cpf,
		descricao,
		valor,
		vencimento
	);

	if (pagarmeResponse.erro) {
		console.log(pagarmeResponse.erro);
		return response(ctx, 400, {
			mensagem: 'Não foi possível gerar o boleto na Pagar.me.',
		});
	}
	
	const newPayment = await PaymentsDB.insertPayment(idDoCliente, descricao, valor, vencimento, pagarmeResponse.boleto.boleto_url, pagarmeResponse.boleto.boleto_barcode, pagarmeResponse.boleto.status);

	if (newPayment) {
		return response(ctx, 201, {
			cobranca: {
				idDoCliente,
				descricao,
				valor,
				vencimento,
				linkDoBoleto: pagarmeResponse.boleto.boleto_url,
				status: 'AGUARDANDO'
			},
		});
	}

	return response(ctx, 400, { mensagem: 'Erro desconhecido.' });
}

async function getPayments(ctx) {
	const userId = ctx.state.id;
	const { cobrancasPorPagina = 10, offset = 0 } = ctx.query;

	const payments = await PaymentsDB.getPayments(userId, cobrancasPorPagina, offset);
	const contagem = await PaymentsDB.countPaymentsByPage(userId);

	const totalDePaginas = Math.ceil(contagem.contagem_de_cobrancas / cobrancasPorPagina);
	const paginaAtual = (offset / cobrancasPorPagina) + 1;

	let currentDate = new Date();

	for (let i = 0; i < payments.length; i++) {
		if (payments[i].payment_date !== null) {
			if (payments[i].payment_date < payments[i].due_date) {
				payments[i].status = 'PAGO';
			} else if (payments[i].payment_date > payments[i].due_date) {
				payments[i].status = 'VENCIDO';
			}
		} else {
			if (currentDate > payments[i].due_date) {
				payments[i].status = 'VENCIDO';
			} else {
				payments[i].status = 'AGUARDANDO';
			}
		}
	}

	return response(ctx, 200, { 
		dados: {
			paginaAtual,
			totalDePaginas,
			cobrancas: [payments]
		}
	});
}

async function payPayment(ctx) {
	const userId = ctx.state.id;
	const { idDaCobranca = null } = ctx.request.body;

	if (!idDaCobranca) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	let currentDate = new Date();

	const payment = await PaymentsDB.setPaymentAsPaid(idDaCobranca, currentDate);

	if (!payment) {
		return response(ctx, 400, { mensagem: 'A cobrança não existe.' });
	}

	return response(ctx, 200, { mensagem: 'Cobrança paga com sucesso' });
}

module.exports = {
	createPayment,
	payPayment,
	getPayments
};
