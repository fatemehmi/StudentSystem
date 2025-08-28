document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("id");
  if (!userId) {
    alert("لطفاً ابتدا وارد شوید.");
    return (window.location.href = "Login");
  }

  try {
    const res = await fetch(`/api/user/${userId}`);
    if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");
    const user = await res.json();
    document.getElementById("balance").innerHTML = user.balance.toLocaleString("fa-IR");
  } catch (err) {
    console.error(err);
    alert("مشکلی در دریافت اطلاعات رخ داد.");
  }
});

// Fetch Food data
document.getElementById("restaurant").addEventListener("change", function () {
  fetch("/api/foods")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("food-list");
      const restaurant = document.getElementById("restaurant").value;
      container.innerHTML = "";

      data.forEach((food, index) => {
        if (restaurant === food.restaurant) {
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
        }
      });
    })
    .catch((error) => console.error("Error loading food data:", error));
});

// Reserve Form
document.getElementById("ReserveForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userId = localStorage.getItem("id");
  const selectedFoodInput = document.querySelector('input[name="food"]:checked');
  if (!selectedFoodInput) return alert("لطفاً یک غذا انتخاب کنید");

  const date = document.getElementById("date").value;
  if (!date) return alert("لطفاً تاریخ را انتخاب کنید");

  const restaurant = document.getElementById("restaurant").value;
  if (!restaurant) return alert("لطفاً رستوران را انتخاب کنید");

  const formData = new FormData(e.target);
  formData.append("userId", userId);
  const data = new URLSearchParams(formData);

  try {
    const res = await fetch("/api/Reserve", { method: "POST", body: data });
    const result = await res.json();

    if (!res.ok) {
      return alert(result.message || "رزرو با مشکل مواجه شد");
    }

    alert(result.message);
    document.getElementById("ReserveForm").reset();

    // Update balance
    const userRes = await fetch(`/api/user/${userId}`);
    const user = await userRes.json();
    document.getElementById("balance").innerHTML = user.balance.toLocaleString("fa-IR");
  } catch (err) {
    console.error(err);
    alert("رزرو با مشکل مواجه شد");
  }
});

// Load receipt
document.getElementById("date").addEventListener("change", async function () {
  const userId = localStorage.getItem("id");
  const date = this.value;
  try {
    const res = await fetch(`/api/reserves?userId=${userId}&date=${date}`);
    const data = await res.json();

    const section = document.getElementById("list-section");
    const tbody = document.getElementById("order-list");
    tbody.innerHTML = "";

    if (data.length === 0) {
      section.style.display = "none";
      return;
    }

    data.forEach((reserve) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${new Date(reserve.date).toLocaleDateString("fa-IR")}</td>
        <td>${reserve.meal}</td>
        <td>${reserve.restaurant}</td>
        <td>${Number(reserve.price).toLocaleString("fa-IR")} تومان</td>
        <td><button class="delete-btn" data-id="${reserve._id}">حذف</button></td>
      `;

      tbody.appendChild(tr);
    });

    section.style.display = "block";

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const res = await fetch(`/api/reserves/${id}`, { method: "DELETE" });
        const msg = await res.json();
        alert(msg.message);
        btn.closest("tr").remove();

        // Update balance
        const userRes = await fetch(`/api/user/${userId}`);
        const user = await userRes.json();
        document.getElementById("balance").innerHTML = user.balance.toLocaleString("fa-IR");
      });
    });
  } catch (err) {
    console.error(err);
    alert("خطا در دریافت اطلاعات رزرو");
  }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("id");
  window.location.href = "Login";
});
