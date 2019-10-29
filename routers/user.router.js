const userController = require('../controllers/user.controller');
const router = require('express').Router();
const {check} = require('express-validator');

router.get('/', userController.getAll);
router.get('/create', userController.create);
router.post('/create', [
    check('name').not().isEmpty().withMessage('The Name is required'),
    check('birthday').not().isEmpty().withMessage('The Birthday is required'),
    check('gender').not().isEmpty().withMessage('The Gender is required'),
    check('address').not().isEmpty().withMessage('The Address is required'),
    // check('urlImage').not().isEmpty().withMessage('The Image is required')
], userController.store);
router.get('/update/:userId', userController.edit);
router.post('/update/:userId', [
    check('name').not().isEmpty().withMessage('The Name is required'),
    check('birthday').not().isEmpty().withMessage('The Birthday is required'),
    check('gender').not().isEmpty().withMessage('The Gender is required'),
    check('address').not().isEmpty().withMessage('The Address is required'),
], userController.update);
router.get('/delete/:userId', userController.delete);
router.get('/detail/:userId', userController.show);
router.get('/csv', userController.getCSV);
router.post('/csv', userController.importCSV);
router.get('/exportCSV', userController.exportCSV);


module.exports = router;