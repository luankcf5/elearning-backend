const BadReqErr = require("../../../error/bad-req");
const Course = require("../../../model/course");
const Subject = require("../../../model/subject");

async function newCourse(req, res, next) {
  let {
    title,
    description,
    classId,
    subjectId,
    lessons,
    publish,
  } = req.body;

  req.files.forEach((file, index) => {
    if (lessons[index]) {
      lessons[index].resource = file.filename;
    }
  });

  try {
    const course = new Course({
      title,
      description,
      classes: [classId],
      publish,
      author: req.user.id,
      subject: subjectId,
      lessons,
    });
    await course.save();

    // kiểm tra giáo viên có trực thuộc môn học hay không
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      {
        $addToSet: {
          teachers: course.id,
        },
      }
    );
    if (!subject) {
      throw new BadReqErr(
        "Môn học của khóa học không hợp lệ"
      );
    }

    res.status(201).json({
      course,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = newCourse;
