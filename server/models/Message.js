const { Schema, model } = require('mongoose');

const messageSchema = new Schema ( 
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
                type: Date, 
                default: Date.now,
                get: function (date) {
                    return date.toLocaleDateString();
                }
            },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver:{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },

    {
        toJSON: {
            getters: true,
        },
        id: false,
}
);

const Message = model('Message', messageSchema);

module.exports = Message;