const jwt = require('jsonwebtoken');
const response = require('../controllers/response');

require('dotenv').config();

async function verify(ctx, next) {
	try {
		const [bearer, token] = ctx.headers.authorization.split(' ');
		console.log(process.env.JWT_SECRET);
		const verification = await jwt.verify(token, process.env.JWT_SECRET);
		console.log(verification);
		ctx.state.id = verification.id;
		ctx.state.email = verification.email;
		console.log(`session: ${ctx.state.id}`);
	} catch (err) {
		return response(ctx, 403, 'Ação proibida');
	}

	return next();
}

module.exports = { verify };
