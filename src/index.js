const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3002;
const UrlDB = process.env.UrlDB || 'mongodb+srv://Konstantin:Q0s1lJxNxjIG7UOW@cluster0.3gx3nos.mongodb.net/?retryWrites=true&w=majority'

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

app.use('/', (req, res) => {
    res.json('Delivery Service')
})

start(PORT, UrlDB)