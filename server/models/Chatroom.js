const { Schema, model } = require('mongoose');
const Message =  require('./Message');

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

// Hook to delete the chatroom messages if the chatroom is deleted
chatroomSchema.pre('remove', async function(next){
    await Message.deleteMany({_id: {$in: this.messages}});

    next();
})

const Chatroom = model('Chatroom', chatroomSchema);

module.exports = Chatroom;