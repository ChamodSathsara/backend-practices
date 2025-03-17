import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContent";
import axios from "axios";

function Login() {
  const navigation = useNavigate();

  const [state, setState] = useState("register");

  const { backendUrl, setIsLogedin, getUserData } = useContext(AppContent);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const fogetpass = () => {
    navigation("/reset-password");
  };

  const submethandler = async (a) => {
    try {
      a.preventDefault();

      axios.defaults.withCredentials = true;
      if (state === "register") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          email: user.email,
          password: user.password,
        });

        if (data.success) {
          setIsLogedin(true);
          getUserData();
          navigation("/");
        } else {
          alert(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email: user.email,
          password: user.password,
        });

        if (data.success) {
          setIsLogedin(true);
          getUserData();
          navigation("/");
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="h-screen w-screen flex flrx-col justify-center items-center">
      <div className="bg-amber-200 p-8 flex flex-col justify-center items-center ">
        <div>
          {state === "login" ? <h1>Login User</h1> : <h1>Register User</h1>}
        </div>
        <form>
          <div className="flex flex-col">
            <label htmlFor="">email</label>
            <input
              className="outline-1"
              type="email"
              value={user.email}
              onChange={(e) => {
                e.preventDefault();
                const val = e.target.value;
                setUser((item) => ({
                  ...item,
                  email: val,
                }));
              }}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Password</label>
            <input
              className="outline-1"
              type="password"
              value={user.password}
              onChange={(e) => {
                e.preventDefault();
                const val = e.target.value;
                setUser((item) => ({
                  ...item,
                  password: val,
                }));
              }}
            />
          </div>

          <div>
            {state === "register" && (
              <div className="flex flex-col ">
                <p>
                  yoyhave allready account{" "}
                  <span onClick={() => setState("login")} className="underline">
                    login
                  </span>
                </p>
                <button onClick={submethandler} className="bg-white p-2">
                  Register
                </button>
              </div>
            )}
          </div>

          {state === "login" && (
            <div>
              <p className="underline " onClick={fogetpass}>
                Foget Password
              </p>
            </div>
          )}

          <div>
            {state === "login" && (
              <div className="flex flex-col ">
                <p>
                  you havenot account
                  <span
                    onClick={() => setState("register")}
                    className="underline"
                  >
                    register
                  </span>
                </p>
                <button onClick={submethandler} className="bg-white p-2">
                  Login
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
