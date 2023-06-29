const cardsRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const { createCardJoi, checkCardIdJoi } = require('../middlewares/celebrate');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', checkCardIdJoi, deleteCard);
cardsRouter.post('/', createCardJoi, createCard);
cardsRouter.put('/:cardId/likes', checkCardIdJoi, addLikeCard);
cardsRouter.delete('/:cardId/likes', checkCardIdJoi, deleteLikeCard);

module.exports = cardsRouter;
