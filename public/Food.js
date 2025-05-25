const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost:27017/SignupAndLoginUsers", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));

const reserveSchema = new mongoose.Schema({
	userId: Number,
	reserveDate: Date,
	foodName: String,
	restaurantName: String,
	price: Number,
});

const Reserve = mongoose.model("Reserve", reserveSchema);

const server = http.createServer((req, res) => {
	if (req.url === "/" && req.method === "GET") {
		serveFile(
			path.join(__dirname, "public", "index.html"),
			"text/html",
			res
		);
	}

	// دریافت موجودی کاربر
	else if (req.url.startsWith("/api/balance/") && req.method === "GET") {
		const userId = req.url.split("/").pop();
		db.get(
			"SELECT balance FROM finances WHERE user_id = ?",
			[userId],
			(err, row) => {
				if (err) {
					res.writeHead(500, { "Content-Type": "application/json" });
					return res.end(JSON.stringify({ error: "DB Error" }));
				}
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ balance: row ? row.balance : 0 }));
			}
		);
	}

	// افزایش موجودی
	else if (req.url === "/api/balance/add" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			const data = JSON.parse(body);
			const { user_id, amount } = data;
			db.run(
				`INSERT INTO finances (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?`,
				[user_id, amount, amount],
				(err) => {
					if (err) {
						res.writeHead(500, {
							"Content-Type": "application/json",
						});
						return res.end(
							JSON.stringify({ error: "Update Failed" })
						);
					}
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ success: true }));
				}
			);
		});
	}

	// رزرو غذا
	else if (req.url === "/api/reserve" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			try {
				const { user_id, date, food, restaurant, price } =
					JSON.parse(body);

				Reserve.insertOne({
					userId: user_id,
					reserveDate: date,
					foodName: food,
					restaurantName: restaurant,
					price,
				});

        res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ message: "Reserve Successful!" }));
			} catch (error) {
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

	// دریافت رزروها
	else if (req.url.startsWith("/api/reservations/") && req.method === "GET") {
		const userId = req.url.split("/").pop();
		db.all(
			"SELECT * FROM reservations WHERE user_id = ?",
			[userId],
			(err, rows) => {
				if (err) {
					res.writeHead(500, { "Content-Type": "application/json" });
					return res.end(JSON.stringify({ error: "DB error" }));
				}
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(rows));
			}
		);
	}
});
