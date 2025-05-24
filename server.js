const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const bcrypt = require("bcrypt");

// Creating mongodb server
mongoose
	.connect("mongodb://localhost:27017/SignupAndLoginUsers", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));

// Specifying Schema -- not essential
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
});

// Creating model using Schema
const User = mongoose.model("User", userSchema);

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
		serveFile(path.join(__dirname, "public", "index.html"), "text/html", res);
	}
  
	// To load signup.html
  else if (req.url === "/signup" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "signup.html"), "text/html", res);
	}
  
	// To load login.html
  else if (req.url === "/login" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "login.html"), "text/html", res);
	}
  
	// To load dashboard.html
  else if (req.url === "/Dashboard" && req.method === "GET") {
		serveFile(path.join(__dirname, "public", "dashboard.html"), "text/html", res);
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
				const userExitence = await User.findOne({username});

				if(userExitence) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({ message: "User Exists!" })
					);
					return;
				}
	
				// Hashing password
				const hashedPassword = await bcrypt.hash(password, 10);
				const newUser = new User({ username, email, password: hashedPassword });
	
				// Saving data in db
				await newUser.save();
	
				// Sending result to front
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Signup Successful!" }));

			} catch (err) {
				// Sending error to front
				console.error("Signup Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Signup failed!", error: err.message }));
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
					res.end(
						JSON.stringify({ message: "User Not Found!" })
					);
					return;
				}

				const email = user.email;

				// Returning error if password is wrong
				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					res.writeHead(400, { "Content-Type": "application/json" });
					res.end(
						JSON.stringify({ message: "Wrong Password!" })
					);
					return;
				}

				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Login Successful!" , username , email}));
			} catch (err) {
				console.error("Login Error:", err);
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Login Failed!" }));
			}
		});
	}
  
	// To load css files
  else if (req.url.endsWith(".css")) {
		serveFile(path.join(__dirname, "public", req.url), "text/css", res);
	}
  
	// To load images
  else if (req.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
		const ext = path.extname(req.url).substring(1);
		serveFile(path.join(__dirname, "public", req.url), `image/${ext}`, res);
	}
  
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
