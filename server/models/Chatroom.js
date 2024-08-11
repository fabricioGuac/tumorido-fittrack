const { Schema, model } = require('mongoose');

const chatroomSchema =  new Schema( 
    {
        messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },

    {
        timestamps: true,

        toJSON: {
            getters: true,
        },
        id: false,
}
)

const Chatroom = model('Chatroom', chatroomSchema);

module.exports = Chatroom;