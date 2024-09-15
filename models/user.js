const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    order_ids: [{
        type: ObjectId,
        ref: 'Order'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;