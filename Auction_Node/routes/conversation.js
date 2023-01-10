const router = require("express").Router();
const Conversation = require("../models/conversation");

//Create new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Find conversation of a user by ID
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Find conversation that includes two user ID's
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    if (req.params.firstUserId !== req.params.secondUserId) {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
      if (conversation == null) {
        const newConversation = new Conversation({
          members: [req.params.firstUserId, req.params.secondUserId],
        });
        try {
          const savedConversation = await newConversation.save();
          res.status(200).json(savedConversation);
        } catch (err) {
          res.status(500).json(err);
        }
      }
    }
  } catch (err) {
    res.status(500).json();
  }
});

module.exports = router;
