const express = require('express')
const fileMulter = require('../../middlewareMulter')
const adventModel = require('../models/advertisements_model')

const router = express.Router()

router.get('/create', (req, res) => {
    const { _id } = req.user
    console.log('_id', _id)
    const createDate = new Date().toDateString()
    console.log('createDate', createDate)
    res.render("adventForm", { title: 'Заполните форму для публикации Вашего объявления', id: _id, createDate });
})
router.post('/create', async (req, res) => {
    const { shortText, description, image, userId, createdAt, updatedAt, tags, isDeleted } = req.body
    try {
        await adventModel.create({ shortText, description, image, userId, createdAt, updatedAt, tags, isDeleted })
        res.redirect("/api/menu")
    } catch (e) {
        console.log(e)
        res.render("error", { title: 'Ваше объявление не сохранено' })
    }
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params
    res.render("access_delete", { title: 'Вы уверены, что хотите удалить это объявление?', id })
})

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await adventModel.findOneAndUpdate({ _id: id }, { isDeleted: true })
        res.redirect("/api/menu")
    }
    catch (e) {
        res.status(404)
        res.render("error", { title: 'Объявление не удалено' })
    }
})

router.post('/upload-pic',
    fileMulter.single('image'),
    (req, res) => {
        if (req.file) {
            const { path } = req.file
            res.json({ path })
        }
        res.json()
    })

router.post('/', fileMulter.single('image'), (req, res, next) => {

    var obj = {
        img: {
            data: fs.readFileSync(path.join(__dirname + '/myUploads/' + req.file.filename)),
            contentType: 'image/jpeg'
        }
    }
    adventModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/');
        }
    });
});

module.exports = router