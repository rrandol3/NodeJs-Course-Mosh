const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  // author: {
  //   type: authorSchema,
  //   required: true   
  // } //embedded or sub document
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
  //const course = await Course.findById(courseId);
  const course = await Course.update({ _id: courseId }, { //allows for modifing the exact property
    $unset: {
      'author': ''
    }
  });
  // course.author.name = 'Mosh Hamedani';
  // course.save();
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function remvoveAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'John' })
// ]);
//updateAuthor('5c59cb599bd16a216446a2db');

//addAuthor('5c59d47143d51d144c06eca1', new Author({ name: 'Reggie' }));
remvoveAuthor('5c59d47143d51d144c06eca1', '5c59d572a32e09465417202e');