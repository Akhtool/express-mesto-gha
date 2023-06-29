const router = require('express').Router();
const { errors } = require('celebrate');
const NotFoundError = require('../errors/notFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { login, createUser } = require('../controllers/users');
const { createUserJoi, loginJoi } = require('../middlewares/celebrate');
const authMiddleware = require('../middlewares/auth');

router.post('/signin', loginJoi, login);
router.post('/signup', createUserJoi, createUser);

router.use(authMiddleware);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('Запись не найдена.')));
router.use(errors({ message: 'Ошибка валидации данных!' }));

module.exports = router;
