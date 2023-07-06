import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
    const sender = req.body.senderId;
    const receiver = req.body.receiverId;

    const newChat = new Chat({
        members: [sender, receiver],
    });

    try {
        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const userChats = async (req, res) => {
    const userId = req.params.userId
    try {
        const chat = await Chat.find({
            members: { $in: [userId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const findChat = async (req, res) => {
    const firstId = req.params.firstId;
    const secondId = req.params.secondId;

    try {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] },
        });
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
};
