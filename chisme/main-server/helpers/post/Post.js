import PostGres from "../postgress/PostGres.js";
import Validator from "../Validator.js";
class Post extends PostGres{
    static fields = "(title,post,userid,geolocation,score,date)";
    static values = "($1,$2,$3,$4,$5,$6)";
    static table = "chisme_post";
    static postIdString = "post_id";
    static geoLocation = "geolocation";

    //chisme_posts_likes TABLE
    static likedPostsTable = "chisme_post_likes";
    static likedPostValues = "($1,$2,$3,$4,$5)";
    static likedPostFields = "(post_id,userid,post_like,like_id,date)";

    //chisme_post_comment TABLE
    static commentIdString = "comment_id";
    static commentTable = "chisme_post_comments";
    static commentValues = "($1,$2,$3,$4,$5)";
    static commentFields = "(post_id,userid,comment,score,date)";
    static async newPost(fieldValues){
        try {
            const date = new Date();
            fieldValues.push(date);
            const newPost = await this.insert(fieldValues, this.fields, this.values, this.table);
            return newPost;
          } catch (err) {
            console.error(err.message);
          }
    }
    
    static async getPost(id){
        try{
            const post = await this.get(id, Post.postIdString, Post.table);
            if(post === undefined) return [false, 'no post'];
            return post;
        }catch(error){
            console.log(error);
            res.send(error);
        }
    }
    static async updatePost(fieldValues, id){
        try{
            const updatedPost = await this.update(fieldValues,id, "(title,post)", "($1, $2)",this.postIdString,this.table);
            return updatedPost;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async updateScore(fieldValues, id){
        try{
            const updatedPost = await this.update(fieldValues,id, "score", "$1",this.postIdString,this.table);
            return updatedPost;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async deletePost(id){
        try{
            const deletedPost = await this.delete(id, Post.postIdString, Post.table);
            return deletedPost;
        }catch(error){
            console.log(error);
            return error;
        }
    }


    static async getNearyBy(long, lat, distance, sort){
        try{
            // Create some logic to handle order.. do we order by date or by score (popular or new)
            var filter = sort === "new" ? "ORDER BY date DESC" : "ORDER BY score DESC"
            const posts = await Post.withinDistance(long, lat, filter, distance, this.geoLocation, this.table);
            return posts;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async likePost(fieldValues){
        try{
            const date = new Date();
            fieldValues.push(date);
            const newLike = await this.insert(fieldValues, this.likedPostFields, this.likedPostValues, this.likedPostsTable);
            return newLike;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async getAllLikesForPost(id){
        try{
            const likes = await this.get(id, this.postIdString, this.likedPostsTable);
            if(likes === undefined) return [false, 'no post'];
            return likes;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async getLike(fieldValues){
        try{
            const like = await this.getWith(fieldValues,"(post_id, userid)", "($1,$2)", this.likedPostsTable); 
            if(like["rows"][0] === undefined) return [false, 'no likes found'];
            return like["rows"][0];
        }catch(error){
            console.log(error);
            return error;
        }
    }
    static async getLikesByUserId(id){
        try{
            const likes = await this.getAll(id, "userid", Post.likedPostsTable);
            return likes.rows;
        }catch(error){
            console.log(error);
            return error;
        }
    }
    static async getSize(fieldValues){
        try{
            const like = await this.getWith(fieldValues,"(post_id)", "($1)", this.likedPostsTable); 
            if(like["rows"] === undefined) return [false, 'no comments found'];
            return like;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async deleteLike(fieldValues){
        try{
            const deletedLike = await this.deleteWith(fieldValues,"(post_id, userid)", "($1,$2)", this.likedPostsTable); 
            return deletedLike;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async newComment(fieldValues){
        try{
            const date = new Date();
            fieldValues.push(date);
            const newComment = await this.insert(fieldValues, this.commentFields, this.commentValues, this.commentTable);
            return newComment;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async getComments(id){
        try{
            // Need to get the comments associated with the post.. will need to
            const comment = await this.getAll(id, Post.postIdString, this.commentTable); 
            if(comment === undefined) return [false, 'no comments found'];
            return comment;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async deleteComment(id){
        try{
            const deletedComment = await this.delete(id, Post.commentIdString, Post.commentTable);
            return deletedComment;
        }catch(error){
            console.log(error);
            return error;
        }
    }


    // Some proir validation before making a call... should simplify this. A lot of code smell

    static validatePostInput(req, res, next){
        const {title, post, userID, long, lat} = req.body;
        const fields = {title: title, post: post, userID: userID, long: long, lat: lat}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "post", fields, req, res, next);
    }
    static validateScoreInput(req, res, next){
        const {post_id, score} = req.body;
        const fields = {post_id: post_id, score: score}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "score", fields, req, res, next);
    }

    static validateLikesInput(req, res, next){
        const {post_id, userID, post_like} = req.body;
        const fields = {post_id: post_id, post_like: post_like, userID: userID}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "likes", fields, req, res, next);
    }
    static validateGetLikeInput(req, res, next){
        const {post_id, userID} = req.query;
        const fields = {post_id: post_id, userID: userID}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "like", fields, req, res, next);
    }
    static validatePostLikes(req, res, next){
        const {post_id} = req.query;
        const fields = {post_id: post_id}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "post_id", fields, req, res, next);
    }

    static validateCommentInput(req, res, next){
        const {post_id, userID, comment} = req.body;
        const fields = { post_id: post_id, userID: userID, comment: comment}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "comment", fields, req, res, next);
    }

    static validateCommentGet(req, res, next){
        const {post_id} = req.query;
        const fields = { post_id: post_id}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "post_id", fields, req, res, next);
    }
    static validateCommentDelete(req, res, next){
        const {comment_id} = req.query;
        const fields = { comment_id: comment_id}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "comment_id", fields, req, res, next);
    }

    static validateDistanceQuery(req,res,next){
        const {long, lat, distance, sort} = req.query;
        const fields = {long: long, lat: lat, distance: distance, sort: sort}
        let result = Validator.validateAllFields(fields, res);
        Validator.validateInput(result, "distanceFilter", fields, req, res, next);
    }
    

    
}

export default Post;