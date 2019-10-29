const User = require('../db/model/User.model');
const flash = require('req-flash');
const {Parser} = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const {check, validationResult} = require('express-validator');
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        {id: 'name', title: 'Name'},
        {id: 'birthday', title: 'Birth Day'},
        {id: 'address', title: 'Address'},
        {id: 'gender', title: 'Gender'},
        {id: 'urlImage', title: 'Image'},
    ]
});


module.exports = {
    getAll: function (req, res) {
        User.find({}).limit(6)
            .then(users => {
                res.render('index', {users: users})
            })
            .catch(err => {
                console.log('Error: ', err);
                throw err;
            })
    },
    create: function (req, res) {
        res.render('create', {errors: []});
    },
    store: function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('create', {errors: errors.array()});
        }
        if (req.files) {
            let file = req.files.file;
            let filename = file.name.split('.')[0] + Date.now() + '.' + file.name.split('.')[1];
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
                            res.redirect('/users');
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
            try {
                fs.unlinkSync(`./public/images/${user.urlImage}`);
            } catch (e) {
                console.log(e);
            }
            res.redirect('/users');
        })
    },
    edit: function (req, res) {
        let userId = req.params.userId;
        User.findById(userId, function (err, user) {
            if (err) throw err;
            res.render('edit', {user: user, errors: []});
        });
    },
    update: function (req, res) {
        if (req.files.size != 'undefined') {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('create', {errors: errors.array()});
            }
            let file = req.files.file;
            let filename = file.name.split('.')[0] + Date.now() + '.' + file.name.split('.')[1];
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
    },
    getCSV: function (req, res) {
        res.render('csv');
    },
    importCSV: function (req, res) {
        fs.createReadStream(req.files.file.tempFilePath)
            .pipe(csv())
            .on('data', function (data) {
                try {
                    let users = [data];
                    console.log(users);
                    // for (let index in data) {
                    //     console.log(data['name']);
                    //     let newUser = new User({
                    //         name: data['name'],
                    //         birthday: data['birthday'],
                    //         address: data['address'],
                    //         gender: data['gender'],
                    //         urlImage: data['urlImage']
                    //     });
                    //     newUser.save()
                    //         .then(doc => {
                    //             res.redirect('/users');
                    //         })
                    //         .catch(err => {
                    //             console.log('Error: ', err);
                    //             throw err;
                    //         })
                    // }
                } catch (err) {
                    console.log('Error: ', err);
                    throw err;
                }
            });
    },
    exportCSV: function (req, res) {
        User.find({})
            .then(users => {
                var fields = ['_id', 'name', 'birthday', 'address', 'gender', 'urlImage'];
                const json2csvParser = new Parser({fields});
                const csv = json2csvParser.parse(users);
                res.attachment('filename.csv');
                res.status(200).send(csv);
                res.redirect('/users');
            })
            .catch(err => {
                console.log('Error: ', err);
                throw err;
            })
    }
};