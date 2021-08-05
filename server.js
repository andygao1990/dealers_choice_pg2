const pg = require ('pg')
const express = require ('express')
const path = require ('path')

const app = express()

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM Book;')
        const books = response.rows
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href='/assets/styles.css' />
                </head>
                <body>
                    <h1>Books</h1>
                    <ul>
                    ${
                        books.map( book => `
                        <li>
                            <a href='/books/${book.id}'>${book.name}</a>
                        </li>
                        `).join('')
                    }
                    </ul>
                </body>
            </html>
        `)
    }
    catch (err) {
        next(err)
    }
})

app.get('/books/:id', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM Book WHERE id = $1;', [req.params.id])
        const book = response.rows[0]
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href='/assets/styles.css' />
                </head>
                <body>
                    <h1><a href='/'>Books</a></h1>
                    <div>
                    ${book.name}
                    <p>
                    ${book.content}
                    </p>
                    </div>
                </body>
            </html>
        `)
    }
    catch (err) {
        next(err)
    }
})

const port = process.env.PORT || 3000

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

const setUp = async () => {
    try {
        await client.connect()
        await syncAndSeed()
        console.log('connected to database')
        app.listen(port, ()=> console.log(`listening on port ${port}`))
    }
    catch (err) {
        console.log(err)
    }
}

setUp()