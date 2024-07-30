import mongoose from "mongoose";

const toolsOutputSchema = new mongoose.Schema({
    description : String,
    title: String,
})

const toolsSchema = new mongoose.Schema({
    description: String,
    name: String,
    outputs: [toolsOutputSchema],
    toollink: String,
})

const skillSchema = new mongoose.Schema({
    description: String,
    experience: Number,
    imageUrl: String,
    name: String,
    tools: [toolsSchema],
});


const SkillModal = mongoose.model('skills', skillSchema);

export default SkillModal