const express = require('express')
const adventModel = require('../models/advertisements_model')
const chatModel = require('../models/chat_model')

const router = express.Router()

router.get('/menu', async (req, res) => {
    
    const user = req.user
    
    const adventsData = await adventModel.find({isDeleted: false})
    const usersChat = await chatModel.find()
    res.render("menu", { title: 'Добро пожаловать на сервис доставки еды QuicK PandA', adventsData, usersChat, user  });
})

module.exports = router


