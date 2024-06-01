const Subscription = require('../models/Subscription');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllSubs = async (req, res) => {
  const subscriptions = await Subscription.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ subscriptions, count: subscriptions.length });
};

const getSubs = async (req, res) => {
  const { user: { userId }, params: { id: subscriptionId } } = req;

  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    createdBy: userId
  });

  if (!subscription) {
    throw new NotFoundError(`No subscription with id ${subscriptionId}`);
  }

  res.status(StatusCodes.OK).json({ subscription });
};

const createSubs = async (req, res) => {
  req.body.createdBy = req.user.userId;  // Ensure `createdBy` is set
  const subscription = await Subscription.create(req.body);
  res.status(StatusCodes.CREATED).json({ subscription });
};

const updateSubs = async (req, res) => {
  const {
    body: { company, dueDate, monthlyPayment },
    user: { userId },
    params: { id: subscriptionId }
  } = req;

  if (company === '' || dueDate === '' || monthlyPayment === '') {
    throw new BadRequestError('Company, Due Date, and Monthly Payment cannot be empty');
  }

  const subscription = await Subscription.findByIdAndUpdate(
    { _id: subscriptionId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!subscription) {
    throw new NotFoundError(`No subscription with id ${subscriptionId}`);
  }

  res.status(StatusCodes.OK).json({ subscription });
};

const deleteSubs = async (req, res) => {
  const { user: { userId }, params: { id: subscriptionId } } = req;

  const subscription = await Subscription.findByIdAndRemove({
    _id: subscriptionId,
    createdBy: userId,
  });

  if (!subscription) {
    throw new NotFoundError(`No subscription with id ${subscriptionId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Subscription deleted successfully' });
};

module.exports = {
  getAllSubs,
  getSubs,
  createSubs,
  updateSubs,
  deleteSubs
};
