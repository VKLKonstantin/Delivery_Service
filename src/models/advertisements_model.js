const { Schema, model } = require('mongoose')

const AdvertSchema = new Schema({
    shortText: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date, default: Date.now,
        required: false
    },
    updatedAt: {
        type: Date, default: Date.now,
        required: false
    },
    tags: {
        type: [String],
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: true
    },
})

module.exports = model('advertModel', AdvertSchema)