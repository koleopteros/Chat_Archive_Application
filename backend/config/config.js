let dbport;
let appPort;
let baseUrl;

if( process.env.NODE_ENV === "production" ){
    //dbport = process.env.PORT;
    appPort = process.env.PORT;
    baseUrl = "https://chat-archive-application.herokuapp.com" 
}else{
    dbport = 4000;
    appPort = 3000;
    baseUrl = "http://localhost"
}
    
module.exports = {
    mongoURI: process.env.mongoURL || "mongodb+srv://comp3133:24KYpgEkd7Fk0tTM@comp3133-tlxi5.mongodb.net/chat_archive",
    dbPort: dbport,
    appPort: appPort,
    baseURL: baseUrl,
    events: {
        conn: "CONNECTION",
        disconn:"DISCONNECT",
        msg: "MESSAGE",
        err: "ERROR",
        namechange: "NAME_CHANGE",
    },
};