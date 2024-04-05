const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js");

dotenv.config();

//=============================================================

const secret_key = process.env.FRONTEND_SECRET_KEY;

const serverSecretKey = process.env.SECRET_KEY;

//==============================================================

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, serverSecretKey);
};

//=============================================================
//=============================================================

const signup = async (req, res) => {
  try {
    const { name, email, phone, password, dob, address } = req.body;

    //-----------------------------------------------------------

    const isValidEmail = email.endsWith(".com") && email.includes("@");
    const isValidPhoneNumber = phone.length === 10;

    if (!isValidEmail && !isValidPhoneNumber) {
      return res
        .status(400)
        .json({ error: "Incorrect Format of Email and Password" });
    } else if (!isValidEmail) {
      return res.status(400).json({ error: "Invalid Email" });
    } else if (!isValidPhoneNumber) {
      return res.status(400).json({ error: "Invalid Phone Number" });
    }

    //-----------------------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //-------------------------------------------------------------

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      dob,
      address,
    });

    res.status(200).json({ message: "Account Created Successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//=================================================================
//=================================================================

const login = async (req, res) => {
  try {
    //-------------------------------------------------------------
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    //-------------------------------------------------------------

    if (!user) {
      return res.status(404).json({ error: "Invalid Email or Password" });
    }

    //------------------------------------------------------------

    const decryptedStoredPassword = CryptoJS.AES.decrypt(
      password,
      secret_key
    ).toString(CryptoJS.enc.Utf8);

    const validPassword = await bcrypt.compare(
      decryptedStoredPassword,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Wrong password" });
    }

    //--------------------------------------------------------------

    const token = generateToken(user.id);
    console.log("user.email", user.email);

    // res.header("Authorization", `Bearer ${token}`);
    res.status(200).json({ userEmail: user.email, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };
