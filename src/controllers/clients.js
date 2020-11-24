const response = require('./response');
const ClientsDB = require('../repositories/clientsdb');

async function createClient(ctx) {
	const {
		name = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const userID = ctx.state.user;

	if (!name || !cpf || !email || !tel) {
		return response(ctx, 400, { message: 'Pedido mal formatado.' });
	}

	const client = await ClientsDB.getClientByEmail(email);

	if (client) {
		return response(ctx, 400, {
			mensagem: 'Esse cliente já existe no nosso banco de dados.',
		});
	}

	const newClient = await ClientsDB.insertClient(
		name,
		cpf,
		email,
		tel,
		userID
	);

	if (newClient) {
		return response(ctx, 201, { id: newClient.id });
	}

	return response(ctx, 400, { message: 'Erro desconhecido.' });
}

async function editClient(ctx) {
	const {
		name = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;
}

module.exports = { createClient };
