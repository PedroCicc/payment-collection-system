const axios = require('axios').default;
const response = require('../controllers/response');

require('dotenv').config();

async function gerarBoleto(nome, cpf, descricao, valor, vencimento) {
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
		return {
			boleto: transaction.data,
			erro: null
		};
	} catch (err) {
		return {
			boleto: null,
			erro: err.response.data.errors
		};
	}
}

module.exports = { gerarBoleto };
