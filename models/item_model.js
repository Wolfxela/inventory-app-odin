const mongoose = require("mongoose")

const Schema = mongoose.Schema

const itemSchema = new Schema({
    name:{type:String, required: true, maxlength: 20},
    category:[{type: Schema.Types.ObjectId, ref:"Category"}],
    description:{type:String},
    price:{type: Number, required:true , min:1},
    stock:{type: Number, required:true,min:1},

})

itemSchema.virtual("url").get(function(){
    return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Item",itemSchema)