const mongoose = require('mongoose')
const db = require('../dbConfig/config')

const settingSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: true
    }
},{timestamps: true})

const settingModel = db.spartapp.model('setting',settingSchema)
module.exports = settingModel

