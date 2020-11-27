const Router = require('koa-router');

const router = new Router();
const Encrypt = require('./middlewares/encrypt');
const Session = require('./middlewares/session');

const Auth = require('./controllers/auth');
const Users = require('./controllers/users');
const Clients = require('./controllers/clients');
const Payments = require('./controllers/payments');

router.post('/auth', Auth.authenticate);
router.post('/usuarios', Encrypt.encrypt, Users.createUser);
router.post('/clientes', Session.verify, Clients.createClient);
// router.put('/clientes', Clients.editClient);
router.post('/cobrancas', Session.verify, Payments.createPayment);

module.exports = router;
