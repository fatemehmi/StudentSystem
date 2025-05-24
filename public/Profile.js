const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
    console.log("Logged in as:", username);
    console.log("Logged in as:", email);

const defaultData = {
	username: "test_user",
	email: "user@example.com",
	password: "secret123",
};

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

usernameInput.value = localStorage.getItem("username") || defaultData.username;
emailInput.value = localStorage.getItem("email") || defaultData.email;
passwordInput.value = localStorage.getItem("password") || defaultData.password;

usernameInput.addEventListener("dblclick", () =>
	usernameInput.removeAttribute("readonly")
);
emailInput.addEventListener("dblclick", () =>
	emailInput.removeAttribute("readonly")
);

const editPasswordBtn = document.getElementById("editPasswordBtn");

editPasswordBtn.addEventListener("click", (e) => {
	e.preventDefault(); // prevent form submission
	passwordInput.removeAttribute("readonly");
	passwordInput.focus();
});
