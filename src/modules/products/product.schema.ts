import mongoose from "mongoose";

const productStorySchema = new mongoose.Schema({
    name: String,
    url: String,
})

const productSchema = new mongoose.Schema({
    blueprint: String,
    description: String,
    images: [String],
    name: String,
    skills: [String],
    stores: [productStorySchema],
    userStory: [String],
});


const ProductModal = mongoose.model('products', productSchema);

export default ProductModal