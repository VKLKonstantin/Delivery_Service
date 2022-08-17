const express = require('express')
const userModel = require('../models/user_model')
const passport = require('passport')
const _passwordHash = require('password-hash');
const adventModel = require('../models/advertisements_model')
const LocalStrategy = require('passport-local').Strategy

const router = express.Router()

const options = {
    usernameField: 'email',
    passwordField: 'password',
}

const verifyPassword = (user, password) => {
    return _passwordHash.verify(password, user.passwordHash)
};

const verify = (email, password, done) => {
    userModel.findOne({ email }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, { message: `Пользователь с почтой ${email} не найден` })
        }
        if (!verifyPassword(user, password)) {
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

    const { email, password, name, contactPhone } = req.body;
    if (_passwordHash.isHashed(password)) {
        alert('Введен хэш пароля')
        console.log('Введен хэш пароля')
        res.redirect("/users/login")
    }
    const passwordHash = _passwordHash.generate(password)
    console.log('passwordHash', passwordHash)
    try {
        await userModel.create({ email, passwordHash: password, name, contactPhone })
        const adventsData = await adventModel.find({ isDeleted: false })
        const credentials = await userModel.findOne({ email })
        console.log('credentials', credentials)
        res.redirect("/users/login")
        // res.status('ok')
        // res.json({ credentials })
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'К сожелению, email занят. Пожалуйста, попробуйте еще раз' })
        // res.status('error')
        // res.json('email занят')
    }

})

router.get('/login', (req, res) => {
    res.render("login", { title: "Войти" });
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), async (req, res) => {
    console.log('req', req.user)
    try {
        res.redirect("/api/menu")
        // const credentials = await userModel.findOne({ email })
        // res.status('ok')
        // res.json({ credentials })
    } catch (e) {
        console.log(e)
        res.render("error", { title: 'Неверный логин или пароль' });
        // res.status('error')
        // res.json('Неверный логин или пароль')
    }

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

router.get('/me', async (req, res) => {
    try {
        const { _id } = req.user
        const user = await userModel.findById(_id);
        res.render("profile", { title: 'Ваш профиль', user });
    } catch (e) {
        console.log(e)
        res.render("error", { title: 'Пожалуйста, авторизуйтесь' });
    }
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


module.exports = router