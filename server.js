const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ristorante', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Errore di connessione a MongoDB:'));
db.once('open', () => {
  console.log('Connessione a MongoDB riuscita!');
});

// Modelli
const Restaurant = mongoose.model('Restaurant', {
  nome: { type: String, required: true },
  indirizzo: { type: String, required: true },
  tipoCucina: { type: String, required: true },
  mediaVoti: { type: Number, default: 0 },
});

const Review = mongoose.model('Review', {
  ristoranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  autore: { type: String, required: true },
  testo: { type: String, required: true, maxlength: 500 },
  voto: { type: Number, required: true, min: 1, max: 5 },
});

// Endpoint
app.get('/ristoranti', async (req, res) => {
  try {
    const ristoranti = await Restaurant.find();
    res.json(ristoranti);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recuperare i ristoranti.' });
  }
});

app.get('/ristoranti/:id', async (req, res) => {
  try {
    const ristorante = await Restaurant.findById(req.params.id);
    const recensioni = await Review.find({ ristoranteId: req.params.id });
    res.json({ ristorante, recensioni });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recuperare il ristorante.' });
  }
});

app.post('/ristoranti', async (req, res) => {
  try {
    const nuovoRistorante = await Restaurant.create(req.body);
    res.json(nuovoRistorante);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiungere il ristorante.' });
  }
});

app.post('/recensioni', async (req, res) => {
  try {
    const nuovaRecensione = await Review.create(req.body);
    // Aggiorna la media voti del ristorante
    const recensioniRistorante = await Review.find({ ristoranteId: req.body.ristoranteId });
    const mediaVoti = recensioniRistorante.reduce((acc, recensione) => acc + recensione.voto, 0) / recensioniRistorante.length;
    await Restaurant.findByIdAndUpdate(req.body.ristoranteId, { mediaVoti });
    res.json(nuovaRecensione);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiungere la recensione.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
