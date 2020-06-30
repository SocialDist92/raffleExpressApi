const express = require('express');
const router = express.Router();
const Raffle = require('../models/Raffle');
const ToPay = require('../models/ToPay');
const Participant = require('../models/Participant');
const createError = require('http-errors');
const {correctParams, missingParamsError, isLoggedIn} = require('../helpers/misc');


router.get('/get-to-pays', isLoggedIn, function (req, res, next) {
    const queryParamsArray = Object.keys(req.query);
    let paramsNeeded = ['raffle'];
    if (!Object.keys(req.query).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);


    ToPay.toPayMongooseModel.find({raffle: req.query.raffle}, 'participant', (err, toPays) => {
        if (err) return res.status(500).send(err);
        return res.send({success: true, toPays});
    });

});

router.post('/add-to-pay-participant-to-raffle', isLoggedIn, function (req, res, next) {
    const queryParamsArray = Object.keys(req.body);
    let paramsNeeded = ['id'];
    if (!Object.keys(req.body).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);
    ToPay.toPayMongooseModel.findOne({_id: req.body.id}, 'raffle participant', (err, toPay) => {
        if (err) return res.status(500).send(err);
        if (!toPay) return next(createError(400, {message: "To pay doesn't exists"}));
        const participant = {};
        for (let attr in Participant) {
            participant[attr] = toPay.participant[attr];
        }

        const raffleName = toPay.raffle;
        Raffle.raffleMongooseModel.findOne({name: raffleName}, (err, raffle) => {
            if (err) return next(createError(500));
            if (!raffle) return next(createError(400, {message: "Raffle doesn't exists"}));
            raffle.participants.push(participant);
            raffle.save(function (err, raffle) {
                if (err) return res.status(500).send(err);
                ToPay.toPayMongooseModel.deleteOne({_id: req.body.id}, err => {
                    if (err) return res.status(500).send(err);
                    return res.send({success: true, raffle});
                });

            });
        });

    });

});

router.post('/delete-to-pay', isLoggedIn, function (req, res, next) {
    const queryParamsArray = Object.keys(req.body);
    let paramsNeeded = ['id'];
    if (!Object.keys(req.body).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);
    ToPay.toPayMongooseModel.findByIdAndDelete(req.body.id, (err, toPay) => {
        if (err) return res.status(500).send(err);
        return res.send({success: true, toPay});

    });

});


module.exports = router;
