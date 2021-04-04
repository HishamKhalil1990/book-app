'use strict'
// environment setup
require('dotenv').config();
const PORT =process.env.PORT || 3001;
// requiering libraries
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
// creating the app
const app = express();
// setup app
app.use(cors());
app.use(express.urlencoded({extended:true})); //for passing the form data for the POST method => data in request.body
app.use(express.static('public')); // for preparing the css files and casting the html file with it
// creating the ejs engine
app.set('view engine','ejs'); // set engine to run the ejs files
// listen to the port
app.listen(PORT,()=>{
    console.log('we are listening to port 3001')
})
// app middleware
app.get('/',getHomePage);
app.post('/searchs',searchPage);
function getHomePage(request,response){
    response.render('pages/index');
}
function searchPage(request,response){
    const bookSubject = request.body.search[0];
    let url = `https://www.googleapis.com/books/v1/volumes?q=${bookSubject}+`
    if (request.body.search[0] === 'title'){
        url += `in${request.body.search[1]}:`
    }else{
        url += `in${request.body.search[1]}:`
    }
    superagent.get(url).then(data => {
        const dataArr = data.body.items.map(bookObj => new Book(bookObj))
        response.json(dataArr)
    })
    // response.render('pages/searches/show')
}
function Book(bookObj){
    console.log(bookObj)
    this.title = bookObj.volumeInfo.title,
    this.author = bookObj.volumeInfo.authors.reduce((acc,auth)=>acc += auth + ",","") || '',
    this.image = bookObj.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg',
    this.description = bookObj.volumeInfo.description,
    this.puplish = 'puplished in ' + bookObj.volumeInfo.publishedDate
    this.price = bookObj.listPrice.amount + 'USD'
}

