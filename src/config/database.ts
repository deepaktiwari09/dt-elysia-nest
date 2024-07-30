import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    let client = await mongoose.connect(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@indiancluster.yynfnzm.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=indianCluster`
    );
    console.log("====== MongoDB connected ======");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export { connectToDatabase };
