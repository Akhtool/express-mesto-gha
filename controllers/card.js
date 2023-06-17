const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(201).send(cards))//console.log(users) )
    .catch(err => res.status(500).send({ message: err.message }));//console.log(err) )
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.status(201).send(card))//console.log(user) )
    .catch(err => res.status(500).send({ message: err.message }));//console.log(err) )
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send(card))//console.log(user) )
    .catch(err => res.status(500).send({ message: err.message }));//console.log(err) )
};