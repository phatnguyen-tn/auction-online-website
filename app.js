const express = require('express');
const app = express();

app.set(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));


app.listen(5000, console.log('sv running ...'));