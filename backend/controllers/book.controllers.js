const Book = require('../models/book')

exports.createBook = (req, res, next) => { //créer un livre
    delete req.body._id;
    const book = new Book({
      ...req.body
    });
    book.save() 
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifyBook = (req, res, next) => {  //mofifier un livre
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteBook = (req, res, next) => { //supprimer un livre
    Book.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json ({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
  };

  exports.getOneBook =(req, res, next) => { //trouver un livre
    Book.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  };

  exports.getAllBooks = (req, res, next) => { //trouver tous les livres
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json(error));
  };