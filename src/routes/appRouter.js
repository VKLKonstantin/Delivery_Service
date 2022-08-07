const express = require('express')
const userModel = require('../models/user_model')

const router = express.Router()

router.get('/menu', (req, res) => {
    res.render("menu", { title: 'Добро пожаловать на сервис доставки еды QuicK PandA' });
})


module.exports = router


