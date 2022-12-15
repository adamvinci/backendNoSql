/* eslint-disable camelcase */

const express = require('express');

const router = express.Router();

const Message = require('../models/messages')

router.get('/', (req, res) => res.json({ message: Message.list(req.session.user_id)}));


router.post('/addMessageUser', (req, res) => {
    const {user_id} = req.session;
    const content = req?.body?.content?.length !== 0 ? req.body.content : undefined;
    const type =req?.body?.type?.length !== 0 ? req.body.type : undefined;
    if(!content || !type) return res.sendStatus(400);
    const data = { user_id, type, content }

    return res.json({ newMessage: Message.saveUserMessage(data) })

});

router.post('/addMessageVisitor', (req, res) => {
    const content = req?.body?.content?.length !== 0 ? req.body.content : undefined;
    const type =req?.body?.type?.length !== 0 ? req.body.type : undefined;
    if(!content || !type) return res.sendStatus(400);
    const data = { type, content }
    return res.json({ newMessage: Message.saveVisitorMessage(data) })

});

router.delete('/:id', (req, res) => {
    const idMessage = req?.params?.id
    const message = Message.deleteOnemessage(idMessage,req.session.user_id);
    if(!message) return res.sendStatus(401);
    return res.json(message);
});

router.patch('/:id', (req, res) => {
    const content = req?.body?.content?.length !== 0 ? req.body.content : undefined;
    const type =req?.body?.type?.length !== 0 ? req.body.type : undefined;
    const idMessage = req?.params?.id
    if(!content && !type) return res.sendStatus(400);
    const message = Message.updateOneMessage(idMessage,req.session.user_id,req.body);
    if (!message) return res.sendStatus(401);
    return res.json(message);
  });
module.exports = router;