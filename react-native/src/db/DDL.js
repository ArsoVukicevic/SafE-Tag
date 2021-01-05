export const chatDDL = `CREATE TABLE IF NOT EXISTS chat 
                        (
                            c_id INTEGER NOT NULL,  
                            c_topic VARCHAR NOT NULL,
                            c_time VARCHAR NOT NULL,
                            c_user_id INTEGER NOT NULL,  
                            c_msg VARCHAR NOT NULL,  
                            c_msg_type INTEGER NOT NULL,
                            CONSTRAINT pk_c_id__c_tag_id PRIMARY KEY (c_id, c_topic)
                        )`;
