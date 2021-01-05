import SQLite from 'react-native-sqlite-storage';
import { chatDDL } from './DDL';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'safEtag.db';
const database_version = '1.0';
const database_displayname = 'SQLite React Offline Database';
const database_size = 200000;


class Database {

    constructor() {
        console.log('Database::constructor');
        this.db = this.initDB();
    }


    initDB() {
        let db;
        return new Promise((resolve) => {
            SQLite.echoTest().then(() => {
                console.log('Integrity check passed ...');
                console.log('Opening database ...');
                SQLite.openDatabase(
                    database_name,
                    database_version,
                    database_displayname,
                    database_size
                ).then(DB => {
                    db = DB;
                    console.log('Database OPEN');
                    // db.executeSql('DROP TABLE chat');
                    db.executeSql('SELECT 1 FROM chat LIMIT 1')
                        .then(() => {
                            console.log('Database is ready ... executing query ...');
                        }).catch((error) => {
                            console.log('Received error: ', error);
                            console.log('Database not yet ready ... populating data');
                            db.transaction((tx) => {
                                tx.executeSql(chatDDL);
                            }).then(() => {
                                console.log('Table created successfully');
                            }).catch(error => {
                                console.log(error);
                            });
                        });

                    resolve(db);
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
                console.log('echoTest failed - plugin not functional');
            });
        });
    }

    select(sql, params = []) {
        return new Promise((resolve) => {
            this.db.then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(sql, params)
                        .then(([tx, results]) => {
                            resolve(results);
                        });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    execute(sql, params = []) {
        return new Promise((resolve) => {
            this.db.then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(sql, params).then(([tx, results]) => {
                        resolve(results);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }
}

const db = new Database();
export default db;
