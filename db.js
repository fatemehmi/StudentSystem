const { default: mongoose } = require("mongoose");

mongoose
	.connect("mongodb://localhost:27017/SignupAndLoginUsers", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));

// User
// Specifying Schema -- not essential
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	balance: Number,
});

// Creating model using Schema
const User = mongoose.model("User", userSchema);

// --------------------------------------------------------------------------------------

// Reserve
const reserveSchema = new mongoose.Schema({
	userId: String,
	reserveDate: Date,
	foodName: String,
	restaurantName: String,
	price: Number,
});

const Reserve = mongoose.model("Reserve", reserveSchema);

// --------------------------------------------------------------------------------------

// Food
const foodSchema = new mongoose.Schema({
	name: String,
	image: {
		data: Buffer,
		contentType: String,
	},
	price: Number,
});

const Food = mongoose.model("Food", foodSchema);

module.exports.User = User;
module.exports.Reserve = Reserve;
module.exports.Food = Food;
