import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI =
    "mongodb+srv://mustafamahmoud8510:SffrTPobH45NsgGA@cluster0.nbsms7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error.message);
    process.exit(1);
  }
};
