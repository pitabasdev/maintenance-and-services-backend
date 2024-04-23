const route = require("express").Router();

const {
  signUp,
  signIn,
  logOut,
  contact,
  getAllUsers,
  addServices,
  getAllSerices
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/signup", signUp);
route.post("/signIn", signIn);
route.get("/logOut", logOut);
route.post("/contact", contact);
route.post('/addservices',addServices);
route.get("/getAllUsers", getAllUsers);

route.get("/getAllSerices", getAllSerices);

module.exports = route;
