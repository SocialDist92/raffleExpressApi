const createError = require('http-errors');
const jwt = require('./jwt');
const TOTAL_NUMBERS = 250;
const misc = {
    correctParams: (queryParamsArray, paramsNeeded) => {
        if (!queryParamsArray.length) return false;
        else {

            return !paramsNeeded.some(function (arrVal) {
                return !queryParamsArray.includes(arrVal)
            })
        }
    },
    missingParamsError: (next) => next(createError(412, {message: 'Missing parameters'})),
    getAvailableNumbers: (usedNumbers) => {
        let availableNumbers = [];
        const totalDigits = TOTAL_NUMBERS.toString().length;
        for (let i = 0; i < TOTAL_NUMBERS; i++) {
            const iString = i.toString();
            const zerosToAdd = totalDigits - iString.length;
            let number = '';
            for (let y = 0; y < zerosToAdd; y++) {
                number += '0';
            }

            number += iString;
            if (!usedNumbers.includes(number)) availableNumbers.push(number);
        }

        return availableNumbers;
    },
    isLoggedIn: function (req, res, next) {
        let token = req.get('authorization');
        if (token) {
            token = token.slice(7);
            const validToken = jwt.verify(token);
            if (validToken) {
                return next();

            } else {
                res.status(401).send({message: 'Unauthorized token'});
            }
        } else res.status(401).send({message: 'Missing token'});


    }

};

module.exports = misc