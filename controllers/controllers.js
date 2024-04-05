const User = require("../models/user");
const ExcelJS = require("exceljs");
const xlsx = require("xlsx");
const { Op } = require("sequelize");
const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

const CryptoJS = require("crypto-js");
const isEmailValid = require("../helper/emailValidation");
const dateValidation = require("../helper/dateValidation");

const secret_key = process.env.FRONTEND_SECRET_KEY;

//=====================================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({});

    return users;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//=====================================================================

const getAllUsers = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findAll({
      where: { email: { [Op.ne]: email } },
    });

    if (!user) {
      res.status(404).json({ error: "User Not Found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//=====================================================================

const getExcelSheet = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { email: { [Op.ne]: req.params.email } },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Excel-sheet");

    const rowValues = Object.keys(users[0].dataValues);

    const withoutIdAndPassword = rowValues.filter((item) => {
      return (
        item !== "password" &&
        item !== "createdAt" &&
        item !== "updatedAt" &&
        item !== "id"
      );
    });

    worksheet.addRow(withoutIdAndPassword);

    users.forEach((user) => {
      worksheet.addRow([
        user.name,
        user.email,
        user.phone,
        user.dob,
        user.address,
      ]);
    });

    const filePath = path.join(__dirname, "output.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent("output.xlsx")}`
    );

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        fs.unlinkSync(filePath);
        console.log("file unlinked");
      }
      console.log("file downloaded");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//======================================================================

const downloadSample = async (req, res) => {
  try {
    const users = await User.findAll({});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Excel-sheet");

    const rowValues = Object.keys(users[0].dataValues);

    const withoutPassword = rowValues.filter((item) => {
      return (
        item !== "password" &&
        item !== "createdAt" &&
        item !== "updatedAt" &&
        item !== "id"
      );
    });

    worksheet.addRow(withoutPassword);

    const filePath = path.join(__dirname, "sample.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent("output.xlsx")}`
    );

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        fs.unlinkSync(filePath);
        console.log("FIle Unlinked");
      }
      console.log("File Downloaded");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//==========================================================================

const readData = async (fileName, req, res) => {
  try {
    const uploadDir = "uploads/";
    const filePath = path.join(uploadDir, fileName);

    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);

    return data;
  } catch (error) {
    throw new Error({ error: "An error occured while reading data" });
  }
};

//=================================================================================

const handleUploadProcess = async (req, res) => {
  try {
    const fileName = req.file.filename;

    const readedData = await readData(fileName, req, res);

    const allData = await getUsers();

    for (const item of readedData) {
      const matchingUser = allData.find(
        (user) => user.dataValues.email === item.email
      );
      if (matchingUser) {
        let givenDate = item.dob;
        console.log("given date", givenDate);
        let currentDate = new Date();
        givenDate = new Date(givenDate);

        if (item.phone.toString().length !== 10) {
          return res.status(400).json({ error: "Invalid Phone Number" });
        } else if (dateValidation(givenDate, currentDate) === false) {
          return res.status(400).json({ error: "Invalid Date" });
        } else {
          const newData = {
            id: item.id,
            name: item.name,
            phone: item.phone,
            dob: item.dob,
            address: item.address,
          };

          await updateUserByEmail(matchingUser.dataValues.email, newData);

          console.log("executed successfully");

          console.log({ message: "User updated successfully" });
        }
      } else {
        let givenDate = item.dob;
        let currentDate = new Date();
        givenDate = new Date(givenDate);

        if (isEmailValid(item.email) === false) {
          return res.status(400).json({ error: "Wrong Email Format" });
        } else if (item.phone.toString().length !== 10) {
          return res.status(400).json({ error: "Invalid Phone Number" });
        } else if (dateValidation(givenDate, currentDate) === false) {
          return res.status(400).json({ error: "Invalid Date" });
        } else {
          const userData = {
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            dob: item.dob || "",
            address: item.address || "",
            password: "",
          };

          await createUser(userData);

          console.log({ message: "User created successfully" });
        }
      }
    }

    fs.unlinkSync(`uploads/${fileName}`);

    return res.status(200).json({ message: "All users updated successfully" });
  } catch (error) {
    console.error("Error uploading or processing file:", error);
    return res.status(500).json({ error: "Error Updating User" });
  }
};

//=====================================================================================

const specificUserDetails = async (email, req, res) => {
  try {
    const singleUser = await User.findOne({ where: { email: email } });

    if (!singleUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return singleUser;
  } catch (error) {
    console.error("Error finding user by email:", error);
  }
};

//======================================================================================

const updateUserByEmail = async (email, newData) => {
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      console.log({ error: "Error: User not found" });
      throw new Error("User not found");
    }

    await user.update(newData);

    return { message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user by email:", error);
    throw new Error("Internal Server Error");
  }
};

//=======================================================================================

const createUser = async (userData) => {
  try {
    const { name, email, phone, password, dob, address } = userData;

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      dob,
      address,
    });

    return { message: "User created successfully", user: newUser };
  } catch (error) {
    throw new Error(error.message);
  }
};

//=======================================================================================

const forgotPassword = async (req, res) => {
  try {
    //---------------------------------------------------------------------------------
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    //---------------------------------------------------------------------------------

    if (!user) {
      return res.status(404).json({ error: "Invalid Email " });
    }

    //---------------------------------------------------------------------------------

    const decryptedStoredPassword = CryptoJS.AES.decrypt(
      password,
      secret_key
    ).toString(CryptoJS.enc.Utf8);

    console.log("decrypted", decryptedStoredPassword);

    const validPassword = await bcrypt.hash(decryptedStoredPassword, 10);

    console.log("valid", validPassword);

    await User.update({ password: validPassword }, { where: { email } });

    //--------------------------------------------------------------

    res.status(200).json({ userEmail: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getAllUsers,
  getExcelSheet,
  downloadSample,
  readData,
  specificUserDetails,
  updateUserByEmail,
  handleUploadProcess,
  forgotPassword,
};
