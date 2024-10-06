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

exports.getAllOglasi = () => {
    return procitajOglase();
}

exports.addOglas = (noviOglas) => {
    let id=1;
    let oglasi=this.getAllOglasi();
    if(oglasi.length>0){
        id=oglasi[oglasi.length-1].id+1;
    }
    noviOglas.id=id;
    oglasi.push(noviOglas)
    sacuvajOglase(oglasi);
}

exports.getOglasById = (id) => {
    return this.getAllOglasi().find(x => x.id == id);
}

exports.izmeniOglas=(novOglas)=>{
    let oglasi=this.getAllOglasi();
    
    oglasi.forEach(oglas=>{
        if(oglas.id == novOglas.id){
            oglas.kategorija = novOglas.kategorija;
            oglas.cena.vrednost = novOglas.vrednost;
            oglas.cena.valuta = novOglas.valuta;
            oglas.opis = novOglas.text;
            oglas.datum = novOglas.datum;

            oglas.mail = novOglas.mail;

            oglas.tagovi = novOglas.tagovi;
       
        }

    })

    sacuvajOglase(oglasi);
}

exports.deleteOglas = (id) => {
    sacuvajOglase(this.getAllOglasi().filter(oglasi=>oglasi.id!=id));
}

exports.getOglasBy = (kategorija,dgd,ggd,dgc,ggc) =>{
    const formatiranjeDatuma =(datum)=>{
        datum = datum.split('-');
        const formatiranDatum = new Date(datum[2],datum[1]-1,datum[0]);
        return formatiranDatum;
    }
    let oglasi= []
    this.getAllOglasi().forEach(element=>{
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