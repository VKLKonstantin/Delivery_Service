const { Schema, model } = require('mongoose')

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    sentAt: { type: Date, required: true },
    text: { type: String, required: true },
    readAt: { type: Date, required: false },
})

const ChatSchema = new Schema({
    name: { type: String, required: true },
    createdAt: { type: String, required: true },
    messages: { type: String, required: false },
})

module.exports = model('chatModel', ChatSchema)
