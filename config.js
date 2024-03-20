const dotenv = require('dotenv');
dotenv.config();

module.exports={
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    API_BASE_URL: process.env.API_BASE_URL,
}