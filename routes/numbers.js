const express = require('express');
const router = express.Router();
const Raffle = require('../models/Raffle');
const ToPay = require('../models/ToPay');
const createError = require('http-errors');
const {getAvailableNumbers} = require('../helpers/misc');

/* GET used numbers. */
router.get('/get-used-numbers', function (req, res, next) {
    let raffleName = req.query.raffleName;
    const internalError = () => next(createError(500));


    if (raffleName) {
        raffleName = raffleName.toString().toLowerCase();
        Raffle.raffleMongooseModel.findOne({name: raffleName}, (err, raffle) => {
            if (err) return internalError();
            if (!raffle) return next(createError(400, {message: "Raffle doesn't exist"}));
            let numbersArray = raffle.participants.map(participant => participant.number);
            ToPay.toPayMongooseModel.find({raffle: raffleName}, (err, toPays) => {
                if (err) return internalError();
                const numbersArrayFromToPays = toPays.filter(toPay => toPay.raffle === raffleName).map(toPay => toPay.number);
                const usedNumbers = [...numbersArray, ...numbersArrayFromToPays];
                return res.send({
                    success: true,
                    usedNumbers,
                    availableNumbers: getAvailableNumbers(usedNumbers)
                });
            });


        });
    } else {
        return next(createError(412, {message: 'Missing raffleName'}))
    }

});

module.exports = router;
