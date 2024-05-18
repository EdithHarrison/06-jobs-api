const Subscription = require('../models/Subscription');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllSubs = async (req, res) => {
    res.send('all subscription')
}

const getSubs = async (req, res) => {
    res.send('get subcription')
}

const createSubs = async (req, res) => {
    req.body.createdBy = req.user.userId
        const subscription = await Subscription.create(req.body);
        res.status(StatusCodes.CREATED).json({ subscription });      
};

const updateSubs = async (req, res) => {
    res.send('update subscription')
}

const deleteSubs = async (req, res) => {
    res.send('delete subscription')
}


module.exports = {
    getAllSubs,
    getSubs,
    createSubs,
    updateSubs,
    deleteSubs
}