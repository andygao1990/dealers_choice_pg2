const pg = require ('pg')

const client = new pg.Client('postgres://localhost/books_db')

const syncAndSeed = async () => {
    const SQL = `
        DROP TABLE IF EXISTS Book;
        CREATE TABLE Book (
            id INTEGER PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            content VARCHAR(200) NOT NULL
        );
        INSERT INTO Book (id, name, content) VALUES (1, 'Book1', 'This is book1');
        INSERT INTO Book (id, name, content) VALUES (2, 'Book2', 'This is book2');
        INSERT INTO Book (id, name, content) VALUES (3, 'Book3', 'This is book3');
        INSERT INTO Book (id, name, content) VALUES (4, 'Book4', 'This is book4');
        INSERT INTO Book (id, name, content) VALUES (5, 'Book5', 'This is book5');
        INSERT INTO Book (id, name, content) VALUES (6, 'Book6', 'This is book6');
        INSERT INTO Book (id, name, content) VALUES (7, 'Book7', 'This is book7');
    `
    await client.query(SQL)
}

module.exports = {
    client,
    syncAndSeed
}