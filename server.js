const { client, syncAndSeed } = require ('./db')
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