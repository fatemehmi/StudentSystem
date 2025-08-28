const mongoose = require("mongoose");
const { UserCourse } = require("../db");

async function saveUserCourse(userId, courseId, semester, grade = null) {
  await mongoose.connect("mongodb://localhost:27017/SignupAndLoginUsers");

  try {
    const newUserCourse = new UserCourse({
      userId,
      courseId,
      semester,
      Grade: grade,
    });

    await newUserCourse.save();
    console.log("✅ UserCourse saved successfully!");
  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate entry: this user already has this course for the semester.");
    } else {
      console.error("Failed to save UserCourse:", err.message);
    }
  }
}


const mainUser = "68affa37f5e5fe9e9b1a2717";
const user2 = "6819f8afbaaa7fbf20b7d5bf";
const user3 = "68484ff869e24dd9157da530";

(async () => {
  // Main User – All courses
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbdb", "1404-2");
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbde", "1404-2"); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbe1", "1404-2"); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbd9", "1404-2"); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbe9", "1403-2", 18.75); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbec", "1403-2", 19.25);
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbef", "1402-2", 17.00); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbe4", "1403-2", 18.00); 
  await saveUserCourse(mainUser, "6849e0ab74470566c1becbe6", "1403-2", 19.5); 

  // User 2 – 4 courses
  await saveUserCourse(user2, "6849e0ab74470566c1becbdb", "1404-2");
  await saveUserCourse(user2, "6849e0ab74470566c1becbde", "1404-2");
  await saveUserCourse(user2, "6849e0ab74470566c1becbec", "1403-2", 16.5);
  await saveUserCourse(user2, "6849e0ab74470566c1becbef", "1402-2", 17.75);

  // User 3 – 3 courses
  await saveUserCourse(user3, "6849e0ab74470566c1becbe1", "1404-2"); 
  await saveUserCourse(user3, "6849e0ab74470566c1becbec", "1403-2", 19.00);
  await saveUserCourse(user3, "6849e0ab74470566c1becbde", "1404-2"); 
})();
