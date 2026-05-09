const { models } = require("mongoose");
const { createUserSchema, loginSchema } = require("../helpers/joi_helper");
const userService = require('../services/userService');

// Middleware kiểm tra authencation
async function requireAuth(req, res, next) {
  try {
    const sessionId = req.signedCookies.sessionId;

    if (!sessionId) {
      return res.redirect("/users/login");
    }

    // Tìm user theo sessionId
    const user = await userService.checkUserBySession(sessionId);
    if (!user) {
      return res.redirect("/users/login");
    }

    // Xác thực thành công từ đây
    // Gán user vào req để sử dụng trong các middleware tiếp theo
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function checkUser(req, res, next) {
  try {
    const sessionId = req.signedCookies.sessionId;
    if (sessionId) {
      const user = await userService.checkUserBySession(sessionId);
      if (user) {
        // Sử dụng biến toàn cục res.locals để dùng được ở mọi nơi
        res.locals.user = user;
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }

    next();
  } catch (err) {
    next(err);
  }
}

// Middleware validate register
async function validateRegister(req, res, next) {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) {
    return res.render("users/register", {
      error: error.details[0].message,
      formData: req.body,
    });
  }
  req.body = value;
  next();
}

// Middleware validate login
async function validateLogin(req, res, next) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.render("users/login", {
      error: error.details[0].message,
      success: null,
      formData: req.body,
    });
  }
  req.body = value;
  next();
}

module.exports = {
  requireAuth,
  checkUser,
  validateRegister,
  validateLogin,
};
