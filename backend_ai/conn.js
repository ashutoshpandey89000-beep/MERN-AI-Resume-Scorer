const mongoose = require('mongoose');


const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_screening';

mongoose.connect(mongoURI).then((res) => {
    console.log("Database Connected Successfully");
}).catch(err => {
    console.log("Something Error", err);
})