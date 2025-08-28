# StudentSystem

This is a **mini full-stack project** created for the **Web Programming course**.
It uses **Node.js**, **Express**, and **MongoDB** to manage students, courses, and photos.

The goal of this project is to give a hands-on demonstration of working with backend, database, and server setup all in one place.

---

## Features

* 📚 Manage students and courses
* 🖼️ Handle photos
* 🗄️ Store everything in **MongoDB**
* 🌐 Simple web interface served by **Express.js**

---

## Prerequisites

Before running the project, make sure you have installed:

* [Node.js](https://nodejs.org/) (v16 or later recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (you can use MongoDB Compass for easy GUI management)
* [Git](https://git-scm.com/) (to clone the repo)

---

## Installation

1. Clone this repository:

```
git clone https://github.com/fatemehmi/StudentSystem.git
cd StudentSystem
```

2. Install dependencies:

```
npm install
```

3. Make sure MongoDB is running on your system.

---

## How to Run

Run the following commands **each in a separate terminal** (or later, you can combine them with tools like `concurrently`):

```
node public/UserCourseSaver.js
node public/CourseSaver.js
node public/photos.js
nodemon server.js    # or: node server.js
```

Once all are running, open your browser and visit:

👉 **[http://localhost:3001](http://localhost:3001)**

Tada 🎉! Your website is now live. You can use it and have fun!

---

## Tips

* You can use **nodemon** for automatic server restarts during development.
* If you want to simplify running everything, you can use node instead.

---

## Final Notes

This project is mainly for learning and practicing full-stack development concepts.
Don’t forget:

* **Install Node.js and MongoDB before running**
* Run MongoDB first, then the scripts
* Enjoy experimenting and extending the project!
