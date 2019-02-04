//Trade off between query performance vs consistency

//Using References (Normalization) -> **Consistency**
let author = {
    id: 1,
    name: 'Mosh'
}

let course = {
    author: 'id' //references the id from author
}

//Using Embedded Documents (Denormalization) -> **Performance**
let course = {
    author: { //embedded author document/object
        name: 'Mosh'
    }
}

//Hybrid, allows for embedding a small number properties from another document/object
let author = {
    id: 1,
    name: 'Mosh'
    //50 other properties
}

let course = {
    author:{
        id: 'ref',
        name: 'Mosh'
    }
}