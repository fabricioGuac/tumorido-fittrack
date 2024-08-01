const { Schema, model, } = require('mongoose');

const liftSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
            get: function (date) {
                return date.toLocaleDateString();
            }
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
                weight: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },

    {
        toJSON: {
            getters: true,
        },
        id: false,
});

// Virtual field to calculate the total weight lifted for exercise session
liftSchema.virtual('totalWeightLifted').get(function () {
    return this.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
});

const Lift = model('Lift', liftSchema);

module.exports = Lift;