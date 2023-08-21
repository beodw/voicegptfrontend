"use client";
import { ChatGptIcon, GoogleIcon, AppleIcon, MicrosoftIcon } from "../../lib/icons";
import { useGoogleLogin } from "@react-oauth/google";
import AppleLogin from 'react-apple-login'
import { autheCookieChangeEvent, setAuthCookieVal } from "../../lib/session";

const LoginPage = () => {

  const googleLogin = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: async (codeResponse) => {
        fetch("https://tl66le4fdc5n3exuvyopygfyaq0ddvmn.lambda-url.eu-west-2.on.aws",{method: "POST", body:JSON.stringify({oauthCode: codeResponse.code})}).then(r => {
          const currentDate = new Date();
          currentDate.setMonth(currentDate.getMonth() + 6);
          setAuthCookieVal("voiceGPTAuthToken", codeResponse.code, currentDate)
          document.body.dispatchEvent(autheCookieChangeEvent);
        }).catch(e =>{console.error(e); alert("Could not login!")})
       
      },
      onError: errorResponse => {alert("Could not log in!"); console.error(errorResponse);}
  });

  return (
        <div className="bg-primary h-screen flex flex-col items-center justify-center text-center ">
          {/* <AppleLogin render={(props)=> (<div {...props}>apple login</div>)} usePopup={true} clientId="com.react.apple.login" redirectURI="https://redirectUrl.com" />*/}
          <ChatGptIcon class="h-24 w-24" />

          <button
            onClick={googleLogin}
            className="bg-white flex items-center rounded text-black font-bold text-xl p-3 mt-10 transition-colors duration-150"
          >
            <span>Log in with</span>  <GoogleIcon cs="h-8 w-8 ml-2"/>
          </button>

          {/* <button
            onClick={() =>{}}
            className="bg-white flex items-center rounded text-black font-bold text-xl p-3 mt-10 transition-colors duration-150"
          >
            <span>Log in with</span>  <AppleIcon cs="h-8 w-8 ml-2"/>
          </button>

          <button
            onClick={() =>{}}
            className="bg-white flex items-center rounded text-black font-bold text-xl p-3 mt-10 transition-colors duration-150"
          >
            <span>Log in with</span>  <MicrosoftIcon cs="h-8 w-8 ml-2"/>
          </button> */}
          
        </div>
  );
};

export default LoginPage;