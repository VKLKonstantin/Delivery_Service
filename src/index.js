const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')
const appRouter = require('./routes/appRouter')
const session = require('express-session')
const passport = require('passport')

const PORT = process.env.PORT
const UrlDB = process.env.UrlDB

const app = express()
    .set('view engine', 'ejs')
    .set('views', './src/views')
    .use(express.urlencoded())
    .use(session({ secret: 'SECRET' }))
    .use(passport.initialize())
    .use(passport.session())
    .use(express.static("public"))
    .use('/users', userRouter)
    .use('/api', appRouter)
    .use('/', (req, res) => {
        res.render("start", { title: "Добро пожаловать на наш сервис доставки еды" });
    })

async function start(PORT, UrlDB) {
    try {
        await mongoose
            .connect(UrlDB)
            .then(() => {
                console.info('Connected to MONGO.');
            })
            .catch((error) => {
                console.error('Failed to connect to: MONGO.', error);

                return process.exit(1);
            });

        app.listen(PORT, () => { `Server is running on port ${PORT}` })
    }
    catch (e) {
        console.log(e)
    }
}

start(PORT, UrlDB)