const response = require('./response');
const ClientsDB = require('../repositories/clientsdb');
const { off } = require('../utils/database');

async function createClient(ctx) {
	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const userId = ctx.state.id;

	if (!nome || !cpf || !email || !tel) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const client = await ClientsDB.getClientByEmail(userId, email);

	if (client) {
		return response(ctx, 400, {
			mensagem: 'Esse cliente já existe no nosso banco de dados.',
		});
	}

	const newClient = await ClientsDB.insertClient(
		nome,
		cpf,
		email,
		tel,
		userId
	);

	if (newClient) {
		return response(ctx, 201, { id: newClient.id });
	}

	return response(ctx, 400, { mensagem: 'Erro desconhecido.' });
}

async function editClient(ctx) {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
	} = ctx.request.body;

	if (!id || !nome || !cpf || !email) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const result = await ClientsDB.editClient(id, nome, cpf, email);

	if (result) {
		return response(ctx, 200, {
			data: {
				id: result.id,
				nome: result.nome,
				cpf: result.cpf,
				email: result.email,
			},
		});
	}

	return response(ctx, 400, {
		mensagem: 'Nenhum cliente encontrado com esse id.',
	});
}

async function getClients(ctx) {
	const userId = ctx.state.id;
	const { busca = null, clientesPorPagina = 10, offset = 0 } = ctx.query;

	// console.log(userId);
	if (!userId) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	if (busca) {
		const result = await ClientsDB.searchClients(
			userId,
			busca,
			clientesPorPagina,
			offset
		);

		if (result) {
			return response(ctx, 200, result);
		}

		return response(ctx, 400, {
			mensagem: 'Nenhum usuário encontrado com esse id.',
		});
		// eslint-disable-next-line no-else-return
	} else {
		const result = await ClientsDB.getClients(
			userId,
			clientesPorPagina,
			offset
		);

		if (result) {
			return response(ctx, 200, result);
		}

		return response(ctx, 400, {
			mensagem: 'Nenhum usuário encontrado com esse id.',
		});
	}
}

module.exports = {
	createClient,
	editClient,
	getClients,
};
