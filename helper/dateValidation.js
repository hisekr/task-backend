const validateDate = (givenDate, currentDate) => {
  if (givenDate > currentDate) {
    return false;
  } else {
    return true;
  }
};

module.exports = validateDate;
