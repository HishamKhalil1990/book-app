'use strict'
// environment setup
require('dotenv').config();
const PORT = process.env.PORT || 3001;
// requiering libraries
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
// creating the app
const app = express();
// setup app
app.use(cors());
app.use(express.urlencoded({ extended: true })); //for passing the form data for the POST method => data in request.body
app.use(express.static('public')); // for preparing the css files and casting the html file with it
// creating the ejs engine
app.set('view engine', 'ejs'); // set engine to run the ejs files
// listen to the port
app.listen(PORT, () => {
    console.log('we are listening to port 3001')
})
// app middleware
app.get('/', getHomePage);
app.post('/searchs', searchPage);
function getHomePage(request, response) {
    response.render('pages/index');
}
function searchPage(request, response) {
    const bookSubject = request.body.search[0];
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookSubject}+`
    if (request.body.search[0] === 'title') {
        url += `in${request.body.search[1]}:`
    } else {
        url += `in${request.body.search[1]}:`
    }
    superagent.get(url).then(data => {
        let dataArr = [];
        try {
            dataArr = data.body.items.map(bookObj => new Book(bookObj))
        } catch (error) {
        }
        response.render('pages/searches/show', { dataArr: dataArr });
    })
    // response.render('pages/searches/show')
}
function Book(bookObj) {
    this.title = exist(1, bookObj),
    this.author = exist(2, bookObj),
    this.image = exist(3, bookObj),
    this.description = exist(4, bookObj),
    this.puplish = exist(5, bookObj),
    this.price = exist(6, bookObj)
}

function exist(index, val) {
    let defu = "no info available";
    let vari;
    switch (index) {
        case 1:
            try {
                vari = val.volumeInfo.title;
            } catch (error) {
                vari = defu;
            }
            break;
        case 2:
            try {
                vari = val.volumeInfo.authors[0];
            } catch (error) {
                vari = defu;
            }
            break;
        case 3:
            defu = "https://i.imgur.com/J5LVHEL.jpg";
            try {
                vari = val.volumeInfo.imageLinks.thumbnail;
            } catch (error) {
                vari = defu;
            }
            break;
        case 4:
            try {
                vari = val.volumeInfo.description;
            } catch (error) {
                vari = defu;
            }
            break;
        case 5:
            try {
                vari = val.volumeInfo.publishedDate;
            } catch (error) {
                vari = defu;
            }
            break;
        case 6:
            try {
                vari = val.listPrice.amount;
            } catch (error) {
                vari = defu;
            }
            break;
    }
    return vari;
}

