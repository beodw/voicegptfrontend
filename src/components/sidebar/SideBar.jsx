import ModelSelection from "./ModelSelection";
import NewChat from "./NewChat";
import { useDispatch, useSelector } from "react-redux";
import { toggleSurvey } from "../../redux/appStateSlice";

const SideBar = ({ showModal }) => {

  const appState = useSelector((s)=>s.appState)
  const dispatch = useDispatch()

  const showSurvey = ()=> {
    dispatch(toggleSurvey(s=> !s.surveyModalIsVisible))
  }

  return (
    <div
      className={`fixed md:sticky top-0 bottom-0 left-0 bg-[#202123] max-w-[15rem] lg:max-w-[300px] h-screen overflow-y-auto min-w-[15rem] lg:w-full p-2 flex flex-col transition-transform duration-200 ease-linear z-10 md:translate-x-0 ${
        showModal ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex overflow-y-auto bg-red grow">
        <div className="bg-red flex flex-col grow">
          {/* new chat */}
          <NewChat />

          <div className="grow"></div>

          {/* <div className="flex justify-center w-full animate-pulse">
            <button onClick={showSurvey} className="truncate w-40 chatRow">Win A Reward</button>
          </div> */}
          
          
          <div>
            <ModelSelection />
          </div>

          {/* map through Chart rows*/}
          <div className="flex flex-col space-y-2 my-2">
            {false && (
              <div className="animate-pulse text-center text-white">
                <p>Loading chats</p>
              </div>
            )}

            {/* {chats?.docs.map((chat) => {
              return <ChatRow key={chat.id} id={chat.id} />;
            })} */}
          </div>
        </div>
      </div>

      {false && (
        <div
          // onClick={() => signOut()}
          className="flex space-x-3 items-center justify-center cursor-pointer hover:opacity-50 mb-2 p-1 bg-primary text-gray-500 w-full rounded"
        >
          {/* <img
            className="min-h-6 h-6 w-6 rounded-full cursor-pointer"
            src={
              false?.image! ||
              `https://ui-avatars.com/api/?name=${session.user?.name}`
            }
            alt={`${session.user?.name!}'s profile picture`}
          /> */}

          <p className="text-lg font-bold text-gray-500">Log Out</p>
        </div>
      )}
    </div>
  );
};

export default SideBar;
