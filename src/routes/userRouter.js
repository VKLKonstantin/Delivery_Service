const express = require('express')
const userModel = require('../models/user_model')
const router = express.Router()

router.get('/registration', (req, res) => {
    res.render("registration", { title: 'Пожалуйста, зарегистрируйтесь' });
})

router.post('/registration', async (req, res) => {

    const { email, passwordHash, name, contactPhone } = req.body;

    try {
        await userModel.create({ email, passwordHash, name, contactPhone })
        res.render('menu', { title: 'Добро пожаловать на сервис доставки еды QuicK PandA' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'К сожелению не удалось зарегистриваться. Пожалуйста, попробуйте еще раз' })
    }

})

router.get('/findUser', (req, res) => {

    try {
        const user = await userModel.findByEmail(email);
        console.log(user)
    } catch (e) {
        console.log(e)
        res.render("registration", { title: 'Пользователь не найден' });
    }
})



module.exports = router