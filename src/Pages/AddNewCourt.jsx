import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import AxiosInstance from "../Config/AxiosInstance";
// import { ImagetoBase64 } from "../Config/ImagetoBase64";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const AddNewCourt = () => {
  const navigate = useNavigate();
  const [courtData, setcourtData] = useState({
    image: "",
    name: "",
    place: "",
    district: "",
    address: "",
    number: "",
    category: "",
  });
  const [courtImage, setcourtImage] = useState("");
  const handleOnchange = async (e) => {
    const { name, value } = e.target;
    setcourtData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(courtData, courtImage);
      let fileData = new FormData();
      fileData.append("image", courtImage);
      const { data } = await AxiosInstance.post(
        "/admin/add-court",
        fileData,
        {
          params: courtData,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate("/home");
      }else if(data.noToken || data.tokenExp){
        localStorage.clear()
        navigate("/")
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImage = (e) => {
    setcourtImage(e.target.files[0])
  };
  console.log(courtImage);
  return (
    <div className="h-screen bg-gray-700">
      <div className="">
        <NavBar />
      </div>
      <div className="flex w-full justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="w-full  max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-">
            <div className="w-full md:w-full px-3 mb-2 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Court Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                name="name"
                onChange={handleOnchange}
                placeholder="name"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full    md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-city"
              >
                Place
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                type="text"
                name="place"
                onChange={handleOnchange}
                placeholder="place"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                District
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={handleOnchange}
                  name="district"
                >
                  <option>Select district</option>
                  <option>Trivandrum</option>
                  <option>Ernamkulam</option>

                  <option>Kozhikode</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="number"
              >
                Number
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="number"
                name="number"
                onChange={handleOnchange}
                type="text"
                placeholder="number"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Address
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                onChange={handleOnchange}
                type="text"
                placeholder="address"
                name="address"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="image"
              >
                Image
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="image"
                name="image"
                onChange={handleImage}
                type="file"
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="category"
              >
                type
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={handleOnchange}
                  name="category"
                >
                  <option>Select type</option>
                  <option>Football</option>
                  <option>Cricket</option>

                  <option>Volleyball</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {courtImage && (
            <>
              <div className="flex px-3  justify-center flex-wrap -mx-3 ">
                <div className="w-full mb- mt- bg-black  h-28">
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(courtImage)}
                    alt=""
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap -mx-3">
            <div className="px-3 flex justify-center w-full mt-2">
              <button
                type="submit"
                className="text-white w-1/3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Upload
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCourt;
