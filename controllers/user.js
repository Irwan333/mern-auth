const User = require("../models/user");

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User tidak ditemukan"
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  });
};

exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;

  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User tidak ditemukan"
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Nama harus diisi"
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          error: "Password minimal 8 karakter"
        });
      } else {
        if (password === password) {
          return res.status(400).json({
            error: "Password sama dengan sebelumnya"
          });
        } else {
          user.password = password;
        }
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update gagal!"
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
