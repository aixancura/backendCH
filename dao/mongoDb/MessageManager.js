const Message = require('../models/messages');

class MessageManager {
    async getAll() {
        return await Message.find();
    }

    async getById(id) {
        return await Message.findById(id);
    }

    async create(messageData) {
        const newMessage = new Message(messageData);
        return await newMessage.save();
    }

    async delete(id) {
        return await Message.findByIdAndDelete(id);
    }
}

module.exports = MessageManager;
