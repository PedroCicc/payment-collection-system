const jwt = require('jsonwebtoken');
const response = require('./response');
const UsersDB = require('../repositories/usersdb');
const Password = require('../utils/password');
const users = require('../repositories/usersdb');

require('dotenv').config();

async function authenticate(ctx) {
	const { email = null, password = null } = ctx.request.body;

	if (!email || !password) {
		return response(ctx, 400, { message: 'Pedido mal formatado.' });
	}

	const user = await UsersDB.getUserByEmail(email);

	if (user) {
		const comparison = await Password.check(password, user.password);
		if (comparison) {
			const token = jwt.sign(
				{ id: user.id, email: user.email },
				process.env.JWT_SECRET,
				{
					expiresIn: '30d',
				}
			);
			return response(ctx, 200, {
				message: 'Usuário logado com sucesso!',
				token,
			});
		}
	}
	return response(ctx, 400, { message: 'Email ou senha incorretos.' });
}

module.exports = { authenticate };
