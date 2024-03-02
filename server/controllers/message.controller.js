import { pool } from "../db.js";

export const insertMessages = async (message) => {
    try{
        const [rows] = await pool.query(
            `INSERT INTO messages (message)
            VALUE (?);`, [message]
        )
       return rows.insertId
    }catch{
        return res.status(500).send({message: "hubo un problema"})
    }
}

export const getMessages = async (serverOffset) => {
    try{
        const [messages] = await pool.query(
            `SELECT * FROM messages
            WHERE id > ?;`, [serverOffset]
        )
        return messages
    }catch(e){
        console.error(e)
    }
}