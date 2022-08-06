const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')
const app = express();

const PORT = process.env.PORT || 3002;
const UrlDB = process.env.UrlDB

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

app.set('view engine', 'ejs')
.set('views', './src/views')
.use(express.static("public"))
.use(express.urlencoded())
.use('/users', userRouter)
.use('/', (req, res) => {
    res.render("start", { title: "Добро пожаловать на наш сервис доставки еды" });
})

start(PORT, UrlDB)