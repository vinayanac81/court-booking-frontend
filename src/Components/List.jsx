import React from "react";
import { BaseUrl } from "../Constants/BaseUrl";

const List = ({ booking }) => {
  return (
    <>
      <tr className="bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
        <td className="px-4 py-3 flex justify-center text-sm">
          <div
            className="relative hidde w-20 h-20
                       mr-3 rounded-full md:block"
          >
            <img
              className="object-cove w-full h-full rounded"
              src={`${BaseUrl}/courts/${booking?.courtData?.court_image}`}
              alt
              loading="lazy"
            />
            <div
              className="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
          </div>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {booking?.courtData?.court_name}
          </span>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {booking?.courtData?.address}
          </span>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {booking?.courtData?.type}
          </span>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {booking?.slot?.name}
          </span>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {booking?.date.toString().slice(0, 10)}
          </span>
        </td>
        <td className="px-4 py-3 text-center text-xs">
          <span className="px-2 py-1 font-semibold leading-tight ">
            {" "}
            {booking?.cost}
          </span>
        </td>
        <td className="text-center">
          <button className="px-2  py-2 bg-red-600 text-white rounded hover:bg-red-800">
            Cancel
          </button>
        </td>
      </tr>
    </>
  );
};

export default List;
