const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Contact = require("../model/contactModel");
const jsonwebtoken = require("jsonwebtoken");
const Services = require("../model/servicesModel");
const signUp = async (req, resp) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return resp.status(400).json({ message: "Email Already Exist" });
    }
    const result = await userData.save();
    resp.status(200).json(result);
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const signIn = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "Email not Exists" });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return resp.status(401).json({ message: "Email or password invalid" });
    }

    const tokenExist = req.cookies.token;
    if (tokenExist) {
      return resp.status(400).json({ message: "You are already logged in" });
    }

    const token = jsonwebtoken.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    resp.cookie("token", token, { httpOnly: true, maxAge: 30000000 });

    resp.status(200).json({ message: "Login Successfully" });
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const logOut = async (req, resp) => {
  try {
    const tokenExist = req.cookies.token;
    if (!tokenExist) {
      return resp.status(400).json({ message: "Login Required" });
    }
    resp.clearCookie("token");
    resp.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const Update = async (req, resp) => {
  try {
    const id = req.params.id;

    const userExist = await User.findOne({ _id: id });
    if (!userExist) {
      return resp.status(400).json({ message: "User Not Found!" });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    resp.status(200).json(user);
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const contact = async (req, resp) => {
  try {
    const userData = new Contact(req.body);
    const result = await userData.save();
    resp.status(200).json(result);
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { name: 1, email: 1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addServices = async (req, resp) => {
  try {
    const userData = new Services(req.body);
    const result = await userData.save();
    resp.status(200).json(result);
  } catch (error) {
    resp.status(500).json({ error: error });
  }
};
const getAllSerices = async (req, res) => {
  try {
    const users = await Services.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}
module.exports = {
  signUp,
  signIn,
  logOut,
  Update,
  contact,
  getAllUsers,
  addServices,
  getAllSerices
};
