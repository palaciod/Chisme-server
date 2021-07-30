import pool from "../../databse.js";
class PostGres {
    static async insert(fieldValues,fields, values, table){
        try {
            const newPost = await pool.query(
              `INSERT INTO ${table} ${fields} VALUES${values} RETURNING *`,
              fieldValues
            );
            return newPost.rows[0];
          } catch (err) {
            console.error(err.message);
            return err.message;
          }
    }

    /**
     * Retrieves the first instance of data where the conditions of WHERE are met
     * @param {*} id 
     * @param {*} idString 
     * @param {*} table 
     * @returns 
     */

    static async get(id,idString,table){
        try{
            console.log(`This is my id: ${id}`);
            const post = await pool.query(`SELECT * FROM ${table} WHERE ${idString} = $1`, [id]);
            console.log(post.rows[0]);
            return post.rows[0];
        }catch(error){
            console.log(error);
            return error;
        }
    }

    /**
     * Retrieves all data given the condition of WHERE
     * @param {*} id 
     * @param {*} idString 
     * @param {*} table 
     * @returns 
     */
    static async getAll(id,idString,table){
        try{
            console.log(`This is my id: ${id}`);
            const post = await pool.query(`SELECT * FROM ${table} WHERE ${idString} = $1`, [id]);
            console.log(post.rows);
            return post.rows;
        }catch(error){
            console.log(error);
            return error;
        }
    }


    static async getWith(fieldValues,values,fields,table){
        try{
            const obj = await pool.query(`SELECT * FROM ${table} WHERE ${values} = ${fields}`, fieldValues);
            console.log(obj);
            return obj;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async deleteWith(fieldValues,values,fields,table){
        try{
            const like = await pool.query(`DELETE FROM ${table} WHERE ${values} = ${fields}`, fieldValues);
            console.log(like);
            return like;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async withinDistance(long, lat ,order , distance, geom, table){
        try{
            const post = await pool.query(`SELECT * FROM ${table} WHERE ST_DWITHIN(${geom}, ST_GeomFromText('POINT(${long} ${lat})'), ${distance}) ${order}`);
            return post.rows;
        }catch(error){
           console.log(error);
           return error; 
        }
    }

    static async update(fieldValues,id,fields,values,idString,table){
        try{
            fieldValues.push(id);
            console.log(fieldValues.length);
            const update = await pool.query(
                `UPDATE ${table} SET ${fields} = ${values} WHERE ${idString} = $${fieldValues.length}`,
                fieldValues
              );
            return update;
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async delete(id,idString,table){
        try{
            const post = await pool.query(`DELETE FROM ${table} WHERE ${idString} = $1`, [id]);
            return post;
        }catch(error){
            console.log(error);
            return post;
        }
    }
}

export default PostGres;