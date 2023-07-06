import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

// get user
export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// get friends
export const getUserFriends = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate('friends');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// remove friends
export const removeFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        // Remove friend from user's friends array
        await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });

        // Remove user from friend's friends array
        await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const users = await User.find({ _id: { $ne: userId } });

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

