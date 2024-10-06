
const radSaOglasima = require('../moduli/radSaOglasima')

getAllOglasi = (req,res)=>{
    res.send(radSaOglasima.getAllOglasi());
}

getOglasById = (req, res) => {
    const izabranOglas = radSaOglasima.getOglasById(req.params.id);
    res.send(izabranOglas);
}

deleteOglasi = (req, res) => {
    radSaOglasima.deleteOglas(req.params.id);
    res.send(radSaOglasima.getAllOglasi());
}

izmeniOglas = (req, res) => {
    console.log(req.body + 'backend');
    radSaOglasima.izmeniOglas(req.body);
    res.send(radSaOglasima.getAllOglasi());
}

addOglas = (req, res) => {
    radSaOglasima.addOglas(req.body);
    res.send('Oglas je uspesno dodat');
}

filtrirajOglas = (req, res) => {
    console.log(req.query);
    const filtriraniOglasi = radSaOglasima.getOglasBy(req.query.kategorija, req.query.dgd, req.query.ggd, req.query.dgc, req.query.ggc);
    res.send(filtriraniOglasi);
};

module.exports = { getAllOglasi, getOglasById, deleteOglasi, izmeniOglas, addOglas, filtrirajOglas };