const { Schema, model } = require('mongoose');


const BodySchema = new Schema (
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date, 
            default: Date.now
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
        virtuals: true,
    },
})

// Calculate in the client side
// // Virtual filed to calculate the fat free mass index
// BodySchema.virtual('ffmi').get(function() {
//     const fatFreeMass = this.weight * (1 - this.bodyFatPercentage / 100);
//     return fatFreeMass / (this.height * this.height);
// })

const Body = model('body', BodySchema);

module.exports = Body;
