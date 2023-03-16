/* eslint-disable */

const dotenv = require('dotenv');
const mongoose =  require('mongoose');
const fs =  require('fs');
const Tour =  require('../../modules/tourModule');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD);

mongoose.connect(DB , {
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('connection successful')
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json` , 'utf-8'));

const importData = async() => {
    try {
        await Tour.create(tours);
        console.log('data successfully loaded!');
    } catch (error) {
        console.log(error)
    }
    process.exit();
}

const deleteData = async() => {
    try {
        await Tour.deleteMany();
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
