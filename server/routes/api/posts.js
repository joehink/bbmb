const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/posts.js');
const Comment = require('../../models/comments.js');
const requireAuth = passport.authenticate('jwt', { session: false });

// Create Post
router.post('/', requireAuth, async (req, res) => {
    // append logged in user's id to req.body
    req.body.author = req.user._id;

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
router.get('/category/:category', async (req, res) => {
    try {
        const { page = 1, sortBy = '-updatedAt' } = req.query;
        const limit = 50;

        const posts = await Post
            .find({ category: req.params.category })
            .sort(sortBy)
            .skip((page * limit) - limit)
            .limit(limit)
            .populate({ path: 'author', select: 'username _id'});

        // Send back posts    
        res.status(200).json({
            nextPage: (posts.length >= limit),
            posts
        });
    } catch (err) {
        // Something went wrong while fetching posts
        res.status(500).json(err);
    }
});

// GET recent posts for category 
router.get('/category/:category/recent', async (req, res) => {
    try {
        // Find 5 most recent posts
        const recentPosts = await Post
            .find({ category: req.params.category })
            .sort('-updatedAt')
            .limit(5)
            .populate({ path: 'author', select: 'username _id'});

        // Send back recent posts    
        res.status(200).json(recentPosts);
    } catch (err) {
        // Something went wrong while fetching recent posts
        res.status(500).json(err);
    }
});

// GET single post
router.get('/:postId', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post not found." });
        }

        const post = await Post
            .findById(req.params.postId)
            .populate({ path: 'author', select: 'username _id'});

        res.status(200).json(post);
    } catch (err) {
        // Something went wrong while getting post
        res.status(500).json(err);
    }
});

// Edit post title and body
router.patch('/:postId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post not found." });
        }

        let post = await Post.findById(req.params.postId);

        if (!post) {
            res.status(404).json({ message: "Post not found." });
        } else if (!req.user._id.equals(post.author)) {
            res.status(401).json({ message: "Post does not belong to you." });
        } else if (!req.body.title || !req.body.body) {
            res.status(400).json({ message: "Must provide title and body of post." });
        } else {
            post.title = req.body.title;
            post.body = req.body.body;

            post.save()

            post = await post.populate({ path: 'author', select: 'username _id' }).execPopulate()

            res.status(200).json(post);
        }
    } catch (err) {
        // Something went wrong while updating post title and body
        res.status(500).json(err);
    }
});

// DELETE a post
router.delete('/:postId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post not found." });
        }

        let post = await Post.findById(req.params.postId);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        } else if (!req.user._id.equals(post.author)) {
            return res.status(401).json({ message: "Post does not belong to you." });
        } else {
            post.remove();

            await Comment.deleteMany({ postId: req.params.postId });
            
            res.status(200).json({ deleted: true });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Like/unlike post
router.patch('/:postId/like', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post not found." });
        }
        // Find post by id
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // if post is liked by user
        if (post.likes.indexOf(req.user._id) !== -1) {
            // unlike the post
            post.likes.pull(req.user._id);
            post.likesCount--;
        } else {
            // like the post
            post.likes.push(req.user._id);
            post.likesCount++;
        }
    
        post.save();

        // Send back updated post
        res.status(200).json(post);
    } catch (err) {
        // Something went wrong while liking/unliking post
        res.status(400).json(err);
    }
});


// Create comment on post
router.post('/:postId/comments', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post not found." });
        }

        // append logged in user's id to req.body
        req.body.author = req.user._id;
        // append postId to req.body
        req.body.postId = req.params.postId;

        // create new comment
        let comment = await Comment.create(req.body)
        // populate author field on new comment
        comment = await comment.populate({ path: 'author', select: 'username _id' }).execPopulate()

        await Post.findByIdAndUpdate(req.params.postId, { updatedAt: new Date() })

        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json(err)
    }
});

