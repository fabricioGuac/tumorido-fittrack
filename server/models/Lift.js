const { Schema, model, default: mongoose } = require('mongoose');

const liftSchema = new Schema (
    {
        userId: {type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        exercise: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        sets: [
            {
                reps: {
                    type: Number,
                    required: true,
                },
                weight:{
                    type: Number,
                    required: true,
                },
            },
        ],
    },

    {
        toJSON: {
            virtuals: true,
        },
});

// Virtual field to calculate the total weight lifted for exercise session
liftSchema.virtual('totalWeightLifted').get(function(){
    return this.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
});

const Lift = model('lift', liftSchema);

module.exports = Lift;