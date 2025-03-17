import React, { useContext } from "react";
import { AppContent } from "../context/AppContent";

function Header() {
  const { userData } = useContext(AppContent);
  console.log(userData);
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>
        <h1 className="font-bold text-3xl uppercase">
          My name is {userData ? userData.email : "Developer "}
        </h1>
      </div>
    </div>
  );
}

export default Header;
