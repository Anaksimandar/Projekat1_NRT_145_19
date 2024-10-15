const validateData = (data) => {
    const errors = {};

    // Validate 'kategorija' field (required, string, not empty)
    if (!data.kategorija || typeof data.kategorija !== 'string' || data.kategorija.trim() === '') {
        errors.kategorija = 'Kategorija field is required';
    }

    // Validate 'vrednost' field (optional, if provided must be a number or empty)
    if (!data.vrednost || isNaN(Number(data.vrednost))) {
        errors.vrednost = 'Vrednost field is required';
    }

    // Validate 'valuta' field (required, string, specific values only)
    const allowedValuta = ['dinar', 'euro', 'dolar','rublja']; // Example valid options
    if (!data.valuta || !allowedValuta.includes(data.valuta)) {
        errors.valuta = 'Valuta field is required';
    }

    // Validate 'opis' field (optional, string)
    if (!data.opis || typeof data.opis !== 'string' || data.opis.trim() === '') {
        errors.opis = 'Opis field is required';
    }

    // Validate 'datum' field (required, valid date)
    const date = new Date(data.datum);
    if (isNaN(date.getTime())) {
        errors.date = 'Invalid date';
    }

    // Validate 'tags' field (required, must be an array of valid tags)
    if (!Array.isArray(data.tags)) {
        errors.tags = 'Tags should be an array';
    } 

    if (data.tags.length < 1) {
        errors.tags = 'Tag field cannot be empty';
    }

    if (data.mails.length < 1) {
        errors.mails = 'Mail field cannot be empty';
    } 

    // Validate 'mails' field (required, must be an array of valid emails)
    if (!Array.isArray(data.mails)) {
        errors.mails = 'Mails should be an array';
    } 
    else {
        data.mails.forEach((mail, index) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(mail)) {
                errors.mails = 'Invalid email format';
            }
        });
    }

    return errors;
};

module.exports = validateData;
