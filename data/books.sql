DROP TABLE IF EXISTS booksTable;
CREATE TABLE booksTable(
    id SERIAL PRIMARY KEY,
    img VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    descrip VARCHAR(1023),
    isbn VARCHAR(255),
    bookshelf VARCHAR(1023)
);