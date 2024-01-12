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

function storeDataInLocalStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error storing data in local storage:', error);
  }
}

function retrieveDataFromLocalStorage(key) {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      console.log('No data found in local storage for the given key.');
      return null;
    }

    const parsedData = JSON.parse(serializedData);
    return parsedData;
  } catch (error) {
    console.error('Error retrieving data from local storage:', error);
    return null;
  }
}

export {setAuthCookieVal, retrieveCookie, storeDataInLocalStorage, retrieveDataFromLocalStorage, autheCookieChangeEvent}