const express = require("express");
const port = 5000;
const mongoose = require('mongoose');
const multer = require("multer")
const path = require('path');
const cors = require('cors');
const app = express();
const {MONGODB_URL, API_BASE_URL} = require('./config')


//DB CONNECTION
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', ()=> {
    console.log("DB Connected");
});

mongoose.connection.on('error', (error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.use(express.json());
app.use(cors());

// IMAGE STORAGE ENGINE
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`${API_BASE_URL}/images/${req.file.filename}`
    })
})


require('./Model/productModel')
require('./Model/userModel')


app.use(require('./Route/productRoute'))
app.use(require('./Route/userRoute'))


//listen api port
app.listen(port, ()=>{
    console.log("Server Running on Port" +port);
})
