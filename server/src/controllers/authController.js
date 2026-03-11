const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();
const pool = require("../config/db");

exports.signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.createUser(
      name,
      email,
      hashedPassword
    );

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

exports.adminSignup = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,'admin')
       RETURNING *`,
      [name, email, hashedPassword]
    );

    res.json({
      message: "Admin created",
      user: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};