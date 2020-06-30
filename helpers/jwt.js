const jwt = require('jsonwebtoken');
const fs = require('fs');
const secret = fs.readFileSync(__dirname + '/../secret.key');
module.exports = {
    sign: (payload) => {
        const options = {
            expiresIn: "15d"
        }
        return jwt.sign(payload, secret, options);
    },
    verify: (token) => {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }
}