const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
        },
        body: [{ type: Schema.Types.ObjectId, ref: 'Body' }],
        lift: [{ type: Schema.Types.ObjectId, ref: 'Lift' }],
    },
    {
        toJSON: {
            virtuals: true,
        },
    });


// hash password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

// Compare password
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User