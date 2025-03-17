import React, { useContext, useState } from "react";
import { AppContent } from "../context/AppContent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContent);

  axios.defaults.withCredentials = true;

  const inputRef = React.useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // statemanagement
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (data.success) {
        setIsEmailSent(true);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRef.current.map((e) => e.value);
    const otp = otpArray.join("");
    setOtp(otp);
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      if (data.success) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="bg-amber-400 p-4">
        {!isEmailSent && (
          <div>
            <h1>Reset Password</h1>

            <form className="space-y-4">
              <div>
                <label>enter Email:</label>
                <input
                  type="email"
                  className="outline-1"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <button onClick={onSubmitEmail} className="bg-blue-600 p-4 ">
                Send otp
              </button>
            </form>
          </div>
        )}

        {!isOtpSubmited && isEmailSent && (
          <div
            onPaste={(e) => pasteHandler(e)}
            className="shadow-2xs bg-gradient-to-br from-indigo-700 to-blue-700 flex flex-col justify-center items-center p-10 gap-4"
          >
            <h1>Reset password</h1>
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
              onClick={onSubmitOtp}
              className="bg-amber-300 p-2 cursor-pointer w-full"
            >
              Verify
            </button>
          </div>
        )}

        {isOtpSubmited && isEmailSent && (
          <div>
            <h1>Reset New Password</h1>

            <form className="space-y-4">
              <div>
                <label>enter New Password:</label>
                <input
                  type="text"
                  className="outline-1"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <button
                onClick={onSubmitNewPassword}
                className="bg-blue-600 p-4 "
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
