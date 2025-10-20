const express = require('express');
const { loginAdmin } = require('../auth/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await loginAdmin(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
