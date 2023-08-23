import './App.css';
import Page from './app/page';
import RootLayout from './app/layout';
import { useEffect, useState } from 'react';
import LoginPage from './components/layout/LoginPage';
import { retrieveCookie } from "./lib/session";
function App() {
  const [authCookie, setAuthCookieState] = useState(null);

  useEffect(() => {
    const authCoookieVal = retrieveCookie("voiceGPTAuthToken");
    setAuthCookieState(authCoookieVal ?? null);
    // add event listener for auth state
    document.body.addEventListener("authCookieChanged", () => {
      const authCookieVals = retrieveCookie("voiceGPTAuthToken");
      setAuthCookieState(authCookieVals ?? null);
    });

      authCoookieVal &&
       fetch("https://tl66le4fdc5n3exuvyopygfyaq0ddvmn.lambda-url.eu-west-2.on.aws",{method: "POST", body:JSON.stringify({oauthCode: authCoookieVal})}).then(r => {
              setAuthCookieState(authCoookieVal ?? null);
        }).catch(e =>{console.error(e); alert("Could not login! Check internet or contact admin if problem persists.")})
  },[]);

  const appComponents = (
      <RootLayout>
        <Page/>
      </RootLayout>
  );

  const loginPage = <LoginPage/>;

  return authCookie ? appComponents : loginPage;
}

export default App;
