let URI = process.env.NODE_ENV === "production"
    ?'https://evening-meadow-17316.herokuapp.com/'
    :'http://localhost:4000';
/*
Mongo uri
mongodb+srv://comp3133:24KYpgEkd7Fk0tTM@comp3133-tlxi5.mongodb.net/chat_archive
*/

module.exports = {
    mongoURI:process.env.MONGO_URI,
    dbPort: process.env.PORT||4000,
    appPort: process.env.PORT||3000,
    baseURL: URI,
    events: {
        conn: "CONNECTION",
        disconn:"DISCONNECT",
        msg: "MESSAGE",
        err: "ERROR",
        namechange: "NAME_CHANGE"
    },
};