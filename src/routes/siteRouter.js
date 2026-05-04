const express = require('express');
const siteRouter = express.Router();
const siteController = require('../controllers/siteController.js');
siteRouter.get('/', siteController.home);

siteRouter.get('/about', siteController.about);

siteRouter.get('/search', siteController.search);

siteRouter.get('/category/:cate', siteController.filterByCategory);

siteRouter.get('/status/:stat', siteController.filterByStatus);



module.exports = siteRouter;