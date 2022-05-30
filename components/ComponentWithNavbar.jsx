import { useEffect, useState } from "react";
import Navbar from "./Navbar";

const ComponentWithNavbar = ({ children, searchValue, setSearchValue }) => {
  // const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar searchTerm={searchValue} setSearchTerm={setSearchValue} />
      </div>

      {children}
    </div>
  );
}

export default ComponentWithNavbar