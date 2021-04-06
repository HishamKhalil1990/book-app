'use strict'
// environment setup
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL
const NODE_ENV = process.env.NODE_ENV;
// requiering libraries
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
// creating the app
const app = express();
// setup app
app.use(cors());
app.use(express.urlencoded({ extended: true })); //for passing the form data for the POST method => data in request.body
app.use(express.static('public')); // for preparing the css files and casting the html file with it
// creating the ejs engine
app.set('view engine', 'ejs'); // set engine to run the ejs files
// creating psql client
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };
const client = new pg.Client(process.env.DATABASE_URL);
// check client connection
client.on('error', error => { throw error; })
client.connect().then(() => {
    // listen to the port
    app.listen(PORT, () => {
        console.log('we are listening to port 3000')
    })
}).catch(error => {
    console.log("client connction faild");
})
// app middleware
app.get('/', getHomePage)
app.get('/new', getNewPage);
app.post('/searchs', searchPage);
app.post('/books', saveBook);
app.get('/books/:id', showBookDetail)
// app.post('/books/:id',showDetails);
function getHomePage(request, response) {
    const getBookDataSql = 'SELECT * FROM bookstable';
    client.query(getBookDataSql).then(data => {
        const dataArr = data.rows.map(book => {
            let bookInfo = {}
            bookInfo.id = book.id;
            bookInfo.image = book.img;
            bookInfo.title = book.title;
            bookInfo.author = book.author;
            bookInfo.description = book.descrip;
            bookInfo.isbn = book.isbn;
            bookInfo.bookshelf = book.bookshelf;
            return bookInfo;
        })
        response.render('pages/index',{dataArr})
    });
}
function showBookDetail(request, response) {
    const bookId = request.params.id;
    let bookInfo = {};
    const getBookDataSql = 'SELECT * FROM bookstable WHERE id = $1';
    client.query(getBookDataSql, [bookId]).then(data => {
        bookInfo.id = data.rows[0].id;
        bookInfo.image = data.rows[0].img;
        bookInfo.title = data.rows[0].title;
        bookInfo.author = data.rows[0].author;
        bookInfo.description = data.rows[0].descrip;
        bookInfo.isbn = data.rows[0].isbn;
        bookInfo.bookshelf = data.rows[0].bookshelf;
        response.render('pages/books/detail', { bookInfo });
    });
}
function saveBook(request, response) {
    const title = request.body.title;
    const getBookDataSql = 'SELECT * FROM bookstable WHERE title = $1';
    client.query(getBookDataSql, [title]).then(data => {
        if (data.rowCount == 0) {
            const addBookSql = 'INSERT INTO bookstable (img,title,author,descrip,isbn,bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
            const bookInfoToAdd = [request.body.image, title, request.body.author, request.body.description, request.body.isbn, request.body.bookshelf];
            client.query(addBookSql, bookInfoToAdd).then(data => { })
        }
        client.query(getBookDataSql, [title]).then(data => {
            const id = data.rows[0].id
            response.redirect(`/books/${id}`)
        });
    });
}
function getNewPage(request, response) {
    response.render('pages/searches/new');
}
function searchPage(request, response) {
    const bookSubject = request.body.search[0];
    try {
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
    } catch (error) {
        response.render('pages/error')
    }
}
function Book(bookObj) {
    this.image = exist(3, bookObj),
        this.title = exist(1, bookObj),
        this.author = exist(2, bookObj),
        this.description = exist(4, bookObj),
        this.isbn = exist(5, bookObj),
        this.bookshelf = exist(6, bookObj)
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
                vari = val.volumeInfo.industryIdentifiers[0].identifier;
            } catch (error) {
                vari = defu;
            }
            break;
        case 6:
            try {
                vari = val.volumeInfo.categories[0];
            } catch (error) {
                vari = defu;
            }
            break;
    }
    return vari;
}

