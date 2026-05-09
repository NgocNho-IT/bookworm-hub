const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/users.js");

async function registerUser(userData) {
  const existingUser = await User.findOne({ name: userData.name });
  if (existingUser) throw new Error("Tên người dùng đã tồn tại");

  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) throw new Error("Email đã được sử dụng");

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Tạo người dùng mới
  return await User.insertOne({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });
}

async function loginUser(name, password) {
  // Check user theo name
  const userData = await User.findOne({ name });
  // console.log(userData);
  if (!userData) throw new Error("Sai tên người dùng hoặc mật khẩu");

  // Xác thực password
  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) throw new Error("Sai tên người dùng hoặc mật khẩu");

  // Tạo và lưu session id vào database
  const sessionId = crypto.randomBytes(16).toString("hex");
  await User.updateOne(
    { name: userData.name },
    { $set: { sessionId: sessionId } },
  );

  return sessionId;
}

async function logoutUser(sessionId) {
  if (sessionId) {
    // Xóa session ID khỏi db
    await User.updateOne(
      { sessionId: sessionId },
      { $set: { sessionId: null } },
    );
  }
}

async function checkUserBySession(sessionId) {
    return await User.findOne({ sessionId: sessionId }).select("-password");
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    checkUserBySession
};