const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    ristoranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ristorante', required: true },
    autore: { type: String, required: true },
    testo: { type: String, required: true, maxlength: 500 },
    voto: { type: Number, required: true, min: 1, max: 5 }
});

module.exports = mongoose.model('Recensione', reviewSchema);
