import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { HiOutlineLogin } from "react-icons/hi";
import toast from "react-hot-toast";
import "./index.css";
import { BaseUrl } from "../Constants/BaseUrl";
import AxiosInstance from "../Config/AxiosInstance";
const NavBar = ({ name }) => {
  // console.log(name);
  const navigate = useNavigate();
  const [navBar, setnavBar] = useState({
    home: false,
    court: false,
    addNewCourt: false,
  });
  useEffect(() => {
    handleActive(name);
  }, []);
  const { userDetails } = useSelector((state) => state.user);
  // console.log(userDetails);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
    toast.success("Logout successfully");
  };
  const handleActive = (name) => {
    setnavBar({ ...navBar, [name]: true });
  };
  const handleClick = (name) => {
    if (name === "profile") {
      navigate(`/profile/${userDetails._id}`);
    }
  };
  const filterByDistrict = async (district) => {
    try {
      navigate(`/district/${district}`);
    } catch (error) {
      console.log(error);
    }
  };
  const filterBySports = (sports) => {
    navigate(`/sports/${sports}`);
  };
  return (
    <div className="">
      <Navbar fluid>
        <Navbar.Brand href="/home">
          <span className="self-center px-2 md:px-6 whitespace-nowrap text-xl font-semibold dark:text-white">
            Book My Court
          </span>
        </Navbar.Brand>
        <div className="flex md:px-6 md:order-2">
          {userDetails?.email ? (
            <>
              {userDetails?.image ? (
                <>
                  <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                      <Avatar
                        alt="User settings"
                        img={`${BaseUrl}/courts/${userDetails?.image}`}
                        rounded
                      />
                    }
                  >
                    <Dropdown.Header>
                      <span className="block text-sm">
                        {userDetails.first_name} {userDetails.last_name}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        {userDetails?.email}
                      </span>
                    </Dropdown.Header>
                    <Dropdown.Item onClick={() => handleClick("profile")}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item>Booking</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Log out
                    </Dropdown.Item>
                  </Dropdown>
                </>
              ) : (
                <>
                  {" "}
                  <Dropdown arrowIcon={false} inline label={<Avatar rounded />}>
                    <Dropdown.Header>
                      <span className="block text-sm">
                        {userDetails.first_name} {userDetails.last_name}
                      </span>
                      <span className="block truncate text-sm font-medium">
                        {userDetails?.email}
                      </span>
                    </Dropdown.Header>

                    <Dropdown.Item onClick={() => handleClick("profile")}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item>Booking</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Log out
                    </Dropdown.Item>
                  </Dropdown>
                </>
              )}
            </>
          ) : (
            <>
              <Button>
                Login
                <HiOutlineLogin className="ml-2 h-5 w-5" />
              </Button>
            </>
          )}

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            href="/home"
            className={navBar.home && "dark:text-blue-500"}
          >
            Home
          </Navbar.Link>
          <Navbar.Link className={navBar.court && "dark:text-blue-500"}>
            Court
          </Navbar.Link>
          {userDetails?.role === 1 && (
            <>
              <Navbar.Link href="/add-new-court">Add New Court</Navbar.Link>
            </>
          )}

          <Navbar.Link href="/booking">Booking</Navbar.Link>
          <div className="group inline-block">
            <button className=" px-3 cursor-pointer  text-gray-400 rounded-sm flex items-center min-w-32">
              <span className="pr-1 hover:dark:text-blue-500  font-semibold flex-1">
                Categories
              </span>
              <span>
                <svg
                  className="fill-current h-4 w-4 transform group-hover:-rotate-180
  transition duration-150 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </span>
            </button>
            <ul
              className="bg-white hover:dark:text-blue-500 border rounded-sm transform scale-0 group-hover:scale-100 absolute 
  transition duration-150 ease-in-out origin-top min-w-32"
            >
              <li className="rounded-sm relative px-3 py-1 hover:bg-gray-100">
                <button className="w-full text-left flex items-center outline-none focus:outline-none">
                  <span className="pr-1 flex-1">Sports</span>
                  <span className="mr-auto">
                    <svg
                      className="fill-current h-4 w-4
      transition duration-150 ease-in-out"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </span>
                </button>
                <ul
                  className="bg-white border cursor-pointer rounded-sm absolute top-0 right-0 
  transition duration-150 ease-in-out origin-top-left
  min-w-32
  "
                >
                  <li
                    onClick={() => filterBySports("football")}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Football
                  </li>
                  <li
                    onClick={() => filterBySports("cricket")}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Cricket
                  </li>
                  {/* <li className="px-3 py-1 hover:bg-gray-100">Badminton</li>
                  <li className="px-3 py-1 hover:bg-gray-100">Basketball</li>
                  <li className="px-3 py-1 hover:bg-gray-100">Volleyball</li> */}
                </ul>
              </li>
              <li className="rounded-sm relative px-3 py-1 hover:bg-gray-100">
                <button className="w-full text-left flex items-center outline-none focus:outline-none">
                  <span className="pr-1 flex-1">District</span>
                  <span className="mr-auto">
                    <svg
                      className="fill-current h-4 w-4
      transition duration-150 ease-in-out"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </span>
                </button>
                <ul
                  className="bg-white border cursor-pointer rounded-sm absolute top-0 right-0 
  transition duration-150 ease-in-out origin-top-left
  min-w-32
  "
                >
                  <li
                    onClick={() => filterByDistrict("trivandrum")}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Trivandrum
                  </li>
                  <li
                    onClick={() => filterByDistrict("ernakulam")}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Ernakulam
                  </li>
                  <li
                    onClick={() => filterByDistrict("kozhikode")}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    Kozhikode
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
