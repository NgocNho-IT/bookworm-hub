const siteRouter = require('./siteRouter')
const userRouter = require('./userRouter')
const bookRoute = require('./bookRouter')
function setupRoutes(app) {
    app.use('/', siteRouter),
    app.use('/users', userRouter),
    app.use('/books',)
}

module.exports = setupRoutes;