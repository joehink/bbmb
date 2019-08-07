const mongoose = require('mongoose');
const passport = require('passport');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const requireAuth = passport.authenticate('jwt', { session: false });

const categories = ['discussion', 'media', 'events', 'tour'];

module.exports = app => {
    // Create Post
    app.post('/api/posts/', requireAuth, async (req, res) => {
        try {
            if (!req.body.title || !req.body.body) {
                return res.status(400).json({ message: "Must provide title and body." });
            }

            if (!categories.includes(req.body.category)) {
                return res.status(400).json({ message: "Must provide valid category" });
            }

            // append logged in user's id to req.body
            req.body.author = req.user._id;

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
    app.get('/api/posts/category/:category', async (req, res) => {
        try {
            if (!categories.includes(req.params.category)) {
                return res.status(400).json({ message: "Must provide valid category" });
            }

            const { page = 1, sortBy = '-lastCommentAt' } = req.query;
            const limit = 25;

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
    app.get('/api/posts/category/:category/recent', async (req, res) => {
        try {
            if (!categories.includes(req.params.category)) {
                return res.status(400).json({ message: "Must provide valid category" });
            }
            // Find 5 most recent posts
            const recentPosts = await Post
                .find({ category: req.params.category })
                .sort('-createdAt')
                .limit(5)
                .populate({ path: 'author', select: 'username _id'});

            // Send back recent posts    
            res.status(200).json(recentPosts);
        } catch (err) {
            // Something went wrong while fetching recent posts
            res.status(500).json(err);
        }
    });

    // GET recent posts by a user 
    app.get('/api/posts/users/:userId/recent', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
                return res.status(404).json({ message: "User not found." });
            }
            // Find 5 most recent posts
            const recentPosts = await Post
                .find({ author: req.params.userId })
                .sort('-createdAt')
                .limit(5)
                .populate({ path: 'author', select: 'username _id'});

            // Send back recent posts    
            res.status(200).json(recentPosts);
        } catch (err) {
            // Something went wrong while fetching recent posts
            res.status(500).json(err);
        }
    });

    // GET posts by a user
    app.get('/api/posts/users/:userId', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
                return res.status(404).json({ message: "User not found." });
            }

            const { page = 1, sortBy = '-createdAt' } = req.query;
            const limit = 25;

            const posts = await Post
                .find({ author: req.params.userId })
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

    // GET search posts
    app.get('/api/posts/search/:searchTerm', async (req, res) => {
      try {
        const { page = 1, sortBy = '-lastCommentAt' } = req.query;
        const limit = 25;

        const posts = await Post
          .find({ $text: { $search : req.params.searchTerm } })
          .sort(sortBy)
          .skip((page * limit) - limit)
          .limit(limit)
          .populate({ path: 'author', select: 'username _id' });

        res.status(200).json({
          nextPage: (posts.length >= limit),
          posts
        });
      } catch (err) {
        res.status(500).json(err);
      }
    })

    // GET single post
    app.get('/api/posts/:postId', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
                return res.status(404).json({ message: "Post not found." });
            }

            const post = await Post
                .findById(req.params.postId)
                .populate({ path: 'author', select: 'username _id'});
            
            if (!post) {
                return res.status(404).json({ message: "Post not found." });
            }

            res.status(200).json(post);
        } catch (err) {
            // Something went wrong while getting post
            res.status(500).json(err);
        }
    });

    // Edit post title and body
    app.patch('/api/posts/:postId', requireAuth, async (req, res) => {
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
    app.delete('/api/posts/:postId', requireAuth, async (req, res) => {
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
    app.patch('/api/posts/:postId/like', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
                return res.status(404).json({ message: "Post not found." });
            }
            // Find post by id
            const post = await Post
              .findById(req.params.postId)
              .populate({
                path: 'author', 
                select: 'username _id' 
              });

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
    app.post('/api/posts/:postId/comments', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
                return res.status(404).json({ message: "Post not found." });
            }

            if (!req.body.body) {
                return res.status(400).json({ message: "Must provide body of comment." });
            }

            const post = await Post.findById(req.params.postId);

            if (!post) {
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

            // Set post.lastCommentAt to current date and time
            post.lastCommentAt = new Date();
            post.commentsCount++;

            // Save post
            post.save();

            res.status(200).json(comment);
        } catch (err) {
            res.status(400).json(err)
        }
    });

    // edit comment
    app.patch('/api/posts/:postId/comments/:commentId', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
                return res.status(404).json({ message: "Comment not found." });
            }

            let comment = await Comment
                .findById(req.params.commentId)
                .populate([
                    { path: 'author', select: 'username _id' }, 
                    { path: 'replies.author', select: 'username _id' }
                ]);

            if (!comment) {
                res.status(404).json({ message: "Comment not found." });
            } else if (!req.user._id.equals(comment.author._id)) {
                res.status(401).json({ message: "Comment does not belong to you." });
            } else if (!req.body.body) {
                res.status(400).json({ message: "Must provide body of comment." });
            } else {
                comment.body = req.body.body;

                comment.save();

                res.status(200).json(comment);
            }
        } catch (err) {
            res.status(400).json(err)
        }
    });

    // delete comment
    app.delete('/api/posts/:postId/comments/:commentId', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
                return res.status(404).json({ message: "Comment not found." });
            }

            const comment = await Comment.findById(req.params.commentId);

            await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentsCount: -1 } });

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
    app.get('/api/posts/:postId/comments', async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
                return res.status(404).json({ message: "Post comments not found." });
            }

            const { page = 1, sortBy = '-createdAt' } = req.query;
            const limit = 25;

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
    app.post('/api/posts/:postId/comments/:commentId', requireAuth, async (req, res) => {
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
    app.patch('/api/posts/:postId/comments/:commentId/replies/:replyId', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
                return res.status(404).json({ message: "Comment not found." });
            }

            if (!mongoose.Types.ObjectId.isValid(req.params.replyId)) {
                return res.status(404).json({ message: "Reply not found." });
            }

            // Find comment with reply
            const comment = await Comment
                .findById(req.params.commentId)
                .populate([
                    { path: 'author', select: 'username _id' }, 
                    { path: 'replies.author', select: 'username _id' }
                ]);
            // Select reply
            const reply = comment.replies.id(req.params.replyId);
            
            if (!reply) {
                res.status(404).json({ message: "Reply not found." });
            } else if (!req.user._id.equals(reply.author._id)) {
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
    app.delete('/api/posts/:postId/comments/:commentId/replies/:replyId', requireAuth, async (req, res) => {
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
    app.patch('/api/posts/:postId/comments/:commentId/like', requireAuth, async (req, res) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
                return res.status(404).json({ message: "Comment not found." });
            }

            // Find comment by id
            const comment = await Comment
              .findById(req.params.commentId)
              .populate([
                  { path: 'author', select: 'username _id' }, 
                  { path: 'replies.author', select: 'username _id' }
              ]);

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
}
