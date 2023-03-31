import { Router } from "express";
import { check, param } from "express-validator";

import { changePass } from "../handler/user/v1/change-pass.js";
import { delUser } from "../handler/user/v1/del.js";
import { getUser } from "../handler/user/v1/get-id.js";
import { getUsers } from "../handler/user/v1/get.js";
import { grantAccess } from "../handler/user/v1/grant-access.js";
import { me } from "../handler/user/v1/me.js";
import { modProf } from "../handler/user/v1/mod-prof.js";
import { newManyUser } from "../handler/user/v1/new-many.js";
import { newUser } from "../handler/user/v1/new.js";
import { uploader } from "../helper/uploader.js";
import { accessCtrl } from "../middleware/access-ctrl.js";
import { checkUser } from "../middleware/check-user.js";
import { decodeJwt } from "../middleware/decode-jwt.js";
import { redirectVer } from "../middleware/redirect-ver.js";
import { requireAuth } from "../middleware/require-auth.js";
import { validReq } from "../middleware/valid-req.js";

const r = Router();

r.get(
  "/api/users",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  redirectVer({
    v1: getUsers,
  })
);

r.get(
  "/api/users/me",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  redirectVer({
    v1: me,
  })
);

r.get(
  "/api/users/:id",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    param("id")
      .isMongoId()
      .withMessage("Không tìm thấy người dùng"),
  ],
  validReq,
  redirectVer({
    v1: getUser,
  })
);

r.post(
  "/api/users",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    check("username")
      .notEmpty()
      .withMessage("Yêu cầu tên tài khoản"),
    check("password")
      .notEmpty()
      .withMessage("Yêu cầu mật khẩu")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
      })
      .withMessage(
        "Mật khẩu ít nhất 6 ký tư gồm: viết hoa, viết thường"
      ),
    check("fullName")
      .isAlpha("vi-VN", { ignore: " " })
      .withMessage(
        "Họ và tên chỉ bao gồm ký tự trong bảng chữ cái Tiếng Việt"
      )
      .optional({ nullable: true }),
    check("dob")
      .isAfter("1900-01-01")
      .withMessage("Ngày sinh phải từ năm 1990 trở về sau")
      .isBefore(
        new Date(Date.now() - 378683424000).toString()
      )
      .withMessage("Người dùng phải đủ 12 tuổi")
      .optional({ nullable: true }),
    check("gender")
      .toLowerCase()
      .isIn(["male", "female", "other"])
      .withMessage("Giới tính không hợp lệ")
      .optional({ nullable: true }),
    check("email")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .optional({ nullable: true }),
    check("phone")
      .isLength({ min: 10, max: 11 })
      .withMessage("Số điện thoại không đúng định dạng")
      .isNumeric()
      .withMessage("Số điện thoại không hợp lệ")
      .optional({ nullable: true }),
    check("roleId")
      .notEmpty()
      .withMessage("Yêu cầu vai trò người dùng")
      .isMongoId()
      .withMessage("Vai trò không hợp lệ"),
  ],
  validReq,
  redirectVer({
    v1: newUser,
  })
);

r.post(
  "/api/users/many",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    check("users.*.username")
      .notEmpty()
      .withMessage("Yêu cầu tên tài khoản"),
    check("users.*.password")
      .notEmpty()
      .withMessage("Yêu cầu mật khẩu")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
      })
      .withMessage(
        "Mật khẩu ít nhất 6 ký tư gồm: viết hoa, viết thường"
      ),
    check("users.*.fullName")
      .isAlpha("vi-VN", { ignore: " " })
      .withMessage(
        "Họ và tên chỉ bao gồm ký tự trong bảng chữ cái Tiếng Việt"
      )
      .optional({ nullable: true }),
    check("users.*.dob")
      .isAfter("1900-01-01")
      .withMessage("Ngày sinh phải từ năm 1990 trở về sau")
      .isBefore(
        new Date(Date.now() - 378683424000).toString()
      )
      .withMessage("Người dùng phải đủ 12 tuổi")
      .optional({ nullable: true }),
    check("users.*.gender")
      .toLowerCase()
      .isIn(["male", "female", "other"])
      .withMessage("Giới tính không hợp lệ")
      .optional({ nullable: true }),
    check("users.*.email")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .optional({ nullable: true }),
    check("users.*.phone")
      .isLength({ min: 10, max: 11 })
      .withMessage("Số điện thoại không đúng định dạng")
      .isNumeric()
      .withMessage("Số điện thoại không hợp lệ")
      .optional({ nullable: true }),
    check("users.*.roleId")
      .notEmpty()
      .withMessage("Yêu cầu vai trò người dùng")
      .isMongoId()
      .withMessage("Vai trò không hợp lệ"),
  ],
  validReq,
  newManyUser
);

r.put(
  "/api/users/prof",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  uploader("avt"),
  [
    check("fullName")
      .isAlpha("vi-VN", { ignore: " " })
      .withMessage(
        "Họ và tên chỉ bao gồm ký tự trong bảng chữ cái Tiếng Việt"
      )
      .optional({ nullable: true }),
    check("dob")
      .isAfter("1900-01-01")
      .withMessage("Ngày sinh phải từ năm 1990 trở về sau")
      .isBefore(
        new Date(Date.now() - 378683424000).toString()
      )
      .withMessage("Người dùng phải đủ 12 tuổi")
      .optional({ nullable: true }),
    check("gender")
      .toLowerCase()
      .isIn(["male", "female", "other"])
      .withMessage("Giới tính không hợp lệ")
      .optional({ nullable: true }),
    check("email")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .optional({ nullable: true }),
    check("phone")
      .isLength({ min: 10, max: 11 })
      .withMessage("Số điện thoại không đúng định dạng")
      .isNumeric()
      .withMessage("Số điện thoại không hợp lệ")
      .optional({ nullable: true }),
  ],
  validReq,
  redirectVer({
    v1: modProf,
  })
);

r.patch(
  "/api/users/pass",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    check("password")
      .notEmpty()
      .withMessage("Yêu cầu mật khẩu hiện tại"),
    check("newPassword")
      .notEmpty()
      .withMessage("Yêu cầu mật khẩu mới")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 0,
      })
      .withMessage(
        "Mật khẩu ít nhất 6 ký tư gồm: viết hoa, viết thường"
      ),
  ],
  validReq,
  redirectVer({
    v1: changePass,
  })
);

r.patch(
  "/api/users/access/:id",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    param("id")
      .isMongoId()
      .withMessage("Người dùng không hợp lệ"),
    check("status")
      .notEmpty()
      .withMessage("Yêu cầu trạng thái truy cập")
      .isBoolean()
      .withMessage("Trạng thái truy cập không hợp lệ"),
  ],
  validReq,
  redirectVer({
    v1: grantAccess,
  })
);

r.delete(
  "/api/users/:id",
  decodeJwt,
  requireAuth,
  checkUser,
  accessCtrl(),
  [
    param("id")
      .isMongoId()
      .withMessage("Người dùng không hợp lệ"),
  ],
  validReq,
  redirectVer({
    v1: delUser,
  })
);

export { r as userRouter };
