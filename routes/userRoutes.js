const express = require('express');
const controller = require('../controllers/userActions');

const router = express.Router();
//Return create account page
router.get('/newUser', controller.account);
router.post('/', controller.create);
//return profile and verify login
router.get('/login', controller.verify);
router.post('/login', controller.login);
router.get('/home', controller.profile);

router.get('/logout', controller.logout)
router.get('/user',controller.profile)

module.exports = router;

