window.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("id");
	if (!userId) {
		alert("لطفاً ابتدا وارد شوید.");
		return window.location.href="Login";
	}

  const response = await fetch(`/api/user-courses?userId=${userId}`, { method: "GET" });
  const data = await response.json();

  const tbody = document.querySelector("#courseTable tbody");
  const semesterSelect = document.querySelector("#semesterSelect");

  const semesters = [...new Set(data.map(course => course.semester))].sort().reverse();

  semesters.forEach(sem => {
    const option = document.createElement("option");
    const [year, num] = sem.split("-");
    option.value = sem;
    option.textContent = `نیمسال ${num === "1" ? "اول" : "دوم"} ${year}`;
    semesterSelect.appendChild(option);
  });

  function renderCourses(semester) {
    tbody.innerHTML = "";
    data
      .filter(course => course.semester === semester)
      .forEach(course => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${course.code}</td>
          <td>${course.name}</td>
          <td>${course.professor}</td>
          <td>${course.unit}</td>
          <td>${course.group}</td>
          <td>${course.grade}</td>
          <td>${course?.grade < 10 ? "درس عادي - مردود" : course.grade === "-" ?  "نمره گزارش نشده" : "درس عادي - قبول"}</td>
          <td>${course.examDay}</td>
          <td>${course.examTime}</td>
        `;
        tbody.appendChild(tr);
      });
  }

  if (semesters.length > 0) {
    semesterSelect.value = semesters[0]; 
    renderCourses(semesters[0]);
  }
  semesterSelect.addEventListener("change", (e) => {
    renderCourses(e.target.value);
  });
});
