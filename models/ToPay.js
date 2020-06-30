const mongoose = require('mongoose');
const Participant = require('./Participant')
const ToPay = {
    number: String,
    raffle: String,
    participant: Participant
}

const toPaySchema = new mongoose.Schema(ToPay);
const ToPayModel = mongoose.model('ToPay', toPaySchema);

exports.toPay = ToPay;
exports.toPayMongooseModel = ToPayModel;