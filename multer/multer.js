// const multer = require("multer")

// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename:(req, file, cb)=>{
//         return cb(null, `${file.fieldname}_${Data.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({storage:storage})

// // Creating Upload Endpoint for images
// app.use('/images', express.static('upload/images'))

// app.post('/upload', upload.single('product'),(req,res)=>{
//     res.json({
//         success:1,
//         image_url:`http://localhost:5000/images/${req.file.filename}`
//     })
// })