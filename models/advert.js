const mongoose = require('mongoose')
const db = require('../dbConfig/config');
const advertSchema = new mongoose.Schema({
    image:{ 
        type: String,
    },
    screen: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'admin'},

},{timestamps: true})

const advert = db.spartapp.model('advert',advertSchema)
module.exports = advert