const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createProject,

  getProjectById,
  getProjects,
  updateProjects,
deleteProjects
} = require("./project.controller");
router.get("/",  getProjects);
router.post("/", checkToken, createProject);
router.get("/:id", checkToken, getProjectById);
router.patch("/", checkToken, updateProjects);
router.delete("/", checkToken, deleteProjects);

module.exports = router;
