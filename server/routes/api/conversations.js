const mongoose = require('mongoose');
const passport = require('passport');

const Message = mongoose.model('Message');
const Conversation = mongoose.model('Conversation');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
    // Create Conversation
    app.post('/api/conversations', requireAuth, async (req, res) => {
      try {
        if (!Array.isArray(req.body.participants) || !Array.isArray(req.body.unread)) {
          return res.status(400).json({ message: "Participants and unread are required and must be an array." });
        }

        if (!req.body.body || req.body.participants.length < 1 || req.body.unread.length < 1) {
          return res.status(400).json({ message: "Must provide message body, participants, and unread." });
        }
        
        const conversation = await Conversation.create({
          participants: req.body.participants,
          unread: req.body.unread
        });
  
        const message = await Message.create({
          body: req.body.body,
          from: req.user._id,
          conversationId: conversation._id
        });
  
        res.status(200).json({ conversation, message });
      } catch (err) {
        res.status(500).json(err);
      }
    });

    // Create Message
    app.post('/api/conversations/:conversationId', requireAuth, async (req, res) => {
        try {
          if (!Array.isArray(req.body.unread) || req.body.unread.length < 1) {
            return res.status(400).json({ message: "Unread is required and must be an array." });
          }

          if (!req.body.body) {
            return res.status(400).json({ message: "Must provide a message body." });
          }

          if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
            return res.status(404).json({ message: "Conversation not found." });
          }

          const conversation = await Conversation
            .findByIdAndUpdate(req.params.conversationId, {
              unread: req.body.unread,
            }, { new: true });
        
          if (!conversation) {
            return res.status(404).json({ message: "Conversation not found." });
          }

          const message = await Message.create({
            body: req.body.body,
            from: req.user._id,
            conversationId: conversation._id
          });

          res.status(200).json({ conversation, message });
        } catch (err) {
          res.status(500).json(err);
        }
    });

    // Get all conversations where the current user is a participant
    app.get('/api/conversations', requireAuth, async (req, res) => {
      try {
        const conversations = await Conversation.find({ participants: req.user._id });

        res.status(200).json(conversations);
      } catch (err) {
        res.status(500).json(err);
      }
    });

    // Get converation and all messages belonging to the conversation
    app.get('/api/conversations/:conversationId', requireAuth, async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
          return res.status(404).json({ message: "Conversation not found." });
        }

        const conversation = await Conversation
        .findOneAndUpdate(
          { _id: req.params.conversationId },
          { $pull: { unread: req.user._id } },
          { new: true }
        );

        if (!conversation || !conversation.participants.includes(req.user._id)) {
          return res.status(404).json({ message: "Conversation not found." });
        }

        const messages = await Message.find({ conversationId: conversation._id });

        res.status(200).json({ conversation, messages });
      } catch (err) {
        res.status(500).json(err);
      }
    })
}
