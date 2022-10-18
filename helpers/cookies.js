import cookies from "js-cookie";

const cookiesHandler = {
  setCookie: (name, value, days) => {
    return cookies.set(name, value, { expires: days });
  },

  getCookie: (name) => {
    return cookies.get(name);
  },

  deleteCookie: (name) => {
    return cookies.remove(name);
  },
};

export default cookiesHandler;
