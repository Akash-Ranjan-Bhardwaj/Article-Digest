const User = require('../models/User');
const ResetToken = require('../models/resetToken');
const transporter = require('../config/nodemailer');
const {resetPasswordTemplate} = require('../utils/emailTemplate');
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ error: 'Login failed' });
  }
};

exports.forgotPassword = async(req, res) => { 
  const {email}= req.body;
  try{
    const user = await user.findOne({email});
    if(!user){
      return res.status(200).json({
        message : 'If an account exists with this email, you will receive a password reset link.',
      });
    }
    const token = crypto.randomBytes(32).toString('hex');

    await ResetToken.create({
      userId : user._id,
      token
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user._id}`;

    await transporter.sendMail({
      from : process.env.EMAIL_USER,
      to :email,
      subject : 'Password Reset Instructions',
      html :resetPasswordTemplate(user.username, resetLink)
    });

    res.status(200).json({message : 'Password reset link send , if email exists.' });

  }catch(err){
    res.status(500).json({error : 'could not process the password reset request.'})
  }

};

exports.resetPassword = async(req, res) =>{
  const {userId, token, newPassword} = req.body;

  try{
    if(!userId || !token || !newPassword){
      return res.status(400).json({error : 'missing required fields'});
    }

    const resetToken = await ResetToken.findOne({userId, token});

    if(!resetToken){
      return res.status(400).json({error : 'invalid or expired token'});
    }

    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({error : 'user not found'});
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if(isSamePassword){
      return res.status(400).json({error : 'New password must be different from the current password'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await ResetToken.deleteOne({token});

    res.cookie('jwt', '', {maxAge: 1});

    res.status(200).json({message : 'Password updated successfully'});

  }catch(err){
    res.status(500).json({error : 'could not reset password'});
  }

};


exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out' });
};
