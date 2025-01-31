const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: String,
    comments: {type: Array},
    commentcount: {type: Number, default: 0}
})

bookSchema.pre('save', function(){
    this.commentcount = this.comments.length;
})


module.exports = mongoose.model('Book', bookSchema)