const _ = require('lodash');// for object utitilies
const { User, validate } = require('../models/user');//object destructuring, gets exports from models/genres.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( { email: req.body.email });
    if(user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password'])); //pick allows you to pick properties from object
    await user.save()

    res.send(_.pick(user, ['_id', 'name', 'email'])); //pick allows you to pick properties from object
});

module.exports = router;