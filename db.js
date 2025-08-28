const { default: mongoose } = require("mongoose");

mongoose
	.connect("mongodb://localhost:27017/SignupAndLoginUsers")
	.then(() => console.log("Connected to MongoDB using Mongoose"))
	.catch((err) => console.error("Connection failed!", err));

// User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance:  { type: Number, required: true, default: 0  }
});

const User = mongoose.model("User", userSchema);

// --------------------------------------------------------------------------------------

// Reserve
const reserveSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  restaurant: { type : String , required: true},
  date:	  	  { type: Date, required: true , },
  price:      { type: Number, required: true },
});

// Only one reserve per day
reserveSchema.index({ userId: 1, date: 1 }, { unique: true });

const Reserve = mongoose.model("Reserve", reserveSchema);

// --------------------------------------------------------------------------------------

// Food
const foodSchema = new mongoose.Schema({
	name:     	{ type: String, required: true },
	restaurant:	{ type: String, required: true },
	image:			{data: Buffer, contentType: String},
	price:      { type: Number, required: true },
});

const Food = mongoose.model("Food", foodSchema);

// --------------------------------------------------------------------------------------

// Request
const requestSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:    { type: String, required: true },
  createdAt:  { type: Date, default: Date.now },
  to:         { type: String, required: true},
  status:     { type: String, enum: ['درحال پیگیری','تکمیل شده'], required: true, default:'درحال پیگیری' }
});

const Request = mongoose.model("Request", requestSchema);

// --------------------------------------------------------------------------------------

// Courses
const courseSchema = new mongoose.Schema({
  courseName:    { type: String, required: true },
  courseCode:    { type: Number, required: true, unique: true },
  professor:     { type: String, required: true },
  unit:          { type: Number, required: true },
  courseGroup:   { type: Number, required: true },
  examDateTime:  { type: Date, required: true },
  weeklyClassTimes: [
    {
      day: { type: String, enum: ['شنبه','یکشنبه','دوشنبه','سه شنبه','چهارشنبه'], required: true },
      startTime: { type: String, required: true },  // "HH:mm" format
      endTime: { type: String, required: true },
      period: { type: String, enum:['زوج' , 'فرد' , 'هرهفته'] , default:'هرهفته' , required: true }
    }
  ],
  department:    { type: String, required: true },
  classNumber:   { type: Number, required: true }
});

const Course = mongoose.model("Course", courseSchema);

// --------------------------------------------------------------------------------------

// User Courses
const userCourseSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester:  { type: String, required: true },
	Grade:     { type:Number }
});

userCourseSchema.index({ userId: 1, courseId: 1, semester: 1 }, { unique: true });

const UserCourse = mongoose.model("UserCourse", userCourseSchema);

// --------------------------------------------------------------------------------------
// Payment
const paymentSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:    { type: Number, required: true },
  type:      { type: String, enum: ['debt', 'credit'], required: true },
  date:      { type: Date, default: Date.now },
  note:      { type: String }
});

const Payment = mongoose.model("Payment", paymentSchema);

// --------------------------------------------------------------------------------------


module.exports.User = User;
module.exports.Reserve = Reserve;
module.exports.Food = Food;
module.exports.Request = Request;
module.exports.UserCourse = UserCourse;
module.exports.Course = Course;
module.exports.Payment = Payment;
