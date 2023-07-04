const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const mutler = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book.controllers');

router.get('/:id', auth, bookCtrl.getOneBook);
router.get('/', auth, bookCtrl.getAllBooks);
router.post('/', auth, mutler, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router; 