const mongoose = require("mongoose")


const Schema = mongoose.Schema

const categorySchema = new Schema({
    name:{type:String, required: true, maxlength: 20},
    description:{type:String},

})

categorySchema.virtual("url").get(function(){
    return `/catalog/category/${this._id}`
})

module.exports = mongoose.model("Category", categorySchema)