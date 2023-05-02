/* eslint-disable */

const dotenv = require('dotenv');
const mongoose =  require('mongoose');
const fs =  require('fs');
const Tour =  require('../../modules/tourModule');
const User =  require('../../modules/userModule');
const Review =  require('../../modules/reviewModule');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

mongoose.connect(DB , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connection successful')
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json` , 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json` , 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json` , 'utf-8'));

const importData = async() => {
    try {
        await Tour.create(tours);
        // await User.create(users, {validateBeforeSave: true});
        // await Review.create(reviews);
        console.log('data successfully loaded!');
    } catch (error) {
        console.log(error)
    }
    process.exit(); 
}

const deleteData = async() => {
    try {
        await Tour.deleteMany();
        // await User.deleteMany();
        await Review.deleteMany();
        console.log('data successfully removed!');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);
