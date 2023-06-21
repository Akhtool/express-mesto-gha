const router = require('express').Router();
const { ERROR_CODE_NOT_FOUND } = require('../utils/constants');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запись не найдена!' });
});

module.exports = router;
