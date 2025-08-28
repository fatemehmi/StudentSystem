document
	.querySelector("#loginForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const data = new URLSearchParams(formData);

		fetch("/Login", {
			method: "POST",
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				alert(data.message);
				if (data.message === "Login Successful!") {
					window.location.href = "/Dashboard";
					localStorage.setItem("id", data.id);
				}
			})
			.catch((err) => {
				alert("Login Failed!");
				console.error(err);
			});
	});
