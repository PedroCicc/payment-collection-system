const axios = require('axios').default;
const response = require('../controllers/response');

require('dotenv').config();

async function gerarBoleto(nome, cpf, descricao, valor, vencimento) {
	console.log(cpf);
	const objeto = {
		amount: valor,
		api_key: process.env.PAGARME_KEY,
		payment_method: 'boleto',
		boleto_instructions: descricao,
		boleto_expiration_date: vencimento,
		customer: {
			type: 'individual',
			country: 'br',
			name: nome,
			documents: [
				{
					type: 'cpf',
					number: cpf,
				},
			],
		},
	};
	try {
		const transaction = await axios.post(
			'https://api.pagar.me/1/transactions',
			objeto
		);
		return transaction.data;
	} catch (err) {
		console.log(err.response.data.errors);
	}
	return response(ctx, 400, { mensagem: 'Não foi possível gerar o boleto.' });
}

module.exports = { gerarBoleto };
