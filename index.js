const express = require('express');
const axios = require('axios');

const app = express();
exports.app = app;
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));


app.get('/',async(req,res)=>{
    await axios.get(`http://localhost:5005/svi-oglasi`)
    .then(result=>{
        oglasi = result.data;
        res.render('index',{data:result.data});
        //console.log(oglasi);
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
    
})

app.get('/oglas/new',(req,res)=>{
    res.render('novOglas');
})

app.get('/oglas/edit/:id',async (req,res)=>{
    await axios.get(`http://localhost:5005/oglas/${req.params.id}`)
    
    .then(result=>{
        
        console.log(result.data);
        res.render('izmeniOglas', { data: result.data});
        
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
    
    
})

app.post('/oglas/new', async (req,res)=>{
    const body = req.body;

    const tagovi = req.body.tagovi || [];
    // one mail will se send as string, more then one as array.
    // We are making sure we have array because working with string in for loop will cause bug
    body.mails = Array.isArray(body.mails) ? body.mails : [body.mails]; 

    const Cena = new Object();
    Cena.vrednost = body.vrednost;
    Cena.valuta = body.valuta;


    const mails = [];
    for(let i = 0; i < body.mails.length; i++){
        console.log(body);
        
        const Mail = new Object();
        Mail.mail = body.mails[i];
        Mail.tip = body.type[i];
        mails.push(Mail);
    }
    
    const novOglas = {
        kategorija: body.kategorija,
        cena: Cena,
        opis: body.opis,
        datum: body.datum,
        tagovi: tagovi,
        mails: mails
    }

    
    await axios.post(`http://localhost:5005/oglas/new`, novOglas)
    .then(result=>{
        res.redirect('/')
    })
    .catch(err =>{
        res.send(`Doslo je do greske: ` + err);
    })
})

app.get('/oglas/delete/:id',async (req,res)=>{
    await axios.delete(`http://localhost:5005/oglas/delete/${req.params.id}`)
    .then(result=>{
        res.render('index',{data:result.data});
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
})

app.post('/oglas/edit',async (req,res)=>{
    const body = req.body;

    const tagovi = body.tagovi || [];

    if (typeof (tagovi) == String) {
        tagovi = [tagovi];
    }
    body.mails = body.mails || [];

    const Cena = new Object();
    Cena.vrednost = body.vrednost;
    Cena.valuta = body.valuta;

    const mails = [];
    for (let i = 0; i < body.mails.length; i++) {
        const Mail = new Object();
        Mail.mail = body.mails[i];
        Mail.tip = body.type[i];
        mails.push(Mail);
    }
    
    const novOglas = {
        id: body.id,
        kategorija: body.kategorija,
        cena: Cena,
        opis: body.opis,
        datum: body.datum,
        tagovi: tagovi,
        mails: mails
    }

    console.log(novOglas);


    await axios.put(`http://localhost:5005/oglas/edit/${req.body.id}`, novOglas)


    .then(result=>{
        res.redirect('/');
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
    
})

app.get('/filtriraj',async (req,res)=>{
    await axios.get(`http://localhost:5005/filtriraj?kategorija=${req.query.kategorija}&dgd=${req.query.donjaGranicaDatum}&ggd=${req.query.gornjaGranicaDatum}&dgc=${req.query.donjaGranicaCene}&ggc=${req.query.gornjaGranicaCene}`)
    .then(result=>{
        res.render('index',{data:result.data});
    })
    .catch(err=>{
        console.log('Doslo je do greske:' +err);
    })
    
})

app.listen(5000,()=>{
    console.log('Klijent je aktivan na portu 5000');
})