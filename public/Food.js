// const id = localStorage.getItem("id");

// Fetch Food data
document.addEventListener ("DOMContentLoaded" , () => {
  fetch("/api/foods")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("food-list");
      data.forEach((food, index) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "food";
        input.id = `food-${index}`;
        input.value = food.name;
        input.style.display = "none";
  
        const label = document.createElement("label");
        label.classList.add("food-item");
        label.setAttribute("for", `food-${index}`);
  
        const img = document.createElement("img");
        img.src = food.image;
  
        const p = document.createElement("p");
        p.textContent = food.name;
  
        const span = document.createElement("span");
        span.textContent = `${Number(food.price).toLocaleString()} تومان`;
  
        label.appendChild(img);
        label.appendChild(p);
        label.appendChild(span);
  
        container.appendChild(input);
        container.appendChild(label);
      });
    })
    .catch((error) => console.error("Error loading food data:", error));
})

// Reserve
document.getElementById('ReserveForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const selectedFoodInput = document.querySelector('input[name="food"]:checked');
  if (!selectedFoodInput) {
    alert("لطفاً یک غذا انتخاب کنید");
    return;
  }

  const food = selectedFoodInput.value;

  const userId = localStorage.getItem("id");
  const date = document.getElementById('date').value;
  const restaurant = document.getElementById('restaurant').value;

  fetch('/api/Reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, date, food, restaurant, price }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((err) => {
      console.error('Error:', err);
      alert('رزرو با مشکل مواجه شد');
    });
});


// // Allow selecting a food item
// document.querySelectorAll('.food-item').forEach((item) => {
//   item.addEventListener('click', () => {
//     document.querySelectorAll('.food-item').forEach((el) => el.classList.remove('selected'));
//     item.classList.add('selected');

//   });
// });

// const server = http.createServer((req, res) => {
// 	if (req.url === "/" && req.method === "GET") {
// 		serveFile(
// 			path.join(__dirname, "public", "index.html"),
// 			"text/html",
// 			res
// 		);
// 	}

//   else if (req.url === "/Food" && req.method === "GET") {
// 		serveFile(
// 			path.join(__dirname, "public", "food.html"),
// 			"text/html",
// 			res
// 		);
// 	}

// 	// دریافت موجودی کاربر
// 	else if (req.url.startsWith("/api/balance/") && req.method === "GET") {
// 		const userId = req.url.split("/").pop();
// 		db.get(
// 			"SELECT balance FROM finances WHERE user_id = ?",
// 			[userId],
// 			(err, row) => {
// 				if (err) {
// 					res.writeHead(500, { "Content-Type": "application/json" });
// 					return res.end(JSON.stringify({ error: "DB Error" }));
// 				}
// 				res.writeHead(200, { "Content-Type": "application/json" });
// 				res.end(JSON.stringify({ balance: row ? row.balance : 0 }));
// 			}
// 		);
// 	}

// 	// افزایش موجودی
// 	else if (req.url === "/api/balance/add" && req.method === "POST") {
// 		let body = "";
// 		req.on("data", (chunk) => {
// 			body += chunk.toString();
// 		});
// 		req.on("end", () => {
// 			const data = JSON.parse(body);
// 			const { user_id, amount } = data;
// 			db.run(
// 				`INSERT INTO finances (user_id, balance) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = balance + ?`,
// 				[user_id, amount, amount],
// 				(err) => {
// 					if (err) {
// 						res.writeHead(500, {
// 							"Content-Type": "application/json",
// 						});
// 						return res.end(
// 							JSON.stringify({ error: "Update Failed" })
// 						);
// 					}
// 					res.writeHead(200, { "Content-Type": "application/json" });
// 					res.end(JSON.stringify({ success: true }));
// 				}
// 			);
// 		});
// 	}

// 	// رزرو غذا
// 	else if (req.url === "/Food" && req.method === "POST") {
// 		let body = "";
// 		req.on("data", (chunk) => {
// 			body += chunk.toString();
// 		});
// 		req.on("end", () => {
// 			try {
// 				const { date, food, restaurant, price } =
// 					JSON.parse(body);

//           const user = User.findOne({username})

// 				const newReserve = new Reserve({
// 					userId: user.id,
// 					reserveDate: date,
// 					foodName: food,
// 					restaurantName: restaurant,
// 					price,
// 				});

//         newReserve.save();

// 				res.writeHead(200, { "Content-Type": "application/json" });
// 				res.end(JSON.stringify({ message: "Reserve Successful!" }));
// 			} catch (error) {
// 				console.error("Reserve Error:", err);
// 				res.writeHead(500, { "Content-Type": "application/json" });
// 				res.end(
// 					JSON.stringify({
// 						message: "Reserve failed!",
// 						error: err.message,
// 					})
// 				);
// 			}
// 		});
// 	}

// 	// دریافت رزروها
// 	else if (req.url.startsWith("/api/reservations/") && req.method === "GET") {
// 		const userId = req.url.split("/").pop();
// 		db.all(
// 			"SELECT * FROM reservations WHERE user_id = ?",
// 			[userId],
// 			(err, rows) => {
// 				if (err) {
// 					res.writeHead(500, { "Content-Type": "application/json" });
// 					return res.end(JSON.stringify({ error: "DB error" }));
// 				}
// 				res.writeHead(200, { "Content-Type": "application/json" });
// 				res.end(JSON.stringify(rows));
// 			}
// 		);
// 	}
// });
