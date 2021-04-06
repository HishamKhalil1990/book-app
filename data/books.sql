DROP TABLE IF EXISTS bookstable;
CREATE TABLE bookstable(
    id SERIAL PRIMARY KEY,
    img VARCHAR(255),
    title VARCHAR(255),
    author VARCHAR(255),
    descrip text,
    isbn VARCHAR(255),
    bookshelf VARCHAR(255)
);