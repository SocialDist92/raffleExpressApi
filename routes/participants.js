const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const Raffle = require('../models/Raffle');
const ToPay = require('../models/ToPay')
const createError = require('http-errors');
const {correctParams, missingParamsError} = require('../helpers/misc');


router.get('/get-participants', function (req, res, next) {
    const queryParamsArray = Object.keys(req.query);
    let paramsNeeded = ['raffle'];
    if (!Object.keys(req.query).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);

    Raffle.raffleMongooseModel.findOne({name: req.query.raffle}, 'participants', (err, raffle) => {
        if (err) return next(createError(500));
        if (!raffle) return next(createError(400, {message: "Raffle doesn't exists"}));
        return res.send({success: true, raffle});
    });

});

router.post('/add-to-pay-participant', function (req, res, next) {
    const queryParamsArray = Object.keys(req.body);
    const participantKeys = Object.keys(Participant);
    let paramsNeeded = [...participantKeys];
    paramsNeeded.push('raffle');
    if (!Object.keys(req.body).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next);

    const newParticipantObj = Participant;
    participantKeys.forEach(param => {
        newParticipantObj[param] = req.body[param].toString().toLowerCase();
    });

    ToPay.toPayMongooseModel.findOne({raffle: req.body.raffle, number: req.body.number}, (err, toPay) => {
        if (err) return res.status(500).send(err);
        if (toPay) return next(createError(400, {message: "Number already took"}));
        Raffle.raffleMongooseModel.findOne({name: req.body.raffle}, (err, raffle) => {
            if (err) return next(createError(500));
            if (!raffle) return next(createError(400, {message: "Raffle doesn't exists"}));
            const toPayParticipant = new ToPay.toPayMongooseModel({
                raffle: req.body.raffle,
                number: newParticipantObj.number,
                participant: newParticipantObj
            });
            toPayParticipant.save(function (err, toPay) {
                if (err) return res.status(500).send(err);
                return res.send({success: true, toPay});
            });
        });


    });


});

router.post('/delete-participant', function (req, res, next) {
    const queryParamsArray = Object.keys(req.body);
    let paramsNeeded = ['raffle', 'number'];
    if (!Object.keys(req.body).length || !correctParams(queryParamsArray, paramsNeeded))
        return missingParamsError(next)
    Raffle.raffleMongooseModel.findOne({name: req.body.raffle}, (err, raffle) => {
        if (err) return next(createError(500));
        if (!raffle) return next(createError(400, {message: "Raffle doesn't exists"}));
        raffle.participants = raffle.participants.filter(participant => participant.number !== req.body.number);
        raffle.save(function (err, raffle) {
            if (err) return res.status(500).send(err);
            return res.send({success: true, raffle});

        });
    });
});

module.exports = router;
