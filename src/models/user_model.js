const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: false
    },
})

module.exports = model('userModel', UserSchema)