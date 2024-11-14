const Message = require('../models/Message');

class MessageManager {
   async getAll() {
    try {
        return await Message.find().sort({ timestamp: -1 }); 
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Could not fetch messages');
    }
  }

   async getById(id) {
    if (!id) throw new Error('Message ID is required');
        
    try {
        const message = await Message.findById(id);
        if (!message) throw new Error('Message not found');
        return message;
    } catch (error) {
        console.error(`Error fetching message with ID ${id}:`, error);
        throw new Error('Could not fetch message');
    }
  }

   async create(messageData) {
    if (!messageData || !messageData.user || !messageData.message) {
        throw new Error('User and message fields are required');
    }
        
    try {
        const newMessage = new Message(messageData);
        return await newMessage.save();
    } catch (error) {
        console.error('Error creating message:', error);
        throw new Error('Could not create message');
    }
  }

   async delete(id) {
    if (!id) throw new Error('Message ID is required');
        
    try {
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) throw new Error('Message not found or already deleted');
        return deletedMessage;
    } catch (error) {
        console.error(`Error deleting message with ID ${id}:`, error);
        throw new Error('Could not delete message');
    }
  }
};

module.exports = MessageManager;