// edit comment
router.patch('/:postId/comments/:commentId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        let comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            res.status(404).json({ message: "Comment not found." });
        } else if (!req.user._id.equals(comment.author)) {
            res.status(401).json({ message: "Comment does not belong to you." });
        } else if (!req.body.body) {
            res.status(400).json({ message: "Must provide body of comment." });
        } else {
            comment.body = req.body.body;

            comment.save();

            comment = await comment.populate([
                { path: 'author', select: 'username _id' }, 
                { path: 'replies.author', select: 'username _id' }
            ]).execPopulate();

            res.status(200).json(comment);
        }
    } catch (err) {
        res.status(400).json(err)
    }
});

// delete comment
router.delete('/:postId/comments/:commentId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            res.status(404).json({ message: "Comment not found." });
        } else if (!req.user._id.equals(comment.author)) {
            res.status(401).json({ message: "Comment does not belong to you." });
        } else {
            comment.remove()
            res.status(200).json({ deleted: true });
        }
    } catch (err) {
        res.status(400).json(err)
    }
});

// GET post comments
router.get('/:postId/comments', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(404).json({ message: "Post comments not found." });
        }

        const { page = 1, sortBy = 'createdAt' } = req.query;
        const limit = 50;

        let comments = await Comment
            .find({ postId: req.params.postId })
            .sort(sortBy)
            .skip((page * limit) - limit)
            .limit(limit)
            .populate([
                { path: 'author', select: 'username _id' }, 
                { path: 'replies.author', select: 'username _id' }
            ]);

        res.status(200).json({
            nextPage: (comments.length >= limit),
            comments
        });
    } catch (err) {
        res.status(400).json(err)
    }
});

// Create reply to comment
router.post('/:postId/comments/:commentId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // append logged in user's id to req.body
        req.body.author = req.user._id;

        const comment = await Comment
            .findByIdAndUpdate(req.params.commentId, { 
                $push: { replies: req.body } 
            }, { new: true })
            .populate([
                { path: 'author', select: 'username _id' }, 
                { path: 'replies.author', select: 'username _id' }
            ]);

        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json(err)
    }
});

// Edit reply to comment
router.patch('/:postId/comments/:commentId/replies/:replyId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.replyId)) {
            return res.status(404).json({ message: "Reply not found." });
        }

        // Find comment with reply
        const comment = await Comment.findById(req.params.commentId);
        // Select reply
        const reply = comment.replies.id(req.params.replyId)

        if (!reply) {
            res.status(404).json({ message: "Reply not found." });
        } else if (!req.user._id.equals(reply.author)) {
            res.status(401).json({ message: "Reply does not belong to you." });
        } else if (!req.body.body) {
            res.status(400).json({ message: "Must provide body of reply." })
        } else {
            // assign new value to reply body
            reply.body = req.body.body;
            // save comment
            comment.save();
            // send back updated comment
            res.status(200).json(comment);
        }
    } catch (err) {
        res.status(400).json(err)
    }
});

// Delete reply to comment
router.delete('/:postId/comments/:commentId/replies/:replyId', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.replyId)) {
            return res.status(404).json({ message: "Reply not found." });
        }

        // Find comment with reply
        const comment = await Comment.findById(req.params.commentId);
        // Select reply
        const reply = comment.replies.id(req.params.replyId)

        if (!comment) {
            res.status(404).json({ message: "Comment not found." });
        } else if (!reply) {
            res.status(404).json({ message: "Reply not found." });
        } else if (!req.user._id.equals(reply.author)) {
            res.status(401).json({ message: "Reply does not belong to you." });
        } else {
            // delete reply
            comment.replies.pull(req.params.replyId)
            // save comment
            comment.save();

            res.status(200).json({ deleted: true });
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

// Like/unlike comment
router.patch('/:postId/comments/:commentId/like', requireAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Find comment by id
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // if comment is liked by user
        if (comment.likes.indexOf(req.user._id) !== -1) {
            // unlike the comment
            comment.likes.pull(req.user._id);
            comment.likesCount--;
        } else {
            // like the comment
            comment.likes.push(req.user._id);
            comment.likesCount++;
        }
    
        comment.save();

        // Send back updated comment
        res.status(200).json(comment);
    } catch (err) {
        // Something went wrong while liking/unliking comment
        res.status(400).json(err);
    }
});

module.exports = router;