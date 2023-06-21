const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_INVALID_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  dafaultErrorMessage,
} = require('../utils/constants');

// const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');
// const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Передан некорректный id пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

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

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: dafaultErrorMessage });
    });
};
