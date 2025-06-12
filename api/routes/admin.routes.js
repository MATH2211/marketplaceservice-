const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const path = require("path");

router.post('/register', adminController.register);


router.get("/register", (req,res) =>{
    res.send("teste");
});
router.post('/login', adminController.login);

/*
router.get("/login", (req, res) => {
    const caminho = path.join(__dirname, "../../web/pages/login.html");
    console.log(caminho);
    res.sendFile(caminho);
});  
*/
module.exports = router;
