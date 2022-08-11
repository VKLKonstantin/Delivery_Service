const express = require('express')
const adventModel = require('../models/advertisements_model')

const router = express.Router()

router.get('/menu', async (req, res) => {
    const adventsData = await adventModel.find({isDeleted: false})
    res.render("menu", { title: 'Добро пожаловать на сервис доставки еды QuicK PandA', adventsData });
})

module.exports = router


