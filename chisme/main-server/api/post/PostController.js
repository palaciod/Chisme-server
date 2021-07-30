import express from "express";
import Post from "../../helpers/post/Post.js";
import Token from "../../helpers/tokens/Token.js";
const router = express.Router();
// Change
router.get("/", Token.authorizeToken, async (req, res) => {
    try{
      const {id} = req.query;
      const post = await Post.getPost(id);
      res.send(post);
    }catch(error){
      console.log(error);
      res.send(error);
    }

});

router.get("/near", Token.authorizeToken, Post.validateDistanceQuery, async (req,res) => {
    try{
      const {long, lat, distance, sort} = req.distanceFilter;
      const post = await Post.getNearyBy(long, lat, distance, sort);
      console.log(post);
      res.send(post);
    }catch(error){
      console.log(error);
      res.send(error);
    }

});

router.post("/new-post", Token.authorizeToken, Post.validatePostInput, async (req, res) => {
    try{
      const {title, post, userID, long, lat} = req.body;
      const score = 0; // New Posts will have a score of zero
      const geolocation = `point(${long} ${lat})`
      const fieldValues = [title, post, userID, geolocation, score]
      const obj = await Post.newPost(fieldValues);
      res.send(obj);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.put("/", Token.authorizeToken, Post.validatePostInput, async (req,res) => {
    try{
      const {title, post} = req.body;
      const {id} = req.query;
      const fieldValues = [title, post]
      const updatedPost = await Post.updatePost(fieldValues, id);
      res.send(updatedPost);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.delete("/delete", Token.authorizeToken, async (req, res) => {
    try{
      const {id} = req.query;
      const deletedPost = await Post.deletePost(id);
      res.send(deletedPost);
    }catch(error){
      console.log(error);
      res.send(error);
    } 
});


// Like REST

router.post("/like",Token.authorizeToken,  Post.validateLikesInput, async (req,res) => {
    try{
      const {likes} = req;
      const like_id = likes.post_id + "" + likes.userID;
      const fieldValues = [likes.post_id, likes.userID, likes.post_like, like_id];
      const like = await Post.likePost(fieldValues);
      console.log(like);
      res.send(like);
    }catch(error){
      console.log(error);
    }
});

router.get("/allLikes", Token.authorizeToken, Post.validatePostLikes,async (req,res) => {
    try{
      const {post_id} = req.post_id;
      const likes = await Post.getSize([post_id],"post_id", "chisme_post_likes");
      const returnValue = {size: likes["rowCount"], rows: {size: likes["rows"]}}
      console.log(returnValue);
      res.json(returnValue);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.get("/user-likes", async(req,res) => {
    try{
      // Get likes for user to show in history section 
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.get("/like", Token.authorizeToken, Post.validateGetLikeInput, async(req,res) => {
    try{
      const {like} = req;
      const fieldValues = [like.post_id, like.userID];
      const liked = await Post.getLike(fieldValues);
      console.log(liked);
      res.send(liked);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.put("/vote", Token.authorizeToken, Post.validateScoreInput, async(req,res) => {
    try{
      const {score} = req;
      const updateScore = await Post.updateScore([score.score], score.post_id);
      console.log(updateScore);
      res.send(updateScore);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.delete("/delete_like",Token.authorizeToken,  Post.validateGetLikeInput, async(req,res) => {
    try{
      const {like} = req;
      const fieldValues = [like.post_id, like.userID];
      const deletedLike = await Post.deleteLike(fieldValues);
      console.log(deletedLike);
      res.send(deletedLike);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

// Comment REST

router.post("/comment", Token.authorizeToken, Post.validateCommentInput, async (req,res) => {
  try{
    const {comment} = req;
    const score = 0; // New Comments will have a score of zero
    const fieldValues = [comment.post_id, comment.userID, comment.comment, score];
    const newComment = await Post.newComment(fieldValues);
    console.log(newComment);
    res.send(newComment);
  }catch(error){
    console.log(error);
  }
});

router.get("/comments", Token.authorizeToken, Post.validateCommentGet, async (req,res) => {
    try{
      const {post_id} = req.post_id;
      const comments = await Post.getComments(post_id);
      res.send(comments);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

router.delete("/delete-comment", Token.authorizeToken, Post.validateCommentDelete, async (req,res) => {
    try{
      const {comment_id} = req.comment_id;
      const deletedComment = await Post.deleteComment(comment_id);
      console.log(deletedComment);
      res.send(deletedComment);
    }catch(error){
      console.log(error);
      res.send(error);
    }
});

export default router;
