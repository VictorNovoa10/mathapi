const express = require('express');
const { add, subtract, multiply, divide, pow } = require('./mathController');

const router = express.Router();

router.post('/add', add);
router.post('/subtract', subtract);
router.post('/multiply', multiply);
router.post('/divide', divide);
router.post('/pow', pow);

module.exports = router;
