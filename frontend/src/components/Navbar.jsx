import React, { useContext } from "react";
import { AppContent } from "../context/AppContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigation = useNavigate();
  const { userData, backendUrl, setUserData, setIsLogedin } =
    useContext(AppContent);

  const logoutHandler = async (a) => {
    axios.defaults.withCredentials = true;
    try {
      a.preventDefault();
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setUserData(false);
        setIsLogedin(false);
        navigation("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const verifyEmailHandler = async (a) => {
    try {
      axios.defaults.withCredentials = true;
      a.preventDefault();
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        navigation("/email-verify");
        alert(data.message);
      }else{
        alert(data.message)
      }
    } catch (error) {
        alert(error.message)
    }
  };

  return (
    <div className="flex justify-between items-center px-16 pt-3">
      <h1 className="font-semibold">Home</h1>

      {!userData ? (
        <button
          onClick={() => navigation("/login")}
          className="cursor-pointer hover:scale-125 bg-indigo-700 text-blue-100 font-bold p-2"
        >
          login
        </button>
      ) : (
        <div className="bg-blue-600 font-bold rounded-full text-white p-4 relative group w-10 h-10">
          {userData.email[0].toUpperCase()}
          <div className="hidden absolute group-hover:block top-10 right-0 z-10 text-black  pt-2 ">
            <ul className="bg-slate-400 p-2 text-sm m-0">
              {!userData.isVerify && (
                <li
                  onClick={verifyEmailHandler}
                  className="hover:bg-amber-200 w-full"
                >
                  Verify_Email
                </li>
              )}

              <li onClick={logoutHandler} className="hover:bg-amber-200 w-full">
                LogOut
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
