const response = require('./response');
const UsersDB = require('../repositories/usersdb');

async function createUser(ctx) {
	const { email = null } = ctx.request.body;
	console.log(email);
	if (!email) {
		return response(ctx, 400, { message: 'Pedido mal formatado.' });
	}

	const user = await UsersDB.getUserByEmail(email);

	if (user) {
		return response(ctx, 400, {
			message: 'Esse usuário já existe no nosso banco de dados.',
		});
	}

	const newUser = await UsersDB.insertUser(email, ctx.state.hash);

	if (newUser) {
		return response(ctx, 201, { id: newUser.id });
	}

	return response(ctx, 400, { message: 'Erro desconhecido.' });
}

module.exports = { createUser };
