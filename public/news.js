const newsItems = [
  "دانشگاه برنامه‌های جدید بورسیه را اعلام کرد.",
  "کتابخانه روز جمعه تعطیل است.",
  "دروس جدید برای نیمسال پاییز ارائه شده است.",
  "مسابقات ورزشی سالانه ماه آینده برگزار می‌شود.",
  "سخنرانی مهمان توسط استاد معروف چهارشنبه آینده.",
];

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("id");
	if (!userId) {
		alert("لطفاً ابتدا وارد شوید.");
		return window.location.href="Login";
	}
  
  const container = document.querySelector(".container");
  container.innerHTML = "";

  // Create news boxes
  newsItems.forEach((news) => {
    const box = document.createElement("div");
    box.classList.add("news-box");
    box.textContent = news;
    container.appendChild(box);
  });

  const boxes = container.querySelectorAll(".news-box");
  const boxHeight = boxes[0].offsetHeight + 20; // height + gap (20 is gap in container)

  function cycleNews() {
    // Animate all boxes upward by boxHeight
    boxes.forEach((box) => {
      box.style.transition = "transform 0.5s ease";
      box.style.transform = `translateY(-${boxHeight}px)`;
    });

    setTimeout(() => {
      // Reset transform instantly (no transition)
      boxes.forEach((box) => {
        box.style.transition = "none";
        box.style.transform = "none";
      });

      // Move first box to the end
      container.appendChild(container.firstElementChild);
    }, 500);
  }

  // Run cycle every 3 seconds
  setInterval(cycleNews, 3000);
});
