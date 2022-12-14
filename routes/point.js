/* eslint-disable */
const express = require('express');

const router = express.Router();

const { getPoint, addPoint, getMorePoints } = require('../models/users');
// get user data 
router.get('/', (req, res) => {
    console.log(getPoint(req.session.user_id))
    return res.json(getPoint(req.session.user_id))
});
//add point to user
router.post('/', (req, res) => {
    console.log(req.body.nbePoint,req.body.nbeErreu)
    const user_id = req.session.user_id;
    const nbePoint = req?.body?.nbePoint?.length !== 0 ? req.body.nbePoint : undefined;
    const nbeErreu =req?.body?.nbeErreu?.length !== 0 ? req.body.nbeErreu : undefined;
    if(!nbePoint || !nbeErreu) return res.sendStatus(400);
    return res.json(addPoint(nbePoint,nbeErreu,user_id))
});

// get top 10 points
router.get('/getMorePoints', (req, res) => {
    const points = getMorePoints().slice(0,10);
 
    return res.json(points)

});

// get top 3
router.get('/getTop3', (req, res) => {
    const points = getMorePoints().slice(0,3);
    console.log(points)
    return res.json({login : points.username , point : points.nbePoint})

});

module.exports = router;