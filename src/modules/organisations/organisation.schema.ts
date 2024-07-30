import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    current: Boolean,
    endDate: String,
    position: String,
    responsibility: String,
    startDate: String,
})

const organizationSchema = new mongoose.Schema({
    description: String,
    jobs: [jobsSchema],
    location: String,
    name: String,
    products: [String],
    size: Number,
    website: String,
});


const OrganizationModel = mongoose.model('organisations', organizationSchema);

export default OrganizationModel