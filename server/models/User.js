const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Lift = require('./Lift');
const Body = require('./Body');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        password: {
            type: String,
            required: true,
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character']
        },
        height: {
            type: Number,
            required: true,
        },
        birthday: {
            type: Date,
            required:true,
        },
        // Represents the gender 0 for men 1 for women
        gender: {
            type: Number,
            required: true,
        },
        pfp: {
            type: String,
        },
        body: [{ type: Schema.Types.ObjectId, ref: 'Body' }],
        lift: [{ type: Schema.Types.ObjectId, ref: 'Lift' }],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id:false,
    }
);


// hash password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

// Hooks to delete the users related measurements and lifts if the user is deleted
userSchema.pre('remove', async function (next) {
    // Deletes all lifts that belong to the user
    await Lift.deleteMany({_id: {$in: this.lift}});
    // Deletes all body measurements that belong to the user
    await Body.deleteMany({_id:{$in: this.body}});
    // TODO: Strategie to delete messages or chatrooms

    next();
})

// Compare password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Virtual to calculate an aproximate of the users age
userSchema.virtual('age').get(function() {
    return new Date().getFullYear() - this.birthday.getFullYear();
})

const User = model('user', userSchema);

module.exports = User