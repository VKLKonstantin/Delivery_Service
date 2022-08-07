const express = require('express')
const userModel = require('../models/user_model')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const router = express.Router()

const options = {
    usernameField: 'email',
    passwordField: 'passwordHash',
}

const verifyPassword = (user, password) => {
    return user.passwordHash === password
};

const verify = (email, passwordHash, done) => {
    userModel.findOne({ email }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, { message: `Пользователь с почтой ${email} не найден` })
        }
        if (!verifyPassword(user, passwordHash)) {
            return done(null, false, { message: 'Не верный пароль' })
        }
        return done(null, user)
    })
}
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user._id)
});

passport.deserializeUser((id, cb) => {
    userModel.findById(id, (err, user) => {
        if (err) return cb(err);
        return cb(null, user);
    });
}
);

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

router.get('/login', (req, res) => {
    res.render("login", { title: "Войти" });
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
    console.log('req', req.user)
    res.redirect('/api/menu')
})

router.get('/findUser', async (req, res) => {

    try {
        const user = await userModel.findByEmail(email);
        console.log(user)
    } catch (e) {
        console.log(e)
        res.render("registration", { title: 'Пользователь не найден' });
    }
})



module.exports = router