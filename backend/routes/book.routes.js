const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mutler = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config');
const bookCtrl = require('../controllers/book.controllers');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBook)
router.get('/:id', bookCtrl.getOneBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.post('/', auth, mutler, sharp, bookCtrl.createBook);
router.put('/:id', auth, mutler, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router; 