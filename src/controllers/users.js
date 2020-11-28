const response = require('./response');
const UsersDB = require('../repositories/usersdb');

async function createUser(ctx) {
	const { email = null, nome = null } = ctx.request.body;

	if (!email || !nome) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const user = await UsersDB.getUserByEmail(email);

	if (user) {
		return response(ctx, 400, {
			mensagem: 'Esse usuário já existe no nosso banco de dados.',
		});
	}

	const newUser = await UsersDB.insertUser(email, ctx.state.hash, nome);

	if (newUser) {
		return response(ctx, 201, { id: newUser.id });
	}

	return response(ctx, 400, { mensagem: 'Erro desconhecido.' });
}

module.exports = { createUser };
