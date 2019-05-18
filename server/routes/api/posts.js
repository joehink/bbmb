const express = require('express');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/posts.js');
const requireAuth = passport.authenticate('jwt', { session: false });

// Create Post
router.post('/', requireAuth, async (req, res) => {
    // append logged in user's id to req.body
    req.body.createdBy = req.user._id;

    try {
        // Create new post
        const newPost = await Post.create(req.body);
        // Send back post JSON
        res.status(200).json(newPost);
    } catch (err) {
        // Something went wrong while creating the post
        res.status(400).json(err);
    }
});

// GET posts for category
router.get('/:category', async (req, res) => {
    try {
        const posts = await Post
            .find({ category: req.params.category })
            .populate({ path: 'createdBy', select: 'username _id'});

        // Send back posts    
        res.status(200).json(posts);
    } catch (err) {
        // Something went wrong while fetching posts
        res.status(500).json(err);
    }
});

// GET recent posts for category 
router.get('/:category/recent', async (req, res) => {
    try {
        // Find 5 most recent posts
        const recentPosts = await Post
            .find({ category: req.params.category })
            .limit(5)
            .populate({ path: 'createdBy', select: 'username _id'});

        // Send back recent posts    
        res.status(200).json(recentPosts);
    } catch (err) {
        // Something went wrong while fetching recent posts
        res.status(500).json(err);
    }
})

// Like/unlike post
router.patch('/:postId/like', requireAuth, async (req, res) => {
    try {
        // Find post by id
        const post = await Post.findById(req.params.postId);

        // if post is liked by user
        if (post.likes.indexOf(req.user._id) !== -1) {
            // unlike the post
            post.likes.pull(req.user._id);
        } else {
            // like the post
            post.likes.push(req.user._id);
        }
    
        post.save();

        // Send back updated post
        res.status(200).json(post);
    } catch (err) {
        // Something went wrong while liking post
        res.status(400).json(err);
    }
})

module.exports = router;