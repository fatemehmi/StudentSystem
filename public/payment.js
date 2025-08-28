document.addEventListener("DOMContentLoaded", async () => {
	const userId = localStorage.getItem("id");
	if (!userId) {
		alert("لطفاً ابتدا وارد شوید.");
		return window.location.href="Login";
	}

	try {
		const res = await fetch(`/api/user/${userId}`, {
			method: "GET",
		});
		if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");

		const user = await res.json();

    document.getElementById("balance").innerHTML = user.balance.toLocaleString('fa-IR');
	} catch (err) {
		console.error(err);
		alert("مشکلی در دریافت اطلاعات رخ داد.");
	}
});

for (let index = 1; index <= 6; index++) {	
  document.getElementById(`btn_${index}`).addEventListener("click", (e) => {
    e.preventDefault();
    const value = e.target.textContent.replace(/,/g, '');
    document.getElementById("balance_input").value = value;
  });
}

document.getElementById("balance_form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem("id");

  try {
    const res = await fetch(`/api/user/${userId}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");

    const user = await res.json();

    const paymentStr = document.getElementById("balance_input").value;
    const payment = Number(paymentStr.replace(/,/g, ''));
    if (isNaN(payment) || payment < 1000) {
      alert("لطفا مبلغ صحیح و حداقل 10000 ریال وارد کنید.");
      return;
    }

    const currentBalance = Number(user.balance) || 0;
    const newBalance = currentBalance + payment;

    const updateRes = await fetch(`/api/users/balance/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ balance: newBalance }),
    });

    if (!updateRes.ok) throw new Error("خطا در بروزرسانی اعتبار");

    alert("اعتبار شما با موفقیت افزایش یافت.");

    document.getElementById("balance").textContent = newBalance.toLocaleString('fa-IR');

    document.getElementById("balance_input").value = "";

  } catch (err) {
    console.error(err);
    alert("مشکلی در پردازش پرداخت رخ داد.");
  }
});

