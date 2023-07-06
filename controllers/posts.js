import Post from '../models/Post.js';
import User from '../models/User.js';

// create post
export const createPost = async (req, res) => {
    try {
        const { userId, location, description, picturePath, isProfile } = req.body;

        const newPost = new Post({
            user: userId,
            location,
            description,
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();
        const user = await User.findById(userId);

        if (isProfile) {
            const posts = await Post.find({ user: userId })
                .populate('user', 'firstName lastName picturePath')
                .sort({ createdAt: -1 });

            res.status(201).json({ message: 'Post created successfully', posts: posts });
        } else {
            const friends = user.friends;
            const posts = await Post.find({ user: { $in: friends } })
                .populate('user', 'firstName lastName picturePath')
                .sort({ createdAt: -1 });

            res.status(201).json({ message: 'Post created successfully', posts: posts });
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// fetch posts
export const getFeedPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Retrieve posts from the user's friends
        const user = await User.findById(userId);
        const friends = user.friends;

        const posts = await Post.find({ user: { $in: friends } })
            .populate('user', 'firstName lastName picturePath')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// get user posts
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId })
            .populate('user', 'firstName lastName picturePath')
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// like post
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        ).populate('user', 'firstName lastName picturePath');

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// comment post
export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;

        const post = await Post.findById(id);

        const newComment = {
            user: userId,
            content
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
