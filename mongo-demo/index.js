const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true }) //add this because current url parser will be deprecated
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB..', err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, //boolean validation
        minlength: 5,
        maxlength: 255 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true, //automtically sets property value to lowercase
        //uppercase: true, //automtically sets property value to uppercase
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: { //custom validator
            isAsync: true, //async validator
            validator: function(v, callback){
                //do some async work
                setTimeout(() => {
                    const result = v && v.length > 0;
                    callback(result);
                }, 1000);
            },
            message: 'A course should have a least one tag!'
        }
    },
    date: { type:Date, default: Date.now },
    isPublished: Boolean,
    price: { 
        type: Number, 
        required: function() { return this.isPublished; }, //conditional function validation
        min: 10,
        max: 200,
        get: v => Math.round(v), //called you when the you read the value of a property
        set: v => Math.round(v) //called when you set the value of a property
    }
});

//class
const Course = mongoose.model('Course', courseSchema);

async function createCourse(){
    //object
    const course = new Course({
        name: 'Angular Course',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 15.8
    });
    try{
        const result = await course.save();//save promise
        console.log(result);//display result in console
    }
    catch(ex){
        for(field in ex.errors){
            console.log(ex.errors[field].message);
        }
    }
}

//**comparison operators**
    //eq (equal)
    //ne (not equal)
    //gt (greater than) eg. find({ price: { $gt: 10 } }) eg. combined operatorsfind({ price: { $gt: 10, $lte: 20 } })
    //gte (greather than or equal to)
    //lt (less than)
    //lte (less than or equal to)
    //in eg. find({ price: { $in: [10, 15, 20] } })
    //nin (not in)

//**logical operators**
//or eg. .or([ { author: 'Mosh' }, { isPublished: true } ])
//and eg. .and([ { author: 'Mosh' }, { isPublished: true } ])

//**Regulal Expessions** case sensative 
//Starts with Mosh eg. .find({ author: /^Mosh/ })
//Ends with Hamedani eg. .find({ author: /Hamedani$/ })
//Ends with Hamedani not case sensative eg. .find({ author: /Hamedani$/i })  i represents not case sensative
//Contains Mosh eg. .find({ author: /.*Mosh.*/ })

//**Pagination**
//const pageNumber = 2; const pageSize = 10; 
//.skip((pageNumber - 1) * pageSize)
//.limit(pageSize)

async function getCourses(){
    const courses = await Course
        .find({ _id: '5c574179fe34de30dcd19d6c' })
        .limit(10) //limits the amount returned
        .sort({ name: 1 }) // sort in ascending order, descending order -1
        .select({ name: 1, tags: 1, price: 1 }) //the fields that you want to include
        //.countDocuments(); .count() method will be deprecated
    console.log(courses[0].price);
}

//Approach: Query first
//findById()
//Modify its properties
//save()
// async function updateCourse(id){
//     const course = await Course.findById(id);
//     if(!course){
//         console.log('Could not find course with that id!')
//         return;
//     } 
//     course.isPublished = true;
//     course.author = 'Another Author';
//     const result = await course.save();
//     console.log(result);
// }

//Approach: Update document first
async function updateCourse(id){
    // const result = await Course.update({ _id: id }, {
    //     $set:{
    //         author: 'Mosh',
    //         isPublished: false
    //     }
    // });
    //console.log(result);
    
    //gets the document that was updated
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: false
        }
    }, { new:true });//will get updated document, if not it retrieve the document before it was modified
    console.log(course);
}

async function removeCourse(id){
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
}

//createCourse();
//getCourses();
//updateCourse('5c55a198e66e35083099a926');
//removeCourse('5c55a198e66e35083099a926');