const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const addSubscription = async (req, res) => {
    const { company, dueDate, monthlyPayment, status, category } = req.body;
    const createdBy = req.user._id; 

    try {
        const subscription = await Subscription.create({ company, dueDate, monthlyPayment, status, category, createdBy });
        res.status(StatusCodes.CREATED).json({ subscription });
    } catch (error) {
        throw new BadRequestError('Could not add subscription');
    }
};

module.exports = {
    register,
    login,
    addSubscription,
};
