const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true }) //add this because current url parser will be deprecated
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB..', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type:Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

//class
const Course = mongoose.model('Course', courseSchema);

async function getCourses(){
    return await Course
        .find({ isPublished: true })
        .or([{ tags: 'frontend'}, { tags: 'backend' }])
        .sort({ price: -1 }) // sort in ascending order, descending order -1
        .select({ name: 1, author: 1, price: 1 }); //the fields that you want to include]
}

async function run(){
    const courses = await getCourses();
    console.log(courses);
}

run();