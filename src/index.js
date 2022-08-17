const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRouter')
const appRouter = require('./routes/appRouter')
const adventRouter = require('./routes/adventRouter')
const session = require('express-session')
const passport = require('passport')
const http = require('http')
const socketIO = require('socket.io')
const chatModel = require('./models/chat_model')

const PORT = process.env.PORT
const UrlDB = process.env.UrlDB

const app = express()
    .set('view engine', 'ejs')
    .set('views', './src/views')
    .use(express.urlencoded())
    .use(session({ secret: 'SECRET' }))
    .use(passport.initialize())
    .use(passport.session())
    .use('/myUploads', express.static(__dirname + 'routes/myUploads'))
    .use(express.static("public"))
    .use('/users', userRouter)
    .use('/api', appRouter)
    .use('/advent', adventRouter)
    .use('/', (req, res) => {
        res.render("start", { title: "Добро пожаловать на наш сервис доставки еды" });
    })

const server = http.Server(app)
const io = socketIO(server)


io.on('connection', (socket) => {
    const { id } = socket;
    console.log(`Socket connected: ${id}`);

    const { roomName } = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        console.log('msg111', msg)
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);

        const message = new chatModel({ name: msg.username, createdAt: msg.date, messages: msg.comment })
        try {
            message.save()
            console.log('ok')
        }
        catch (e) {
            console.log(e)
            res.render("error", { title: 'Ваше сообще не отправлено' })
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

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

        server.listen(PORT, (err) => {
            if (err) {
                throw err
            }
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}

start(PORT, UrlDB)