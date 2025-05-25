document.addEventListener("DOMContentLoaded", async () => {
	const username = localStorage.getItem("username");
	const email = localStorage.getItem("email");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const newPasswordInput = document.getElementById("newPassword");
  const passwordSection = document.getElementById("password-section");
  const messageDiv = document.getElementById("message");
  const saveBtn = document.getElementById("saveBtn");

  const editUsernameBtn = document.getElementById("editUsernameBtn");
  const editPasswordBtn = document.getElementById("editPasswordBtn");

  let editingUsername = false;
  let changingPassword = false;

  usernameInput.value = username;
  emailInput.value = email;

  editUsernameBtn.addEventListener("click", () => {
    usernameInput.disabled = false;
    saveBtn.style.display = "inline";
    editingUsername = true;
  });

  editPasswordBtn.addEventListener("click", () => {
    passwordSection.style.display = "block";
    saveBtn.style.display = "inline";
    changingPassword = true;
  });

  document.getElementById("profileForm").addEventListener("submit", async (e) => {
		e.preventDefault();
		messageDiv.textContent = "";
	
		const updatedUsername = usernameInput.value.trim();
		const newPassword = newPasswordInput.value.trim();
	
		const res = await fetch("/update-profile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Current-Username": localStorage.getItem("username") // send current username
			},
			body: JSON.stringify({
				username: updatedUsername,
				newPassword: changingPassword ? newPassword : null,
			}),
		});
		
	
		const result = await res.json();
	
		if (!res.ok) {
			messageDiv.textContent = result.message;
			return;
		}
	
		if (changingPassword) {
			// Clear localStorage before redirecting
			localStorage.clear();
	
			// Optionally notify the server to destroy session (if not already done)
			await fetch("/logout", { method: "POST" });
	
			// Redirect to login
			window.location.href = "/login";
		} else {
			messageDiv.style.color = "green";
			messageDiv.textContent = "تغییرات با موفقیت ذخیره شد!";
			usernameInput.disabled = true;
			passwordSection.style.display = "none";
			saveBtn.style.display = "none";
		}
	});
	
});
