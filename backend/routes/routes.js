const express = require('express');
const historyModel = require('../model/chatHistory');
const eventsModel = require('../model/events');
const router = express.Router();

//Add new message
router.post('/chat/newMessage', (req,res,next) =>{
    let newMsg = historyModel({
        room: req.body.room,
        timestamp: req.body.timestamp,
        sender: req.body.user,
        message: req.body.msg
    });
    newMsg.save((err)=>{
        if(err) throw err;
        console.log(`Message from: ${this.sender} recorded!`);
    });
    res.send(newMsg);
});
//GET chat history
router.get('/chat/:user',(req,res,next) => {
    console.log(`GET: Chat History for Username ${req.params.user}`);
    historyModel.find({sender: req.params.user},(err,history)=>{
        if(err) throw err;
        res.send(history);
    });
});

router.get('/chat/:room',(req,res,next)=>{
    console.log(`GET: Chat History for Room ${req.params.room}`);
    historyModel.find({room: req.params.room},(err,history)=>{
        if(err) throw err;
        res.send(history);
    });
});

//event routes
router.post('/event/newEvent', (req,res,next) =>{
    let newEvent = eventsModel({
        type: req.body.type,
        date: req.body.date,
        time: req.body.time,
        user: req.body.user
    });
    newEvent.save((err)=>{
        if(err) throw err;
        console.log("Event recorded!");
    });
    res.send(newEvent);
});
//Events GET
router.get('/event/get/all',(req,res,next)=>{
    console.log(`GET: list o' events!`);
    eventsModel.find({}, (err,events)=>{
        if(err) throw err;
        res.send(events);
    });
});

module.exports = router;