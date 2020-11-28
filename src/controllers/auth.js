const jwt = require('jsonwebtoken');
const response = require('./response');
const UsersDB = require('../repositories/usersdb');
const Password = require('../utils/password');

require('dotenv').config();

async function authenticate(ctx) {
	const { email = null, senha = null } = ctx.request.body;

	if (!email || !senha) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado.' });
	}

	const user = await UsersDB.getUserByEmail(email);

	if (user) {
		const comparison = await Password.check(senha, user.password);
		if (comparison) {
			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET,
				{
					expiresIn: '30d',
				}
			);
			return response(ctx, 200, {
				mensagem: 'Usuário logado com sucesso!',
				token,
			});
		}
	}
	return response(ctx, 400, { message: 'Email ou senha incorretos.' });
}

module.exports = { authenticate };
