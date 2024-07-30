import mongoose from "mongoose";

const userReviews = new mongoose.Schema({
    review: String,
    userName: String,
});


const userStorySchema = new mongoose.Schema({
    problem: String,
    solution: String,
    userFlow: String,
    userReviews: [userReviews],
});


const UserStoryModal = mongoose.model('userStory', userStorySchema);

export default UserStoryModal