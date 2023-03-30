import { NotFoundErr } from "../../../err/not-found.js";
import { Perm } from "../../../model/perm.js";

async function getPerms(_req, res, next) {
  try {
    const perms = await Perm.find({})
      .populate([
        {
          path: "group",
          select: "-perms",
        },
        {
          path: "roles",
        },
      ])
      .sort({
        createdAt: -1,
      });
    if (!perms.length) {
      throw new NotFoundErr("Danh sách quyền hạn trống");
    }

    res.json({
      perms,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export { getPerms };
