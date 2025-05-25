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
				`INSERT INTO finances (user_id, balance) VALUES (?, ?) 
           ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?`,
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
			const { user_id, date, food, restaurant, price } = JSON.parse(body);

			db.get(
				"SELECT balance FROM finances WHERE user_id = ?",
				[user_id],
				(err, row) => {
					if (err) {
						res.writeHead(500, {
							"Content-Type": "application/json",
						});
						return res.end(JSON.stringify({ error: "DB error" }));
					}
					if (!row || row.balance < price) {
						res.writeHead(400, {
							"Content-Type": "application/json",
						});
						return res.end(
							JSON.stringify({ message: "موجودی کافی نیست" })
						);
					}

					db.run(
						"INSERT INTO reservations (user_id, date, food, restaurant) VALUES (?, ?, ?, ?)",
						[user_id, date, food, restaurant],
						function (err) {
							if (err) {
								res.writeHead(500, {
									"Content-Type": "application/json",
								});
								return res.end(
									JSON.stringify({ error: "Insert error" })
								);
							}

							db.run(
								"UPDATE finances SET balance = balance - ? WHERE user_id = ?",
								[price, user_id],
								(err) => {
									if (err) {
										res.writeHead(500, {
											"Content-Type": "application/json",
										});
										return res.end(
											JSON.stringify({
												error: "Balance update failed",
											})
										);
									}
									res.writeHead(200, {
										"Content-Type": "application/json",
									});
									res.end(JSON.stringify({ success: true }));
								}
							);
						}
					);
				}
			);
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
