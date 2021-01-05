import db from '../../db/Database';

export default class ChatRepository {

    static insert(params) {
        try {
            const sql = `INSERT INTO chat 
                            (c_id, c_topic , c_time, c_user_id, c_msg, c_msg_type) 
                        VALUES 
                            (?, ?, ?, ?, ?, ?)`;
            const sqlParams = [
                params.id,
                params.topic,
                params.msgTime,
                params.user,
                params.msg,
                params.msgType,
            ];
            db.execute(sql, sqlParams);
        } catch (error) {
            console.log(error);
        }
    }

    static getAllMsgByTopic(topic) {
        const sql = `SELECT * FROM chat
                         WHERE c_topic = ?
                         ORDER BY c_id`;

        return new Promise((resolve) => {
            db.select(sql, [topic]).then((results) => {

                const messages = [];
                const len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    const message = {
                        id: row.c_id,
                        ui: row.c_user_id,
                        message: row.c_msg,
                        type: row.c_msg_type,
                    };
                    messages.push(message);
                }

                resolve(messages);
            }).catch((err) => {
                console.log(err);
                resolve([]);
            });
        });


    }
}
