const mongoose = require('mongoose');
const passport = require('passport');

const Message = mongoose.model('Message');
const Conversation = mongoose.model('Conversation');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = app => {
    // Create Conversation
    app.post('/api/conversations', requireAuth, async (req, res) => {
      try {
        if (!req.body.body) {
          return res.status(400).json({ message: "Must provide a message body." });
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
          if (!req.body.body) {
            return res.status(400).json({ message: "Must provide a message body." });
          }

          if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
            return res.status(404).json({ message: "Conversation not found." });
          }

          const conversation = await Conversation
            .findByIdAndUpdate(req.params.conversationId, {
              unread: req.body.unread,
            }, { new: true })

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
    app.get('/api/conversations/user/:userId', requireAuth, async (req, res) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
          return res.status(404).json({ message: "User not found." });
        }

        const conversations = await Conversation.find({ participants: req.params.userId });

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
          { _id: req.params.conversationId, participants: req.user._id },
          { $pull: { unread: req.user._id } },
          { new: true }
        );

        const messages = await Message.find({ conversationId: conversation._id });

        res.status(200).json({ conversation, messages });
      } catch (err) {
        res.status(500).json(err);
      }
    })
}
