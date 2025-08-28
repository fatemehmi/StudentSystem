const mongoose = require("mongoose");
const fs = require("fs");
const { Course } = require("../db");

async function saveCourse(
	courseName,
	courseCode,
	professor,
	unit,
	courseGroup,
	examDateTime,
	weeklyClassTimes,
	department,
	classNumber
) {
	await mongoose.connect("mongodb://localhost:27017/SignupAndLoginUsers");

	const newCourse = new Course({
		courseName,
		courseCode,
		professor,
		unit,
		courseGroup,
		examDateTime,
		weeklyClassTimes,
		department,
		classNumber,
	});

	await newCourse.save();
	console.log("course saved to MongoDB!");
}

saveCourse(
	"اندیشه 2",
	8888708,
	"منزه قلعه جوق",
	2,
	9,
	"1404-03-26T14:00:00",
	[{ day: "دوشنبه", startTime: "10:0", endTime: "12:0", period: "هرهفته" }],
	"شهدا",
	305
);

saveCourse(
	"برنامه نویسی وب",
	513141,
	"روضه خوانی",
	3,
	2,
	"1404-03-28T14:00:00",
	[
		{ day: "یکشنبه", startTime: "8:0", endTime: "10:0", period: "هرهفته" },
		{ day: "سه شنبه", startTime: "14:0", endTime: "16:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	256
);

saveCourse(
	"الکترونیک دیجیتال",
	513127,
	"احمدیان",
	2,
	9,
	"1404-03-31T08:30:00",
	[
		{ day: "شنبه", startTime: "10:0", endTime: "12:0", period: "هرهفته" },
		{ day: "دوشنبه", startTime: "16:0", endTime: "18:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	257
);

saveCourse(
	"مهندسی نرم افزار 2",
	513120,
	"تقی نژاد",
	2,
	9,
	"1404-04-01T14:00:00",
	[
		{ day: "یکشنبه", startTime: "16:0", endTime: "18:0", period: "هرهفته" },
		{ day: "سه شنبه", startTime: "08:0", endTime: "10:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	257
);

saveCourse(
	"اندیشه 1",
	8888705,
	"قدردان قراملکی",
	2,
	9,
	"1403-03-26T08:30:00",
	[{ day: "دوشنبه", startTime: "14:0", endTime: "16:0", period: "هرهفته" }],
	"شهدا",
	304
);

saveCourse(
	"انتقال داده ها",
	513142,
	"اقدسی",
	2,
	9,
	"1403-04-02T08:30:00",
	[
		{ day: "شنبه", startTime: "8:0", endTime: "10:0", period: "هرهفته" },
		{ day: "دوشنبه", startTime: "16:0", endTime: "18:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	257
);

saveCourse(
	"مبانی رایانش ابری",
	513146,
	"محمد خانلی",
	2,
	9,
	"1403-04-06T14:00:00",
	[
		{ day: "یکشنبه", startTime: "10:0", endTime: "12:0", period: "هرهفته" },
		{ day: "سه شنبه", startTime: "14:0", endTime: "16:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	257
);

saveCourse(
	"هوش مصنوعی",
	513134,
	"کوهستانی",
	2,
	9,
	"1403-04-09T08:30:00",
	[
		{ day: "یکشنبه", startTime: "10:0", endTime: "12:0", period: "هرهفته" },
		{ day: "سه شنبه", startTime: "16:0", endTime: "18:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	256
);

saveCourse(
	"سیستم عامل",
	513108,
	"پاشازاده",
	2,
	9,
	"1402-03-22T11:00:00",
	[
		{ day: "یکشنبه", startTime: "14:0", endTime: "16:0", period: "هرهفته" },
		{ day: "سه شنبه", startTime: "10:0", endTime: "12:0", period: "زوج" },
	],
	"مهندسی برق و کامپیوتر",
	256
);
