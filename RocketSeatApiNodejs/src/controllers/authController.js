const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authconfig = require('../config/auth.json')

const User = require('../models/user')

const router = express.Router()

function generateToken(params = {}){
    return jwt.sign(params, authconfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (request, response) => {
    const { name, email, password } = request.body
    try {
        if(await User.findOne({ email })){
            return response.status(400).send({error: 'User alredy exists'})
        }
        const user = await User.create(request.body)

        user.password = undefined

        return response.send({
            user,
            token: generateToken ({ id: user.id })
        })
    } catch (err) {
        return response.status(400).send({ error: 'Registration failed' })
    }
})

router.post('/authenticate', async (request, response) => {
    const { email, password } = request.body

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return response.status(400).send({error: "User not found"})
    }

    if(!await bcrypt.compare(password, user.password)) {
        return response.status(400).send({error: "Invalid password"})
    }

    user.password = undefined

    const token = jwt.sign({ id: user.id }, authconfig.secret, {
        expiresIn: 86400
    })
    response.send({
        user,
        token: generateToken ({ id: user.id })
    })
})

module.exports = app => app.use('/auth', router)