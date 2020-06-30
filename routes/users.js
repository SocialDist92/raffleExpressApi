const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {correctParams, missingParamsError} = require('../helpers/misc');
let createError = require('http-errors');
const jwt = require('../helpers/jwt');
const Bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const UserModel = mongoose.model('User', User);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {

    const queryParamsArray = Object.keys(req.body);
    let paramsNeeded = ['user', 'password'];
    if (!Object.keys(req.body).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);
    UserModel.findOne({user: req.body.user}, (err, user) => {

        if (err) return next(createError(500));
        if (!user) return next(createError(401, {message: "User doesn't exists"}));
        /*Authenticate user*/
        Bcrypt.compare(req.body.password, user.password).then(result => {
            if (result) {
                const payload = {
                    user: user.user,
                    id: user._id
                };

                res.send({token: jwt.sign(payload)});
            }


            else res.status(401).send({message: 'Wrong pass or user'});

        });

    });

});


module.exports = router;
