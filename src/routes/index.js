const siteRouter = require('./siteRouter')
const userRouter = require('./userRouter')
const bookRouter = require('./bookRouter')
function setupRoutes(app) {
    app.use('/', siteRouter);
    app.use('/users', userRouter);
    app.use('/books', bookRouter);
}

module.exports = setupRoutes;