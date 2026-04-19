const siteRouter = require('./siteRouter')
const userRouter = require('./userRouter')

function setupRoutes(app) {
    app.use('/', siteRouter),
    app.use('/users', userRouter)
}

module.exports = setupRoutes;