const Router = require('koa-router');

const router = new Router();

const Auth = require('./controllers/auth');
const Users = require('./controllers/users');
const Clients = require('./controllers/clients');

router.post('/auth', Auth.authenticate());
router.post('/usuarios', Users.createUser());
router.post('/clientes', Clients.createClient());
router.put('/clientes', Clients.editClient());

router.get('/cobrancas', Payments.createPayment());

module.exports = router;
