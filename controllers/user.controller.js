const User = require('../db/model/User.model');
const fs = require('fs');
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
        if (req.files) {
            console.log();
            let file = req.files.file;
            let filename = file.name.split('.')[0] + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                + '.' + file.name.split('.')[1];
            file.mv("./public/images/" + filename, function (err) {
                if (!err) {
                    let newUser = new User({
                        name: req.body.name,
                        birthday: req.body.birthday,
                        address: req.body.address,
                        gender: req.body.gender,
                        urlImage: filename
                    });
                    newUser.save()
                        .then(doc => {
                            res.redirect('/users')
                        })
                        .catch(err => {
                            console.log('Error: ', err);
                            throw err;
                        })
                } else {

                }
            })
        }
    },
    delete: function (req, res) {
        let userId = req.params.userId;
        User.findByIdAndDelete(userId, (err, user) => {
            if (err) throw err;
            fs.unlinkSync(`./public/images/${user.urlImage}`);
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
        if (req.files) {
            let file = req.files.file;
            let filename = file.name.split('.')[0] + new Date() + '.' + file.name.split('.')[1];
            file.mv("./public/images/" + filename, function (err) {
                if (!err) {
                    let userId = req.params.userId;
                    let user = User.findById(userId, function (err, user) {
                        if (err) throw err;
                        fs.unlink(`./public/images/${user.urlImage}`, () => {
                            console.log('delete image done !!!')
                        });
                        user.set({
                            name: req.body.name,
                            birthday: req.body.birthday,
                            address: req.body.address,
                            gender: req.body.gender,
                            urlImage: filename
                        });
                        user.save().then(doc => {
                            res.redirect('/users')
                        })
                            .catch(err => {
                                console.log('Error: ', err);
                                throw err;
                            });
                    });
                } else {

                }
            })
        }


    },
    show: function (req, res) {
        let userId = req.params.userId;
        User.findById(userId, function (err, user) {
            if (err) throw err;
            res.render('detail', {user: user});
        });
    }
};