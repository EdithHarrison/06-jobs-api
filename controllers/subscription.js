const Subscription = require('../models/Subscription');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllSubs = async (req, res) => {
    const subscriptions = await Subscription.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ subscriptions, count: subscriptions.lenght})
}

const getSubs = async (req, res) => {
    const {user:{userId}, params:{id:subscriptionId}} = req

    const subscription = await Subscription.findOne ({
        _id:subscriptionId, createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No subscription with id ${subscriptionId}`)
    }
    res.status(StatusCodes.OK).json({subscription})
}

const createSubs = async (req, res) => {
    req.body.createdBy = req.user.userId
        const subscription = await Subscription.create(req.body);
        res.status(StatusCodes.CREATED).json({ subscription });      
};

const updateSubs = async (req, res) => {
    const {
        body:{company, dueDate, monthlyPayment},
        user:{userId}, 
        params:{id:subscriptionId}
        } = req
        
        if (company=== '' || dueDate=== '' || monthlyPayment=== ''){
            throw new BadRequestError('Company, Due Date and Monthly Payment cannot be empty')
        }
        const subscription = await Subscription.findByIdAndUpdate({_id:subscriptionId, createdBy:userId}, req.body, {new:true, runValidators:true})
        if(!job){
            throw new NotFoundError(`No subscription with id ${subscriptionId}`)
        }
        res.status(StatusCodes.OK).json({subscription})
}

const deleteSubs = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:subscriptionId}
        } = req

        const subscription = await Subscription.findByIdAndRemove({
            _id:subscriptionId,
            createdBy:userId,
        })
        if(!job){
            throw new NotFoundError(`No subscription with id ${subscriptionId}`)
        }
        res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllSubs,
    getSubs,
    createSubs,
    updateSubs,
    deleteSubs
}