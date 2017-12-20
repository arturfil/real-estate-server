const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const propertySchema = new Schema({
    name: {
        type: String,
        required: [true, "What is the property's name"]
    },
    addres: {
        type: String,
        required: [true, "Address of the property"]
    },
    image: {
        type: String,
        required: [true, "The property needs at least one image."]
    },
    area: {
        type: Number,
        required: [true, "What is the size of the property"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const PropertyModel = mongoose.model('Property', propertySchema);

module.exports = PropertyModel;