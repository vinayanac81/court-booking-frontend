import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import AxiosInstance from "../Config/AxiosInstance";
import List from "../Components/List";

const Booking = () => {
  const [bookedList, setbookedList] = useState([]);
  const getBookedList = async () => {
    try {
      const { data } = await AxiosInstance.get("/user/get-booked-list");
      console.log(data);
      setbookedList(data?.list);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBookedList();
  }, []);
  return (
    <div>
      <div className=" bg-gray-900">
        <NavBar />
      </div>
      <div className="h-screen bg-gray-900">
        <div className="w-full overflow-hidden  shadow-xs">
          <div className="w-full overflow-x-auto">
            <div className="dark:bg-gray-300 py-2 flex justify-center text-xl font-bold">
              Booked list
            </div>
            <table className="w-full ">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-600">
                  <th className="px-4 text-center py-3">Image</th>
                  <th className="px-4 text-center py-3">Name</th>
                  <th className="px-4 text-center py-3">Address</th>
                  <th className="px-4 text-center py-3">Type</th>
                  <th className="px-4 text-center py-3">Time</th>
                  <th className="px-4 text-center py-3">Date</th>
                  <th className="px-4 text-center py-3">Price</th>
                  <th className="px-4  text-center py-3">Cancel</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-600">
                {bookedList.map((list) => (
                  <List booking={list} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex w-full justify-center px-4  py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
            {" "}
            {bookedList.length === 0
              ? "No Booking Found"
              : `Total booking = ${bookedList.length}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
