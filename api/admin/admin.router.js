const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createUser,
  login,
  getUserByUserId,
  getUsers,
  updateUsers,
  deleteUser,
  verifymail,
  resetPassword,
  mailPasswordreset,
} = require("./admin.controller");
router.get("/",  getUsers);
router.post("/",  createUser);
router.get("/:id",  getUserByUserId);
router.post("/login", login);
router.patch("/",  updateUsers);
router.post("/resetPassword",  resetPassword);
router.delete("/", deleteUser);

router.get("/:email/verify/:token",  verifymail);

router.post("/mailPasswordreset",  mailPasswordreset);

module.exports = router;
