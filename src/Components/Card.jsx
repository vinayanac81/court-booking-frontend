import React from "react";
import { BaseUrl } from "../Constants/BaseUrl";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import {useSelector} from "react-redux"
import { FaArrowRight } from "react-icons/fa";
const Card = ({ handleDelete, court }) => {
  const navigate = useNavigate();
  const {userDetails}=useSelector((state)=>state.user)
  const viewCourt = (id) => {
    navigate(`/view-court/${id}`);
  };
  return (
    <div>
      <div className="max-w-md cursor-pointer w-[20rem] h-[23rem] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full h-[13rem]">
          {" "}
          <a href="">
            <img
              className="rounded-t-lg h-full  w-full"
              src={`${BaseUrl}/courts/${court?.court_image}`}
              alt=""
            />
          </a>
        </div>
        <div className="px-5 py-1">
          <a href="">
            <h5 className="mb-1 uppercase text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {court?.court_name}
            </h5>
          </a>
          <p className="mb-1 font-normal uppercase text-gray-700 dark:text-gray-400">
            {court?.type}
          </p>
          <p className="mb-1 uppercase font-normal text-gray-700 dark:text-gray-400">
            {court?.location},{court?.district}
          </p>
         
          <div className="mt-3  flex justify-between">
            <button
              type="button"
               onClick={() => viewCourt(court._id)}
              className="text-white flex gap-1 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              View Details
              <span className="text-xl"><FaArrowRight /></span>
            </button>
            {
              userDetails?.role===1?(<>
              {
                court.disable?(<>
                <button
              type="button"
              onClick={handleDelete}
              className="text-white flex gap-1 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Enable
              {/* <span className="text-xl"><MdDelete /></span> */}
            </button>
                </>):(<>
                  <button
              type="button"
              onClick={handleDelete}
              className="text-white flex gap-1 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Disable
              {/* <span className="text-xl"><MdDelete /></span> */}
            </button>
                </>)
              }
              
              </>):(<>
                <button
              type="button"
               onClick={() => viewCourt(court._id)}
              className="text-white flex gap-1 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Book
              <span className="text-xl"><FaArrowRight /></span>
            </button>
              </>)
            }
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
