const express = require('express');
const Video = require('../models/Video');
const User = require('../models/User');

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({ status: 'Running', videoPlayer: global.videoPlayer });
});

router.post('/videos', async(req, res) => {
    try {
        const raw = req.fields.videos;
        const videoList = JSON.parse(raw).videos;
        console.log(videoList);
        await Promise.all(videoList.map(video => Video.create(video)));
        res.status(200).json({ success: true });
    } catch (err) {
        console.log("err");
        res.status(400).json({ success:false, error: err.message });
    }
});

router.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        console.log(users);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
    
});

router.post('/user', async(req, res) => {
    try {
        const raw = req.fields.user;
        const userData = JSON.parse(raw);
        console.log(userData.name);
        await User.create({username: userData.name});
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.delete('/user/:id', async(req, res) => {
    try {
        const userDeleted = await User.findByIdAndDelete(req.params.id);

        if (!userDeleted) {
            res.status(404).json({ success: false,  message: 'User not found'});
        }

        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

module.exports = router;