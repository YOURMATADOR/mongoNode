const env = process.env.NODE_ENV || "desarollo";

if(env === "test"){
process.env.MONGODB_URI = "mongodb://localhost:27017/mogoseTest"
process.env.PORT = 3000;
}
else if (env === "desarollo"){
process.env.MONGODB_URI = "mongodb://localhost:27017/mogose"
process.env.PORT = 3000;

}