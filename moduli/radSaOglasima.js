const e = require('express');
const fs = require('fs');
const PATH="./oglasi.json";
//const util = require('util');

const procitajOglase=()=>{
    let oglasi= fs.readFileSync(PATH,(err,data)=>{
        if(err){
            return err;
        }
        return data
    });
    return JSON.parse(oglasi);
}

const sacuvajOglase=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data,null,2));
}

exports.allOglasi = () => {
    return procitajOglase();
}

exports.addOglas = (noviOglas) => {
    let id=1;
    let oglasi=this.allOglasi();
    if(oglasi.length>0){
        id=oglasi[oglasi.length-1].id+1;
    }
    noviOglas.id=id;
    oglasi.push(noviOglas)
    sacuvajOglase(oglasi);
}

exports.getOglasi = (id) => {
    return this.allOglasi().find(x => x.id == id);
}

exports.izmeniOglas=(novOglas)=>{
    let oglasi=this.allOglasi();
    
    oglasi.forEach(oglas=>{
        if(oglas.id == novOglas.id){
            oglas.kategorija = novOglas.kategorija;
            oglas.cena.vrednost = novOglas.vrednost;
            oglas.cena.valuta = novOglas.valuta;
            oglas.opis = novOglas.text;
            oglas.datum = novOglas.datum;

            // "Ciscenje" mejlova od nepotrebnih znakova
            const Mejl = new Object();
            Mejl.mail = [];
            let privatni = [];
            let poslovni = [];
            let re = /\r\n/g;//global(default will remove just first found), i - ignore case

            privatni = novOglas.privatni.replace(re,"/");
            poslovni = novOglas.poslovni.replace(re,"/");

            privatni = privatni.split("/");
            poslovni = poslovni.split("/");
            
            privatni = privatni.filter(t=>t);
            poslovni = poslovni.filter(t=>t);

            privatni.forEach(m => {
                Mejl.mail.push({tip:'privatni',mail:m});
            });
            poslovni.forEach(m => {
                Mejl.mail.push({tip:'poslovni',mail:m});
            });
            
            oglas.email.mail = Mejl.mail;

            // "Ciscenje tagova od belina"
            let filtriraniTagovi = novOglas.tagovi.split(" ").filter(t=>t);
            oglas.tagovi = filtriraniTagovi;
       
        }

    })

    
    
    
    
    sacuvajOglase(oglasi);
}

exports.deleteOglasi = (id) => {
    sacuvajOglase(this.allOglasi().filter(oglasi=>oglasi.id!=id));
}

exports.getOglasBy = (kategorija,dgd,ggd,dgc,ggc) =>{
    const formatiranjeDatuma =(datum)=>{
        datum = datum.split('-');
        const formatiranDatum = new Date(datum[2],datum[1]-1,datum[0]);
        return formatiranDatum;
    }
    let oglasi= []
    this.allOglasi().forEach(element=>{
        if(((kategorija=="")?true:element.kategorija.includes(kategorija)) &&
         ((dgd=="")?true:formatiranjeDatuma(element.datum)>formatiranjeDatuma(dgd)) &&
          ((ggd=="")?true:formatiranjeDatuma(element.datum)<formatiranjeDatuma(ggd)) &&
            ((dgc=="")?true:parseInt(element.cena.vrednost)>parseInt(dgc))&&
             ((ggc=="")?true:parseInt(element.cena.vrednost)<parseInt(ggc)))
        {
            
            oglasi.push(element)
        }
    })
    return oglasi
};