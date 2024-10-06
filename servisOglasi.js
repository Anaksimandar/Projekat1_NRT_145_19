const express = require('express');
const app = express();
const { getAllOglasi, getOglasById, deleteOglasi, izmeniOglas, addOglas, filtrirajOglas } = require("./controllers/oglas.controller");

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Pocetna servis');
})

app.get('/svi-oglasi', getAllOglasi);

app.get('/oglas/:id', getOglasById);

app.delete('/oglas/delete/:id', deleteOglasi);

app.put('/oglas/edit/:id', izmeniOglas);

app.post('/oglas/new', addOglas);

app.get('/filtriraj', filtrirajOglas);


app.listen(5005,()=>{
    console.log("Servis je aktivan na portu 5005");
})