import cookie from "js-cookie";
import nextCookies from "next-cookies";
import Router from "next/router";

export const login = (token = undefined) => {
  if (!token) return;

  cookie.set("token", token, { expires: 1 });
  Router.push("/");
};

export const auth = (ctx) => {
  const cookies = nextCookies(ctx);

  if (!cookies) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else {
      return Router.push("/");
    }
  }

  return cookies;
};

export const unauthorized = (ctx) => {
  if (typeof window === "undefined") {
    cookie.remove("token");
    cookie.remove("user");

    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
  } else {
    cookie.remove("token");
    cookie.remove("user");

    Router.push("/");
  }
};

export const logout = () => {
  cookie.remove("token");
  cookie.remove("user");

  Router.push("/");
};
