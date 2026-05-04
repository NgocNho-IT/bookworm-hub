const express = require('express');
const siteRouter = express.Router();
const siteController = require('../controllers/siteController.js');
const { requireAuth } = require('../middlewares/userMiddleware');

siteRouter.get('/', requireAuth, siteController.home);

siteRouter.get('/about', siteController.about);

siteRouter.get('/search', requireAuth, siteController.search);

siteRouter.get('/category/:cate', requireAuth, siteController.filterByCategory);

siteRouter.get('/status/:stat',requireAuth, siteController.filterByStatus);



module.exports = siteRouter;