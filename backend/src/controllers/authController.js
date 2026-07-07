const User = require('../models/User');

exports.me = async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = await User.findById(req.session.userId);
  res.json({ user: user || null });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findByEmail(email.trim().toLowerCase());
    if (!user || !(await User.verifyPassword(user, password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!user.is_active) return res.status(403).json({ error: 'Account is deactivated.' });

    req.session.userId    = user.id;
    req.session.userEmail = user.email;
    req.session.userName  = user.full_name;
    req.session.role      = user.role;

    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (err) { next(err); }
};

exports.register = async (req, res, next) => {
  try {
    const { full_name, email, phone, password, confirm_password } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });
    if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

    const existing = await User.findByEmail(email.trim().toLowerCase());
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const user = await User.create({ email: email.trim().toLowerCase(), password, full_name, phone });
    req.session.userId    = user.id;
    req.session.userEmail = user.email;
    req.session.userName  = user.full_name;
    req.session.role      = user.role;

    res.status(201).json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
};
