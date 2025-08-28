
document.querySelector("#signupForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = new URLSearchParams(formData);

  fetch("/Signup", {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message.includes("Signup Successful!")) {
        alert(data.message);
        window.location.href = "/Login";
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      alert("Signup failed!");
      console.error(error);
    });
});