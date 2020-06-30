const mongoose = require('mongoose');

const Raffle = {
    name: String,
    participants: Array
};

const raffleSchema = new mongoose.Schema(Raffle);
const RaffleModel = mongoose.model('Raffle', raffleSchema);

exports.raffle = Raffle;
exports.raffleMongooseModel = RaffleModel;

