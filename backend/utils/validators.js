import { body } from "express-validator";

export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("نام و نام خانوادگی الزامی است")
    .isLength({ min: 2 })
    .withMessage("نام باید حداقل ۲ کاراکتر باشد"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("ایمیل الزامی است")
    .isEmail()
    .withMessage("فرمت ایمیل معتبر نیست"),

  body("password")
    .notEmpty()
    .withMessage("رمز عبور الزامی است")
    .isLength({ min: 6 })
    .withMessage("رمز عبور باید حداقل ۶ کاراکتر باشد"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("ایمیل الزامی است")
    .isEmail()
    .withMessage("فرمت ایمیل معتبر نیست"),

  body("password").notEmpty().withMessage("رمز عبور الزامی است"),
];
