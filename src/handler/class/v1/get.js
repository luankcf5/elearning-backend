const Class = require("../../../model/class");
const NotFoundErr = require("../../../err/not-found");

async function getClasses(req, res, next) {
  try {
    const classes = await Class.find({}).populate([
      {
        path: "channels",
      },
      {
        path: "members",
        select: "profile role",
        populate: [
          {
            path: "role",
            populate: [
              {
                path: "permissions",
                select: "name description",
              },
            ],
          },
        ],
      },
    ]);
    if (!classes.length) {
      throw new NotFoundErr("Danh sách lớp học trống");
    }

    res.json({
      classes,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = getClasses;
