const express = require('express');
const router = express.Router();
const Raffle = require('../models/Raffle');
const createError = require('http-errors');
const {isLoggedIn} = require('../helpers/misc');

router.post('/add-raffle', isLoggedIn, function (req, res, next) {
    let name = req.query.name;

    if (name) {
        name = name.toString().toLowerCase();
        Raffle.raffleMongooseModel.findOne({name}, (err, raffle) => {
            if (err) return next(createError(500));
            if (raffle) return next(createError(400, {message: 'Raffle already exists'}));
            const newRaffle = new Raffle.raffleMongooseModel({name, participants: []});
            newRaffle.save(function (err, raffle) {
                if (err) return res.status(500).send(err);
                return res.send({success: true, raffle});
            });
        });
    } else {
        return next(createError(412, {message: 'Missing name'}))
    }


});

module.exports = router;
