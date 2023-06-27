const express = require("express");
const { sequelize } = require("./models");

const { Student, Class, Enrollment } = sequelize.models;

const app = express();

app.use(express.json());

app.post("/students", async (req, res) => {
  const studentInfo = req.body;

  try {
    const bob = await Student.create(studentInfo);

    res.json(bob);
  } catch (error) {}
});

app.post("/classes", async (req, res) => {
  const classInfo = req.body;

  try {
    const mathClass = await Class.create(classInfo);

    res.json(mathClass);
  } catch (error) {}
});

app.post("/enrollStudent/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId);
    const mathClass = await Class.findByPk(1);

    await student.addClass(mathClass, { through: Enrollment });

    res.json({ message: "student enrolled successfully!" });
  } catch (error) {}
});

app.post("/disenrollStudent", async (req, res) => {
  try {
    const bob = await Student.findByPk(1);
    const mathClass = await Class.findByPk(1);

    await bob.removeClass(mathClass, { through: Enrollment });

    res.json({ message: "student disenrolled successfuly" });
  } catch (error) {}
});

app.post("/createStudentAndEnroll", async (req, res) => {
  await Student.create(
    {
      name: "jane kim",
      Classes: [
        {
          name: "Physics",
        },
      ],
    },
    { include: Class }
  );
});

app.get("/enrolledClasses/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const jane = await Student.findByPk(studentId);
    const classesJaneIsEnrolledIn = await jane.getClasses();

    res.json(classesJaneIsEnrolledIn);
  } catch (error) {}
});

app.get("/enrolledStudents/:classId", async (req, res) => {
  const { classId } = req.params;

  try {
    const mathClass = await Class.findByPk(classId);
    const enrolledStudents = await mathClass.getStudents();

    res.json(enrolledStudents);
  } catch (error) {}
});

app.listen(3000, async () => {
  console.log("server started!");
  await sequelize.authenticate();
  console.log("db authenticated!");
});
