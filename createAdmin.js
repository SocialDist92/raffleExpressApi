'use strict';
const Bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const User = require('./models/user');
const PASS = 'rifas_cotorras';

mongoose.connect('mongodb+srv://armando:armando@cluster0-1qgup.mongodb.net/raffle?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const UserModel = mongoose.model('User', User);
const admin = new UserModel({user: 'admin', admin: true, password: Bcrypt.hashSync(PASS, 10)});

const finishProcess = function (message) {
    console.log(message);
    process.exit();
};

UserModel.findOneAndUpdate({user: 'admin'}, {password: Bcrypt.hashSync(PASS, 10)}, (err, doc) => {
    if (err) finishProcess(err);
    if (doc) {
        finishProcess('Reset admin password to "' + PASS + '"');
    } else {
        admin.save(function (err, document) {
            if (err)
                finishProcess(err);
            else
                finishProcess('Created admin - password = "' + PASS + '"');
        });
    }
});




