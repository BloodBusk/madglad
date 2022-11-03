 
  export const validateRepeatPassword = (password, repeatPassword) => {
    if (!repeatPassword) {
      return "Repeat password field cannot be empty";
    } else if (password !== repeatPassword) {
      return "Password and repeat password must be the same";
    }
  };
  
  export const validateEmptyField = (field, fieldName) => {
    if (!field) {
      return fieldName + " cannot be empty";
    } else if (field.length < 3) {
      return fieldName + " has to be greater than 3 characters";
    }
  };

  export const validateUserAlreadyExists = (email, dbEmail) => {
    if (email === dbEmail) {
      return "Email already exists";
    }
  };