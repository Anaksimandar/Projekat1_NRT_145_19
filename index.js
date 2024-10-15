const express = require('express');
const axios = require('axios');
const validateData = require('./helper-functions/validation/validation');
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));


app.get('/',async(req,res)=>{
    await axios.get(`http://localhost:5005/svi-oglasi`)
    .then(result=>{
        oglasi = result.data;
        
        res.render('index', { data: result.data});
        //console.log(oglasi);
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
    
})

app.get('/oglas/new',(req,res)=>{    
    res.render('novOglas',{errors:[],formData:{}});
})

app.get('/oglas/edit/:id',async (req,res)=>{
    await axios.get(`http://localhost:5005/oglas/${req.params.id}`)
    
    .then(result=>{
        console.log(result.data , "get oglas by id");
        res.render('izmeniOglas', { data: result.data});
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
    
    
})

function formatingArrayInputs(input){
    if (!input) {
        // If body.tags is undefined or an empty string, initialize it as an empty array
        return input = [];
    } else if (!Array.isArray(input)) {
        // If body.tags is not an array (i.e., it's a string), convert it to an array
        return input = [input];
    }
    return input;
}

app.post('/oglas/new', async (req,res)=>{
    const body = req.body;

    let tagovi = formatingArrayInputs(body.tags);
    body.mails = formatingArrayInputs(body.mails);

    console.log(body , 'form data');
    const errors = validateData(body);
    console.log(errors);
    
    if (Object.keys(errors).length){
        return res.render("novOglas",{
            errors:errors,
            formData:body
        });
    }


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

    const opis = body.opis.trim();
    
    const novOglas = {
        kategorija: body.kategorija,
        cena: Cena,
        opis: opis,
        datum: body.datum,
        tags: tagovi,
        mails: mails
    }
    
    await axios.post(`http://localhost:5005/oglas/new`, novOglas)
    .then(result=>{
        console.log(result); // notification
        res.redirect('/');
    })
    .catch(err =>{
        res.send(`Doslo je do greske: ` + err);
    })
})

app.get('/oglas/delete/:id', async (req,res)=>{
    await axios.delete(`http://localhost:5005/oglas/delete/${req.params.id}`)
    .then(result=>{
        res.render('index',{data:result.data});
    })
    .catch(err=>{
        res.send('Doslo je do greske' + err);
    })
})

app.post('/oglas/edit', async (req,res)=>{
    const formData = req.body;
    
    console.log(formData, "oglas sa frontentda");
    
    tags = formData.tags;
    const Cena = new Object();
    Cena.vrednost = formData.vrednost;
    Cena.valuta = formData.valuta;
    console.log(formData, 'klijent');

    const mails = [];
    for(let i = 0; i < formData.mails.length; i++) {
        const Mail = new Object();
        Mail.mails = formData.mails[i];
        Mail.tip = formData.mailType[i];
        mails.push(Mail);
    }
    
    const novOglas = {
        id: formData.id,
        kategorija: formData.kategorija,
        cena: Cena,
        opis: formData.opis,
        datum: formData.datum,
        tags: tags,
        mails: mails
    }

    console.log(novOglas, "nov oglas");


    await axios.put(`http://localhost:5005/oglas/edit/${formData.id}`, novOglas)


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