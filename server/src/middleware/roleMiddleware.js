// isAdmin – only admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
  next();
};

// isManager – only manager
exports.isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({
      message: "Access denied. Managers only.",
    });
  }
  next();
};

// isAdminOrManager – admin OR manager
exports.isAdminOrManager = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({
      message: "Access denied. Admin or Manager only.",
    });
  }
  next();
};

// isEmployee – only employee
exports.isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({
      message: "Access denied. Employees only.",
    });
  }
  next();
};