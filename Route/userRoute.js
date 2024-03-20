const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');
const fetchUser = require('../Middleware/User');
const UserModel = require('../Model/userModel');

// API FOR REGISTER
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "One or more fields are empty" });
        }

        // Check if the email is already registered 
        let check = await UserModel.findOne({ email: email });
        if (check) {
            return res.status(400).json({ success: false, error: "An existing user with the same email address already exists" });
        }

        // Initialize cart data
        let cart = {}; // Assuming you want an empty object for the cart
        for(let i = 0; i<300; i++){
            cart[i]=0;
        }

        // Hash the password before saving 
        const hashedPassword = await bcrypt.hash(password, 16);

        // Create a new user
        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            cartData: cart,
        });
        console.log(user);

        // Save the user to the DB
        await user.save();

        // Create JWT token
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, JWT_SECRET);
        console.log(token);

        res.json({ success: true, token, user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//API FOR LOGIN
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.status(400).json({ error: "One or more fields are empty" });
        }

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (user) {
            // Check if the password is correct
            const validPassword = bcrypt.compare(password, user.password);
            if (validPassword) {
                const data = { user: { id: user.id } }
                const token = jwt.sign(data, JWT_SECRET);
                res.json({ success: true, token });
            } else {
                res.json({ success: false, error: "Wrong Password" })
            }
        } else {
            res.json({ success: false, errors: "Wrong Email Id" })
        }
    } catch (error) {

    }
})

//API FOR ADDING PRODUCTS IN CARTDATA
router.post('/addtocart', fetchUser, async (req, res) => {
    // console.log(req.body, req.user);
    console.log("added", req.body.itemId);
    let userData = await UserModel.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await UserModel.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({ message: "added" });
})

//API FOR REMOVE CART DATA
router.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await UserModel.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId]>0) {

        userData.cartData[req.body.itemId] -= 1;
    }
    
    await UserModel.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({ message: "removed" });
})

router.post('/getcart', fetchUser, async (req, res) => {
    try {
        console.log("GetCart");
        let userData = await UserModel.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(userData.cartData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
