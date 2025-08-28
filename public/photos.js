const mongoose = require("mongoose");
const fs = require("fs");
const { Food } = require("../db");

async function saveStaticImage(restaurant, name, photo, price) {
	await mongoose.connect("mongodb://localhost:27017/SignupAndLoginUsers");

	const foodPhoto = new Food({
		name,
		restaurant,
		image: {
			data: fs.readFileSync(photo),
			contentType: "image/jpeg",
		},
		price,
	});

	await foodPhoto.save();
	console.log("Image saved to MongoDB!");
}

saveStaticImage( "رستوران سبحان" , "چلوکباب", "./image/food1.jpg", 85000);
saveStaticImage( "رستوران سبحان" , "قرمه سبزی", "./image/food2.jpg", 95000);
saveStaticImage( "سلف مرکزی (خواهران)" , "چلوکباب", "./image/food1.jpg", 15000);
saveStaticImage( "سلف مرکزی (خواهران)" , "قرمه سبزی", "./image/food2.jpg", 10000);
