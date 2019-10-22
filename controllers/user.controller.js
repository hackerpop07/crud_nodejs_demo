const User = require('../db/model/User.model');
// var multer = require('multer');
// var upload = multer().single('file');



module.exports = {
    getAll: function (req, res) {
        User.find({})
            .then(users => {
                res.render('index', {users: users})
            })
            .catch(err => {
                console.log('Error: ', err);
                throw err;
            })
    },
    create: function (req, res) {
        res.render('create');
    },
    store: function (req, res) {
        let newUser = new User({
            name: req.body.name,
            birthday: req.body.birthday,
            address: req.body.address,
            gender: req.body.gender,
        });
        newUser.save()
            .then(doc => {
                res.redirect('/users')
            })
            .catch(err => {
                console.log('Error: ', err);
                throw err;
            })
    },
    delete: function (req, res) {
        let userId = req.params.userId;
        User.findByIdAndDelete(userId, (err, user) => {
            if (err) throw err;
            res.redirect('/users');
        })
    },
    edit: function (req, res) {
        let userId = req.params.userId;
        User.findById(userId, function (err, user) {
            if (err) throw err;
            res.render('edit', {user: user});
        });
    },
    update: function (req, res) {
        let userId = req.params.userId;
        User.findByIdAndUpdate(
            {_id: userId},
            {
                $set: {
                    name: req.body.name,
                    birthday: req.body.birthday,
                    address: req.body.address,
                    gender: req.body.gender,
                }
            },
            {useFindAndModify: false})
            .then(doc => {
                res.redirect('/users')
            })
    }
    // show: function (req, res) {
    //
    // }
};