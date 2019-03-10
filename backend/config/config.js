module.exports = {
    mongoURI:"mongodb+srv://comp3133:24KYpgEkd7Fk0tTM@comp3133-tlxi5.mongodb.net/chat_archive",
    dbPort: 4000,
    appPort: 3000,
    baseURL: `http://localhost:`,
    events: {
        conn: "CONNECTION",
        disconn:"DISCONNECT",
        msg: "MESSAGE",
        err: "ERROR",
        namechange: "NAME_CHANGE"
    }
};