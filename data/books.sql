DROP TABLE IF EXISTS books;
CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    img VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    descrip VARCHAR(255),
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
);