const siteRouter = require('./siteRouter');
const userRouter = require('./userRouter');
const bookRouter = require('./bookRouter');
const { requireAuth, checkUser } = require('../middlewares/userMiddleware');
const { notFound, errorHandler } = require('../middlewares/errorMiddleware');

function setupRoutes(app) {
    app.use(checkUser);

    app.use('/users', userRouter);
    app.use('/', siteRouter);
    app.use('/books', requireAuth, bookRouter);

    // Error Handling Middleware (phải đặt sau routes)
    app.use(notFound);
    app.use(errorHandler);
}

module.exports = setupRoutes;