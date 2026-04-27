const express = require('express');
const controller = require('../controllers/documentActions');
const {upload } = require('../middlewares/fileUpload');
const {isLoggedIn,isAuthor, validateId} = require('../middlewares/authenticate');

const router = express.Router();
router.get('/', controller.main);
router.get('/upload', isLoggedIn, controller.new);
router.get('/request', isLoggedIn, controller.request);
router.get('/:id', isLoggedIn, isAuthor, validateId, controller.show);
router.post('/:id/accept', isLoggedIn, validateId, controller.accept);
router.post('/:id/reject', isLoggedIn, validateId, controller.reject);
router.post('/:id/send', controller.send);
router.delete('/:id', isLoggedIn, isAuthor, validateId, controller.delete);
router.post('/', isLoggedIn, upload.single('myFile'), controller.create);


module.exports = router;

