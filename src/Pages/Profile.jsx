import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import { useSelector } from "react-redux";
import { Avatar } from "flowbite-react";
import { FaUserCircle } from "react-icons/fa";
import { Banner, Modal } from "flowbite-react";
import { Card } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { FileInput } from "flowbite-react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";   
import AxiosInstance from "../Config/AxiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Toolkit/userSlice";
import { BaseUrl } from "../Constants/BaseUrl";
const Profile = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.user);
  console.log(userDetails.image);
  const [loading, setloading] = useState(false);
  const [updating, setupdating] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [firstNameModal, setfirstNameModal] = useState(false);
  const [lastNameModal, setlastNameModal] = useState(false);
  const [emailModal, setemailModal] = useState(false);
  const [editedFirstName, seteditedFirstName] = useState(
    userDetails.first_name
  );
  const [editedLastName, seteditedLastName] = useState(userDetails.last_name);
  const [editedEmail, seteditedEmail] = useState(userDetails.email);
  const [activeClass, setactiveClass] = useState({
    profile: true,
    personal: false,
    security: false,
    wallet: false,
  });
  const [password, setpassword] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password.oldPass === "") {
      return toast.error("Please enter old password");
    }
    if (password.newPass !== password.confirmPass) {
      return toast.error("Password doesn't match");
    } else {
      setupdating(true);
      const { data } = await AxiosInstance.post("/user/edit-password", {
        password,
      });
      setupdating(false);
      if (data.success) {
        toast.success(data.message);
        setpassword({ ...password, newPass: "", oldPass: "", confirmPass: "" });
      } else {
        toast.error(data.message);
      }
    }
  };
  const handleImage = async (e) => {
    try {
      // setimage(e.target.files[0]);
      let fileData = new FormData();
      fileData.append("profile", e.target.files[0]);
      setloading(true);
      const { data } = await AxiosInstance.post(
        "/user/update-profile-image",
        fileData,
        {
          params: { userId: userDetails._id },
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log(JSON.parse(localStorage.getItem("user")));
        dispatch(setUserDetails(data?.user));
        setopenModal(false);
        setloading(false);
      } else if (data.noToken || data.tokenExp) {
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const activateFirstNameModal = (e) => {
    e.preventDefault();
    setfirstNameModal(true);
  };
  const activateLastNameModal = (e) => {
    e.preventDefault();
    setlastNameModal(true);
  };
  const activateEmailModal = (e) => {
    e.preventDefault();
    setemailModal(true);
  };
  const updateFirstName = async () => {
    try {
      setupdating(true);
      const { data } = await AxiosInstance.post("/user/edit-first-name", {
        editedFirstName,
      });
      setupdating(false);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(setUserDetails(data?.user));
        setfirstNameModal(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLastName = async () => {
    try {
      setupdating(true);
      const { data } = await AxiosInstance.post("/user/edit-last-name", {
        editedLastName,
      });
      setupdating(false);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(setUserDetails(data?.user));
        setlastNameModal(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateEmail = async () => {
    try {
      setupdating(true);
      const { data } = await AxiosInstance.post("/user/edit-email", {
        editedEmail,
      });
      setupdating(false);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(setUserDetails(data?.user));
        setemailModal(false);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen pb-20 dark:bg-gray-900">
      <NavBar />
      {loading ? (
        <>
          <div className="w-full  h-screen flex justify-center items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setopenModal(false)}
            popup
          >
            <Modal.Header />
            <div className="flex w-full items-center justify-center">
              <Label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <FileInput
                  onChange={handleImage}
                  id="dropzone-file"
                  className="hidden"
                />
              </Label>
            </div>
          </Modal>

          <div className="w-full px-20  md:px-80 py-10 dark:bg-gray-900 h-screen">
            <div className="flex justify-between gap-5 mb-20 flex-wrap text-white uppercase">
              <button
                onClick={() =>
                  setactiveClass({
                    ...activeClass,
                    profile: true,
                    personal: false,
                    security: false,
                    wallet: false,
                  })
                }
                className={`uppercase px-4 py-2 ${
                  activeClass.profile
                    ? "bg-blue-600 hover:bg-blue-800 outline-none"
                    : "hover:bg-blue-600 outline outline-pink-700"
                } rounded`}
              >
                Profile
              </button>
              <button
                onClick={() =>
                  setactiveClass({
                    ...activeClass,
                    profile: false,
                    personal: true,
                    security: false,
                    wallet: false,
                  })
                }
                className={`uppercase px-4 py-2 ${
                  activeClass.personal
                    ? "bg-blue-600 hover:bg-blue-800 outline-none"
                    : "hover:bg-blue-600 outline outline-pink-700"
                } rounded`}
              >
                Personal
              </button>
              <button
                onClick={() =>
                  setactiveClass({
                    ...activeClass,
                    profile: false,
                    personal: false,
                    security: true,
                    wallet: false,
                  })
                }
                className={`uppercase px-4 py-2 ${
                  activeClass.security
                    ? "bg-blue-600 hover:bg-blue-800 outline-none"
                    : "hover:bg-blue-600 outline outline-pink-700"
                } rounded`}
              >
                Security
              </button>
              {/* <button
                onClick={() =>
                  setactiveClass({
                    ...activeClass,
                    profile: false,
                    personal: false,
                    security: false,
                    wallet: true,
                  })
                }
                className={`uppercase px-4 py-2 ${
                  activeClass.wallet
                    ? "bg-blue-600 hover:bg-blue-800 outline-none"
                    : "hover:bg-blue-600 outline outline-pink-700"
                } rounded`}
              >
                Wallet{" "}
              </button> */}
            </div>
            <div className="">
              {activeClass.profile && (
                <>
                  <div className="flex justify-center">
                    <Card className="max-w-sm">
                      <div className="flex flex-col items-center pb-10">
                        <div className="">
                          {!userDetails.image || userDetails.image === "" ? (
                            <>
                              <div className="h-40 w-40 ">
                                <Avatar rounded size={"xl"} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mb-2">
                                <img
                                  className="w-40 h-40 rounded-full"
                                  src={`${BaseUrl}/courts/${userDetails?.image}`}
                                  alt="DP"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <h5 className="mb- mt- uppercase text-xl font-medium text-gray-900 dark:text-white">
                          {userDetails.first_name} {userDetails.last_name}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {userDetails.email}
                        </span>
                        <div className="mt-4 flex space-x-3 lg:mt-6">
                          <a
                            onClick={() => setopenModal(true)}
                            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                          >
                            Upload photo
                          </a>
                          <a
                            href="/home"
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                          >
                            Go Home
                          </a>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
              {activeClass.personal && (
                <>
                  <div className="">
                    <Card className="max-w-lg pb-5 mx-auto">
                      <form className="flex flex-col gap-4">
                        <div className="relative">
                          <div className="mb-2 block">
                            <Label htmlFor="fname" value="First name" />
                          </div>
                          <TextInput
                            id="fname"
                            type="text"
                            value={userDetails.first_name}
                            disabled
                          />
                          <div className="absolute bottom-0  right-0">
                            <button
                              onClick={activateFirstNameModal}
                              className="rounded bg-green-600 px-4 py-2 outline outline-black text-white uppercase  hover:bg-green-800"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="mb-2 block">
                            <Label htmlFor="lname" value="Last name" />
                          </div>
                          <TextInput
                            id="lname"
                            type="text"
                            value={userDetails.last_name}
                            disabled
                          />
                          <div className="absolute bottom-0  right-0">
                            <button
                              onClick={activateLastNameModal}
                              className="rounded bg-green-600 px-4 py-2 outline outline-black text-white uppercase  hover:bg-green-800"
                            >
                              edit
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="mb-2 block">
                            <Label htmlFor="email1" value="Email address" />
                          </div>
                          <TextInput
                            id="email1"
                            type="email"
                            value={userDetails.email}
                            disabled
                          />
                          <div className="absolute bottom-0  right-0">
                            <button
                              onClick={activateEmailModal}
                              className="rounded bg-green-600 px-4 py-2 outline outline-black text-white uppercase  hover:bg-green-800"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </form>
                    </Card>
                  </div>
                </>
              )}
              {activeClass.security && (
                <>
                  <div className="">
                    <Card className="max-w-md mx-auto">
                      <form className="flex flex-col gap-4">
                        <div>
                          <div className="">
                            <h2 className="text-white text-center ">
                              Change Password
                            </h2>
                          </div>
                          <div className="mb-2 block">
                            <Label value="Old password" />
                          </div>
                          <TextInput
                            type="password"
                            value={password.oldPass}
                            onChange={(e) =>
                              setpassword({
                                ...password,
                                oldPass: e.target.value,
                              })
                            }
                            placeholder=""
                            required
                          />
                        </div>
                        <div>
                          <div className="mb-2 block">
                            <Label value="New password" />
                          </div>
                          <TextInput
                            value={password.newPass}
                            onChange={(e) =>
                              setpassword({
                                ...password,
                                newPass: e.target.value,
                              })
                            }
                            type="password"
                            required
                          />
                        </div>
                        <div>
                          <div className="mb-2 block">
                            <Label value="Confirm password" />
                          </div>
                          <TextInput
                            value={password.confirmPass}
                            onChange={(e) =>
                              setpassword({
                                ...password,
                                confirmPass: e.target.value,
                              })
                            }
                            type="password"
                            required
                          />
                        </div>

                        <Button onClick={handlePasswordChange} type="submit">
                          {updating ? "Updating" : "Update"}
                        </Button>
                      </form>
                    </Card>
                  </div>
                </>
              )}
              <Modal
                show={firstNameModal}
                size="md"
                popup
                onClose={() => setfirstNameModal(false)}
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h3 className="text-md uppercase font-medium text-gray-900 dark:text-white">
                      EDIT FIRST NAME
                    </h3>
                    <div>
                      <TextInput
                        id=""
                        placeholder="name@company.com"
                        type="text"
                        required
                        value={editedFirstName}
                        onChange={(e) => seteditedFirstName(e.target.value)}
                      />
                    </div>

                    <div className="w-full ">
                      <Button onClick={updateFirstName} className="uppercase">
                        {updating ? "Updating" : "update changes"}
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              <Modal
                show={lastNameModal}
                size="md"
                popup
                onClose={() => setlastNameModal(false)}
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h3 className="text-md uppercase font-medium text-gray-900 dark:text-white">
                      EDIT LAST NAME
                    </h3>
                    <div>
                      <TextInput
                        id=""
                        placeholder="name@company.com"
                        type="text"
                        required
                        value={editedLastName}
                        onChange={(e) => seteditedLastName(e.target.value)}
                      />
                    </div>

                    <div className="w-full ">
                      <Button onClick={updateLastName} className="uppercase">
                        {updating ? "Updating" : "update changes"}
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
              <Modal
                show={emailModal}
                size="md"
                popup
                onClose={() => setemailModal(false)}
              >
                <Modal.Header />
                <Modal.Body>
                  <div className="space-y-6">
                    <h3 className="text-md uppercase font-medium text-gray-900 dark:text-white">
                      EDIT EMAIL
                    </h3>
                    <div>
                      <TextInput
                        id=""
                        placeholder="name@company.com"
                        type="email"
                        required
                        value={editedEmail}
                        onChange={(e) => seteditedEmail(e.target.value)}
                      />
                    </div>

                    <div className="w-full ">
                      <Button onClick={updateEmail} className="uppercase">
                        {updating ? "Updating" : "update changes"}
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
