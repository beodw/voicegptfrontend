// import { getServerSession } from "next-auth";
// import LoginPage from "../components/layout/LoginPage";

// import SessionProvider from "../components/layout/SessionProvider";
// import { authOptions } from "../pages/api/auth/[...nextauth]";
import "../index.css";
import AppLayOut from "./AppLayOut";

export default function RootLayout({
  children,
}) {
  // const session = await getServerSession(authOptions);

  return <AppLayOut>{children}</AppLayOut>;
    {/* <SessionProvider session={session}> */}
        
        {/* </SessionProvider> */}
     

}
