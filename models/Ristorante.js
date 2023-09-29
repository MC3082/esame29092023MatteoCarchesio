const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    indirizzo: { type: String, required: true },
    tipoCucina: String,
    mediaVoti: { type: Number, default: 0 }
});

module.exports = mongoose.model('Ristorante', restaurantSchema);
