const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const bcrypt = require("bcrypt");
const { Food, User, Reserve } = require("./db");

// To read html and css files
function serveFile(filePath, contentType, res) {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Internal Server Error");
		} else {
			res.writeHead(200, { "Content-Type": contentType });
			res.end(data);
		}
	});
}

const server = http.createServer((req, res) => {
	// To load index.html
	if (req.url === "/" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "index.html"),
			"text/html",
			res
		);
	}

	// To load signup.html
	else if (req.url === "/signup" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "signup.html"),
			"text/html",
			res
		);
	}

	// To load login.html
	else if (req.url === "/login" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "login.html"),
			"text/html",
			res
		);
	}

	// To load dashboard.html
	else if (req.url === "/Dashboard" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "dashboard.html"),
			"text/html",
			res
		);
	}

	// To load food.html
	else if (req.url === "/Food" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "food.html"),
			"text/html",
			res
		);
	}

	// To request for food data
	else if (req.url === "/api/foods" && req.method === "GET") {
		Food.find()
			.then((foods) => {
				const foodsWithBase64Images = foods.map((food) => ({
					name: food.name,
					price: food.price,
					image: `data:${
						food.image.contentType
					};base64,${food.image.data.toString("base64")}`,
				}));
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(foodsWithBase64Images));
			})
			.catch((err) => {
				console.error("Error fetching foods:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({ message: "خطا در دریافت لیست غذاها" })
				);
			});
	}

	// To request for user data
	else if (req.url.startsWith("/api/user/") && req.method === "GET") {
		const userId = req.url.split("/")[3];

		if (!userId) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ message: "User ID is required" }));
			return;
		}

		User.findById(userId)
			.select("-password")
			.then((user) => {
				if (!user) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User not found" }));
					return;
				}
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(user));
			})
			.catch((err) => {
				console.error("Error fetching user by ID:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "خطا در دریافت کاربر" }));
			});
	}

	// To update user data
	else if (req.url.startsWith("/api/user/") && req.method === "PUT") {
		const userId = req.url.split("/")[3];

		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = JSON.parse(body);

				// Validate input
				if (!data.username || typeof data.username !== "string") {
					res.writeHead(400, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "نام کاربری معتبر نیست" })
					);
				}

				let updateFields;

				if (data.username) {
					updateFields = { username: data.username };
				}

				if (data.password) {
					const saltRounds = 10;
					const hashedPassword = await bcrypt.hash(
						data.password,
						saltRounds
					);
					updateFields.password = hashedPassword;
				}

				const updatedUser = await User.findByIdAndUpdate(
					userId,
					updateFields,
					{ new: true, runValidators: true }
				);

				if (!updatedUser) {
					res.writeHead(404, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "کاربر یافت نشد" })
					);
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "اطلاعات با موفقیت بروزرسانی شد",
					})
				);
			} catch (err) {
				console.error("Error updating user:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({ message: "خطا در بروزرسانی اطلاعات" })
				);
			}
		});
	}

	// To get reserves of day
	else if (req.url.startsWith("/api/reserves") && req.method === "GET") {
		const urlParts = new URL(req.url, `http://${req.headers.host}`);
		const userId = urlParts.searchParams.get("userId");
		const dateParam = urlParts.searchParams.get("date");

		const date = new Date(dateParam);

		Reserve.find({
			userId,
			reserveDate: date,
		})
			.then((reserves) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(reserves));
			})
			.catch((err) => {
				console.error("Error fetching reserves:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "خطا در دریافت رزروها",
						error: err.message,
					})
				);
			});
	}

	// To delete reserve
	else if (req.url.startsWith("/api/reserves/") && req.method === "DELETE") {
		const id = req.url.split("/").pop();

		Reserve.findByIdAndDelete(id)
			.then(() => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "رزرو حذف شد" }));
			})
			.catch((err) => {
				console.error("Error deleting reserve:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "حذف رزرو با خطا مواجه شد",
						error: err.message,
					})
				);
			});
	}

	// To get data from form in signup.html => user info : username , email , password
	else if (req.url === "/signup" && req.method === "POST") {
		// To gather user info and put them together
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		// Listening for end of req
		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { username, email, password } = data;

				// Checking user Existence
				const userExitence = await User.findOne({ username });

				if (userExitence) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User Exists!" }));
					return;
				}

				// Hashing password
				const hashedPassword = await bcrypt.hash(password, 10);
				const newUser = new User({
					username,
					email,
					password: hashedPassword,
				});

				// Saving data in db
				await newUser.save();

				// Sending result to front
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Signup Successful!" }));
			} catch (err) {
				// Sending error to front
				console.error("Signup Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Signup failed!",
						error: err.message,
					})
				);
			}
		});
	}

	// To get data from form in login.html => user info : username , password
	else if (req.url === "/login" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { username, password } = data;

				// Checking db for user
				const user = await User.findOne({ username });

				// Returning not found error if there is no user with given username
				if (!user) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "User Not Found!" }));
					return;
				}

				// Returning error if password is wrong
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "Wrong Password!" }));
					return;
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Login Successful!",
						id: user.id,
					})
				);
			} catch (err) {
				console.error("Login Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Login Failed!" }));
			}
		});
	}

	// To reserve food
	else if (req.url === "/api/Reserve" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = querystring.parse(body);
				const { userId, date, food, restaurant } = data;

				const foodDoc = await Food.findOne({ name: food });
				const price = foodDoc?.price;

				if (!foodDoc) {
					res.writeHead(404, { "Content-Type": "application/json" });
					return res.end(
						JSON.stringify({ message: "Food not found" })
					);
				}

				const newReserve = new Reserve({
					userId,
					reserveDate: new Date(date),
					foodName: food,
					restaurantName: restaurant,
					price,
				});

				await newReserve.save();

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Reserve Successful!" }));
			} catch (err) {
				console.error("Reserve Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "Reserve failed!",
						error: err.message,
					})
				);
			}
		});
	}

	// To load css files
	else if (req.url.endsWith(".css")) {
		serveFile(path.join(__dirname, "public", req.url), "text/css", res);
	}

	// To load images. It checks the extension and assign them to correct type of image.
	else if (req.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
		const ext = path.extname(req.url).toLowerCase();
		const types = {
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".svg": "image/svg+xml",
		};

		const filePath = path.join(__dirname, "public", req.url);
		const contentType = types[ext] || "application/octet-stream";
		serveFile(filePath, contentType, res);
	}

	// To load js files in public
	else if (req.url.endsWith(".js")) {
		serveFile(
			path.join(__dirname, "public", req.url),
			"application/javascript",
			res
		);
	}

	// To load js files out of public
	else if (req.url.endsWith(".js")) {
		serveFile(
			path.join(__dirname, "", req.url),
			"application/javascript",
			res
		);
	}

	// To update username and/or password
	else if (req.url === "/update-profile" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const data = JSON.parse(body);
				const { username, newPassword } = data;

				// This username is the new username user wants to set
				const existingUser = await User.findOne({ username });

				// Prevent duplication if user is trying to change their username
				if (existingUser && existingUser.username !== username) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({
							message: "این نام کاربری قبلاً ثبت شده است.",
						})
					);
					return;
				}

				// Get the current username from localStorage (sent manually in body or cookie in real apps)
				const currentUsername = req.headers["x-current-username"];
				const user = await User.findOne({ username: currentUsername });

				if (!user) {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ message: "کاربر یافت نشد." }));
					return;
				}

				// Update username if changed
				if (username && username !== currentUsername) {
					user.username = username;
				}

				// Update password if requested
				if (newPassword) {
					const hashedPassword = await bcrypt.hash(newPassword, 10);
					user.password = hashedPassword;
				}

				await user.save();

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({
						message: "پروفایل با موفقیت بروزرسانی شد.",
					})
				);
			} catch (err) {
				console.error("Update profile error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(
					JSON.stringify({ message: "خطا در بروزرسانی پروفایل." })
				);
			}
		});
	}

	// Default
	else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Page Not Found");
	}
});

// To listen for server on 3001 port
const PORT = 3001;
server.listen(PORT, () => {
	console.log("Server running at http://localhost:3001");
});
