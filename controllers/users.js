const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

const findUser = (id, res, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return next(err);
    });
};

const changeUserData = (id, newData, res, next) => {
  User.findByIdAndUpdate(id, newData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь по указанному id не найден.'));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))

    .catch(next);
};

module.exports.getUserById = (req, res, next) => findUser(req.params.userId, res, next);

module.exports.getCurrentUser = (req, res, next) => findUser(req.user._id, res, next);

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 16)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          const noPasswordUser = user.toObject({ useProjection: true });

          return res.status(201).send(noPasswordUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new RequestError('Переданы некорректные данные при создании пользователя.'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с указанным e-mail уже зарегистрирован.'));
          }
          return next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неправильные почта или пароль.'));
          }

          const token = jwt.sign(
            { _id: user._id },
            'yeuiqdghd87e7eicdghyuct678ewrtjdbZJZTY',
            { expiresIn: '7d' },
          );

          return res.send({ token });
        });
    })

    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  return changeUserData(req.user._id, { name, about }, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return changeUserData(req.user._id, { avatar }, res, next);
};
