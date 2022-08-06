const express = require('express');

const app = express();

const PORT = process.env.PORT || 3002;

app.use('/', (req, res) => {
    res.json('Delivery Service')
})

app.listen(PORT, () => {`Server is running on port ${PORT}`});