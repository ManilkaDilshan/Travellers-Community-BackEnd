import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

// send request
export const sendRequest = async (req, res) => {
    try {
        const { sender, recipient } = req.body;

        // Check if there is already a pending request from the recipient to the sender
        const existingRecievedRequest = await FriendRequest.findOne({
            sender: recipient,
            recipient: sender,
            status: 'pending'
        });

        const existingSentRequest = await FriendRequest.findOne({
            sender: sender,
            recipient: recipient,
            status: 'pending'
        });

        if (existingRecievedRequest || existingSentRequest) {
            return res.status(400).json({ message: 'There is already a pending friend request from the recipient' });
        }

        const friendRequest = new FriendRequest({
            sender: sender,
            recipient: recipient
        });

        await friendRequest.save();

        const friendRequests = await FriendRequest.find({
            $or: [
                { sender: sender },
                { recipient: sender }
            ],
            $and: [
                {status: 'pending'}
            ]
        }).populate({
            path: 'sender',
            select: 'firstName lastName'
        });

        res.status(201).json(friendRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// accept
export const acceptRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        const friendRequest = await FriendRequest.findById(requestId);

        // Update recipient's friends list
        await User.findByIdAndUpdate(
            friendRequest.recipient,
            { $push: { friends: friendRequest.sender } }
        );

        // Update sender's friends list
        await User.findByIdAndUpdate(
            friendRequest.sender._id,
            { $push: { friends: friendRequest.recipient } }
        );

        friendRequest.status = 'accepted';

        await friendRequest.save();

        const user = await User.findById(friendRequest.recipient).populate('friends');

        res.status(200).json({ message: 'Friend request accepted', friends: user.friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// decline
export const declineRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Friend request declined' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// fetch friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.params.userId;

        const friendRequests = await FriendRequest.find({ recipient: userId, status: 'pending' }).populate({
            path: 'sender',
            select: 'firstName lastName'
        });

        res.status(200).json(friendRequests);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
