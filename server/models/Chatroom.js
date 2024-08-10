const { Schema, model } = require('mongoose');

const chatroomSchema =  new Schema( 
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 70
        },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },

    {
        toJSON: {
            getters: true,
        },
        id: false,
}
)

const Chatroom = model('Chatroom', chatroomSchema);

module.exports = Chatroom;