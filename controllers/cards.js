const Card = require('../models/card');

const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId !== currentUserId) {
        throw new ForbiddenError('Вы не автор этой карточки.');
      }
      return card;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки.'));
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))

    .catch(next);
};

module.exports.addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err.name === 'CastError') {
        return next(new RequestError('Передан некорректный id карточки.'));
      }
      return next(err);
    });
};
