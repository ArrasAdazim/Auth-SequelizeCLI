const { UserDetail, User } = require("../models");
const { userDetailSchema } = require("../utils/validateSchema");

const createUserDetail = async (req, res) => {
  const { firstName, lastName, address, phone } = req.body;

  const { error } = userDetailSchema.validate({
    firstName,
    lastName,
    address,
    phone,
  });
  if (error) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: error.details[0].message,
      data: null,
    });
  }

  try {
    const checkUser = await UserDetail.findOne({
      where: { userId: req.user.id },
    });

    if (checkUser) {
      return res.status(400).json({
        status: "BAD REQUEST",
        message: "UserDetail already exists",
        data: null,
      });
    }

    const userDetail = await UserDetail.create({
      userId: req.user.id,
      firstName,
      lastName,
      address,
      phone,
    });

    const response = {
      status: "CREATED",
      message: "SUCCESSFULLY CREATED USER DETAIL",
      data: userDetail,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const userDetail = await UserDetail.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: "user" }],
    });

    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }
    const response = {
      status: "OK",
      message: "SUCCESSFULLY UPDATED USER DETAIL",
      data: userDetail,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const updateUserDetail = async (req, res) => {
  const { firstName, lastName, address, phone } = req.body;

  const { error } = userDetailSchema.validate({
    firstName,
    lastName,
    address,
    phone,
  });
  if (error) {
    return res.status(400).json({
      status: "BAD REQUEST",
      message: error.details[0].message,
      data: null,
    });
  }

  try {
    const userDetail = await UserDetail.findOne({
      where: { userId: req.user.id },
    });
    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }

    userDetail.firstName = firstName;
    userDetail.lastName = lastName;
    userDetail.address = address;
    userDetail.phone = phone;
    await userDetail.save();
    const response = {
      status: "OK",
      message: "SUCCESSFULLY UPDATED USER DETAIL",
      data: userDetail,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

const deleteUserDetail = async (req, res) => {
  try {
    const userDetail = await UserDetail.findOne({
      where: { userId: req.user.id },
    });
    if (!userDetail) {
      return res.status(404).json({
        status: "NOT FOUND",
        message: "UserDetail not found",
        data: null,
      });
    }
    await userDetail.destroy();
    res
      .status(200)
      .json({ status: "OK", message: "SUCCESSFULLY DELETED USER DETAIL" });
  } catch (error) {
    res.status(500).json({
      status: "INTERNAL SERVER ERROR",
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  createUserDetail,
  getUserDetail,
  updateUserDetail,
  deleteUserDetail,
};
