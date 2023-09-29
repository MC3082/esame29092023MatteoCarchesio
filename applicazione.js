const express = require("express");
const mongoose = require("mongoose");
const Ristorante = require("./models/Ristorante")
var cors = require('cors')

const host = "127.0.0.1";
const port = 4000;

const app = express();
app.use(cors())                     //Enable external access
app.use(express.json())
app.use(express.urlencoded({extended: true}))


mongoose.connect('mongodb+srv://mc30:OLWX6KezYWGuwmlj@cluster0.ldgja9l.mongodb.net/ristorante', {useNewUrlPrse: true}, () => {
    console.log("Sono connesso al Database con successo!");
})

app.listen(port, host, () => {
    console.log(`Sono in ascolto sulla porta ${port}`)
})


app.post("/api/salva", async (req, res) => {
    let stud = {
        nome: req.body.nome,
        indirizzo: req.body.indirizzo,
        tipoCucina: req.body.tipoCucina,
        Mediavoti: req.body.Mediavoti
    }

    try {
        let risultato = await Ristorante.create(stud);
        res.json({
            status: "success",
            data: ""
        })
    } catch (error) {
        res.json({
            status: "error",
            data: error
        })
    }
})
 
app.get("/api/lista", async (req, res) => {
    let elenco = await Ristorante.find({})    
    res.json( elenco );
})