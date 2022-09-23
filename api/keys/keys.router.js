const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createKey,
  getkeyById,
  getKeys,
  revokeKey,
  getAllkeysByinstitution,
  deleteUser,
  verifymail,
  creatependingKeys,
  pendingKeys,
  getActivekeyByinstitution,
  resetPassword,
  mailPasswordreset,
} = require("./keys.controller");
router.get("/",  getKeys);
router.get("/pending",  pendingKeys);
router.post("/pending",  creatependingKeys);
router.post("/",  createKey);
router.get("/:id",  getkeyById);
router.get("/all/:email",  getAllkeysByinstitution);
router.get("/active/:email",  getActivekeyByinstitution);
router.patch("/:id",  revokeKey);
router.post("/resetPassword",  resetPassword);
router.delete("/", deleteUser);

router.get("/:email/verify/:token",  verifymail);

router.post("/mailPasswordreset",  mailPasswordreset);

module.exports = router;
