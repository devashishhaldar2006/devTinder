const validator=require("validator");

const validateSignUpData = (req) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  else if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

};

const validateProfileEditData = (req) => {
  const ALLOWED_EDIT_FIELDS = ["name","about","skills","photoUrl","gender"];
  const isEditAllowed= Object.keys(req.body).every((key) => ALLOWED_EDIT_FIELDS.includes(key));
  return isEditAllowed;

};
module.exports = { validateSignUpData, validateProfileEditData };