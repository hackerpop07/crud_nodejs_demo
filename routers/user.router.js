const userController = require('../controllers/user.controller');
const router = require('express').Router();


router.get('/', userController.getAll);
router.get('/create', userController.create);
router.get('/update/:userId', userController.edit);
router.post('/update/:userId', userController.update);
router.post('/create', userController.store);
router.get('/delete/:userId', userController.delete);


module.exports = router;