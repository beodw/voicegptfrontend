import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import Chat from "./chat/[id]/page";

const Page = () => {
  return (
    <section className="flex flex-col flex-1 items-center justify-center min-h-screen max-h-screen overflow-clip py-6 md:-0 px-2 text-white">
      <Chat params={{id:""}}/>
    </section>
  );
};

export default Page;
