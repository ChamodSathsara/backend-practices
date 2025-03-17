import React, { useContext, useEffect } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmailVerify() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const { backendUrl, getUserData, isLogedin, userData } =
    useContext(AppContent);

  const inputRef = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    isLogedin && userData && userData.isVerify && navigate("/");
    console.log(userData.isVerify);
  }, [isLogedin, userData]);

  const verifyHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRef.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        alert(data.message);
        getUserData();
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const pasteHandler = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    console.log(pasteArray);
    pasteArray.forEach((char, index) => {
      console.log(char, "  ", index);
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div
        onPaste={(e) => pasteHandler(e)}
        className="shadow-2xs bg-gradient-to-br from-indigo-700 to-blue-700 flex flex-col justify-center items-center p-10 gap-4"
      >
        <h1>Email Verify Code</h1>
        <p>Enter the 6 digits Otp sended to your Email</p>
        <div className="space-x-1">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-slate-500 text-white text-center text-xl rounded-md"
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          onClick={verifyHandler}
          className="bg-amber-300 p-2 cursor-pointer w-full"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default EmailVerify;
