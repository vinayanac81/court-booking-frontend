import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import AxiosInstance from "../Config/AxiosInstance";
import { BaseUrl } from "../Constants/BaseUrl";
import toast from "react-hot-toast";

const EditCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [imageUploaded, setimageUploaded] = useState(false);
  const [singleCourtData, setsingleCourtData] = useState({
    court_image: "",
    court_name: "",
    place: "",
    district: "",
    address: "",
    number: "",
    type: "",
  });
  console.log(singleCourtData);
  useEffect(() => {
    getSingleCourtData();
  }, []);
  const getSingleCourtData = async () => {
    try {
      setloading(true);
      const { data } = await AxiosInstance.get("/user/get-single-court-data", {
        params: { id },
      });
      setloading(false);
      console.log(data);
      if (data.success) {
        setsingleCourtData({
          ...singleCourtData,
          court_image: data.court.court_image,
          court_name: data.court.court_name,
          number: data.court.number,
          place: data.court.location,
          district: data.court.district,
          address: data.court.address,
          type: data.court.type,
        });
      } else if (data.noToken || data.tokenExp) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleImage = (e) => {
    setsingleCourtData({ ...singleCourtData, court_image: e.target.files[0] });
    setimageUploaded(true);
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let fileData = new FormData();
      fileData.append("image", singleCourtData.court_image);
      const { data } = await AxiosInstance.post(
        "/admin/update-court",
        fileData,
        {
          params: {
            singleCourtData,
            imageUploaded,
            courtId: id,
          },
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (data?.success) {
        navigate("/home");
        toast.success(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnchange = () => {};
  return (
    <div className="h-screen bg-gray-700">
      <div className="">
        <NavBar />
      </div>
      {loading ? (
        <>
          <div className="w-full   flex justify-center items-center">
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
                    value={singleCourtData.court_name}
                    onChange={(e) =>
                      setsingleCourtData({
                        ...singleCourtData,
                        court_name: e.target.value,
                      })
                    }
                    placeholder="name"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-3/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2"
                    htmlFor="number"
                  >
                    Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="number"
                    name="number"
                    value={singleCourtData.number}
                    onChange={(e) =>
                      setsingleCourtData({
                        ...singleCourtData,
                        number: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="number"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-">
                <div className="w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Address
                  </label>
                  <textarea
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-password"
                    value={singleCourtData.address}
                    onChange={(e) =>
                      setsingleCourtData({
                        ...singleCourtData,
                        address: e.target.value,
                      })
                    }
                    type="text"
                    placeholder="address"
                    name="address"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-2/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2"
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
              </div>
              {imageUploaded ? (
                <>
                  <div className="flex px-3 justify-center flex-wrap -mx-3 ">
                    <div className="w-full mb- mt- bg-black  h-28">
                      <img
                        className="w-full h-full object-cover"
                        src={URL.createObjectURL(singleCourtData.court_image)}
                        alt=""
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex px-3 justify-center flex-wrap -mx-3 ">
                    <div className="w-full mb-  mt- bg-black  h-28">
                      <img
                        className="w-full h-full object-cover"
                        src={`${BaseUrl}/courts/${singleCourtData.court_image}`}
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
        </>
      )}
    </div>
  );
};

export default EditCourt;
