const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
router.get('/settings',homeController.settings);

// For any other Routers 
// router.use('/routerName',require('./routerfile'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));

router.use('/api',require('./api'));

//Likes
router.use('/likes',require('./likes'));


module.exports = router;