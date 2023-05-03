export const validatePassword = (
  password: string,
  confirmPW: string | null
) => {
  if (password.length < 6) {
    return 'Passwords must be at least 6 characters long';
  } else if (confirmPW && password !== confirmPW) {
    return 'Passwords must be matching';
  }
};

export const validateEmail = (email: string) => {
  const isValidEmail = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (!isValidEmail) {
    return 'Must be a valid email address';
  }
};

export const validateName = (name: string) => {
  if (name.length < 3) {
    return 'Name must be at least 3 characters';
  }
};

export const validateUrl = (url: string) => {
  const urls = ['/', '/admin', '/app'];
  if (urls.includes(url)) {
    return url;
  }
  return '/';
};
