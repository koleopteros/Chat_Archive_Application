const express = require('express');
const historyModel = require('../model/chatHistory');
const eventsModel = require('../model/events');
const router = express.Router();

//Add new message
router.post('/chat/newMessage', (req,res,next) =>{
    let newMsg = historyModel({
        room: req.body.room,
        timestamp: req.body.timestamp,
        sender: req.body.sender,
        message: req.body.message
    });
    newMsg.save((err)=>{
        if(err) throw err;
        console.log(`Message from: ${req.body.sender} recorded!`);
    });
    res.send(newMsg);
});
//GET chat history
router.get('/chat/all',(req,res,next) => {
    console.log('GET: All chat history');
    historyModel.find({}, (err,history) => {
        if (err) throw err;
        res.json(history)
    })
})
router.get('/user/:user',(req,res,next) => {
    console.log(`GET: Chat History for Username ${req.params.user}`);
    historyModel.find({sender: req.params.user},(err,history)=>{
        if(err) throw err;
        res.json(history);
    });
});
router.get('/room/:room',(req,res,next)=>{
    console.log(`GET: Chat History for Room ${req.params.room}`);
    historyModel.find({room: req.params.room},(err,history)=>{
        if(err) throw err;
        res.json(history);
    });
});

//event routes
router.post('/event/newEvent', (req,res,next) =>{
    let newEvent = eventsModel({
        type: req.body.type,
        timestamp: req.body.timestamp,
        user: req.body.user,
        val: req.body.val,
    });
    newEvent.save((err)=>{
        if(err) throw err;
        console.log(`${req.body.type} Event Recorded!`);
    });
    res.send(newEvent);
});
//Events GET
router.get('/event',(req,res,next)=>{
    console.log(`GET: list o' events!`);
    eventsModel.find({}, (err,events)=>{
        if(err) throw err;
        res.json(events);
    });
});

module.exports = router;