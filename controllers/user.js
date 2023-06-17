const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(201).send(users)) // console.log(users) )
    .catch(err => res.status(500).send({ message: err.message })); // console.log(err) )
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.status(201).send(user)) // console.log(user) )
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' })); // console.log(err) )
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user)) // console.log(user) )
    .catch(err => res.status(500).send({ message: err.message })); // console.log(err) )
};