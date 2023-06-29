const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('Запись не найдена.')));

module.exports = router;
