const express = require('express')

const router = express.Router();

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth');


const { create, listAll, remove, read, update, list ,searchFilters } = require("../controllers/product");


router.post('/product', authCheck, adminCheck, create);
router.get('/products/:count', listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, adminCheck, update);

router.post("/products", list);


router.post('/search/filters', searchFilters);

module.exports = router;