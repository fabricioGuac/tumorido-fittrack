const { Schema, model } = require('mongoose');


const BodySchema = new Schema (
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date, 
            default: Date.now,
            get: function (date) {
                return date.toLocaleDateString();
            }
        },
        weight: {
            type: Number,
            required: true,
        },
        bodyFatPercentage: {
            type: Number,
            required: true,
        }
    },
{
    toJSON: {
        getters: true,
    },
    id:false,
})



const Body = model('Body', BodySchema);

module.exports = Body;
