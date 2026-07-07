const User = require('../../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, {
      role:      req.body.role,
      is_active: req.body.is_active,
    });
    res.json(user);
  } catch (err) { next(err); }
};
