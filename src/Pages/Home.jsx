import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { useSelector } from "react-redux";
import AxiosInstance from "../Config/AxiosInstance";
import Card from "../Components/Card";
import { useNavigate } from "react-router-dom";
import { Banner, Button, Modal } from "flowbite-react";
import { HiX } from "react-icons/hi";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const Home = () => {
  const { userDetails } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [courts, setcourts] = useState([]);
  const [loading, setloading] = useState(false);
  const [modalView, setmodalView] = useState(false);
  const [courtId, setcourtId] = useState("");
  const [disable, setdisable] = useState(false);
  const getAllCourtData = async () => {
    try {
      setloading(true);
      const { data } = await AxiosInstance.get("/user/get-all-court-data", {
       params:{
        role: userDetails.role,
       } 
      });
      console.log(data);

      if (data.success) {
        setcourts(data.court);
        setloading(false);
      } else if (data.noToken || data.tokenExp) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        localStorage.clear();
        navigate("/");
        toast.error(error.response.data.message + " , Please login");
      }
    }
  };
  useEffect(() => {
    getAllCourtData();
  }, []);
  const handlePopup = (id, status) => {
    try {
      console.log(id, status);
      if (status) {
        setdisable(false);
      } else {
        setdisable(true);
      }
      setcourtId(id);
      setmodalView(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      if (disable) {
        const { data } = await AxiosInstance.delete("/admin/handle-court", {
          params: { id, disable },
        });
        console.log(data);
        if (data.success) {
          setmodalView(false);
          getAllCourtData();
          window.scrollTo(0, 0);
          toast.success("Court disabled successfully");
        }
      } else {
        const { data } = await AxiosInstance.delete("/admin/handle-court", {
          params: { id, disable },
        });
        console.log(data);
        if (data.success) {
          setmodalView(false);
          getAllCourtData();
          window.scrollTo(0, 0);
          toast.success("Court enabled successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min:h-screen bg-gray-900">
      <NavBar name="home" />
      {userDetails.email === null && (
        <>
          <Banner>
            <div className="flex w-full   justify-between  border border-gray-100  p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row 2xl:max-w-8xl">
              <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
                <p className="flex items-center mt-2 md:mt-0 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Book your court at earlier.....
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center">
                <Button href="/">Login</Button>
                <Banner.CollapseButton
                  color="gray"
                  className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
                >
                  <HiX className="h-4 w-4" />
                </Banner.CollapseButton>
              </div>
            </div>
          </Banner>
        </>
      )}

      {loading && (
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
      )}
      {modalView && (
        <>
          <Modal
            show={modalView}
            size="md"
            className="py-60 md:py-0"
            onClose={() => setmodalView(false)}
            popup
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {disable
                    ? "Are you sure you want to disable this court?"
                    : " Are you sure you want to enable this court?"}
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={() => handleDelete(courtId)}>
                    {"Yes, I'm sure"}
                  </Button>
                  <Button color="gray" onClick={() => setmodalView(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
      <div className="p-7 md:px-36  md:flex md:flex-row items-center flex flex-col gap-8 md:gap-16 justify-evenly md:justify-center flex-wrap">
        {courts.map((court, id) => (
          <Card
            court={court}
            handleDelete={() => handlePopup(court._id, court.disable)}
            key={id}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
