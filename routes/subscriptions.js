const express = require('express');
const router = express.Router();
const {
    getAllSubs,
    getSubs,
    createSubs,
    updateSubs,
    deleteSubs
} = require('../controllers/subscription');

router.route('/').post(createSubs).get(getAllSubs);
router.route('/:id').get(getSubs).delete(deleteSubs).patch(updateSubs);

module.exports = router;
