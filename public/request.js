const userId = localStorage.getItem("id");

const saveRequestBtn = document.getElementById("saveRequestBtn");
const requestContent = document.getElementById("requestContent");

const section = document.getElementById("list-section");
const tbody = document.getElementById("order-list");

saveRequestBtn.addEventListener("click", async (e) => {
	e.preventDefault();

	const to = document.getElementById("to").value.trim();
	const content = requestContent.value.trim();

	if (!content) {
		alert("لطفا درخواست خود را وارد کنید.");
		return;
	}

	try {
		const res = await fetch("/api/Requests", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId, content, to }),
		});

		if (!res.ok) {
			const errorData = await res.json();
			alert("خطا: " + errorData.message);
			return;
		}

		const data = await res.json();
		alert(`درخواست شما با شناسه ${data.requestId} ثبت شد.`);

		const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.textContent = data.requestId;

      const toTd = document.createElement("td");
      toTd.textContent = data.to;

      const dateTd = document.createElement("td");
      dateTd.textContent = new Date(data.createdAt).toLocaleDateString("fa-IR");

      const statusTd = document.createElement("td");
      statusTd.textContent = data.status;
    

    section.style.display = "block";

		document.getElementById("requestform").reset();
    window.location.reload(true);

    
	} catch (err) {
		alert("مشکلی در ثبت درخواست پیش آمد: " + err.message);
	}
});


document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("id");
	if (!userId) {
		alert("لطفاً ابتدا وارد شوید.");
		return window.location.href="Login";
	}
  
  try {
    const res = await fetch(`/api/requests?userId=${userId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    const section = document.getElementById("list-section");
    const tbody = document.getElementById("order-list");
    tbody.innerHTML = "";

    if (data.length === 0) {
      section.style.display = "none";
      return;
    }

    data.forEach((request) => {
      const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.textContent = request._id;

      const toTd = document.createElement("td");
      toTd.textContent = request.to;

      const dateTd = document.createElement("td");
      dateTd.textContent = new Date(request.createdAt).toLocaleDateString("fa-IR");

      const statusTd = document.createElement("td");
      statusTd.textContent = request.status;

      const deleteTd = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("id", "deleteBtn");
      deleteBtn.textContent = "حذف";

      deleteBtn.onclick = async () => {
        try {
          const deleteRes = await fetch(`/api/Requests/${request._id}`, {
            method: "DELETE",
          });
          const msg = await deleteRes.json();
          alert(msg.message);
          tr.remove();
          if (tbody.children.length === 0) {
            section.style.display = "none";
          }
          const userRes = await fetch(`/api/user/${userId}`, { method: "GET" });
          if (!userRes.ok) throw new Error("خطا در دریافت اطلاعات کاربر");
          const user = await userRes.json();
          // Do something with user if needed
        } catch (err) {
          console.error(err);
          alert("مشکلی در دریافت اطلاعات رخ داد.");
        }
      };

      deleteTd.appendChild(deleteBtn);
      tr.append(idTd, toTd, dateTd, statusTd, deleteTd);
      tbody.appendChild(tr);
    });

    section.style.display = "block";
  } catch (err) {
    console.error("Error loading requests:", err);
  }
});