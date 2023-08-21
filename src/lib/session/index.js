const autheCookieChangeEvent = new CustomEvent("authCookieChanged", {bubbles: true})

const setAuthCookieVal = (name, value, daysToExpire) => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysToExpire);

      const cookieValue = encodeURIComponent(value) + (daysToExpire ? `; expires=${expirationDate.toUTCString()}` : '');

      document.cookie = `${name}=${cookieValue}; path=/`;

      return cookieValue;
}



 const retrieveCookie = (name) => {
      const cookies = document.cookie.split('; ');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
          return decodeURIComponent(cookieValue);
        }
      }
  }

export {setAuthCookieVal, retrieveCookie, autheCookieChangeEvent}