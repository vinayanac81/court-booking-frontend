import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../Config/AxiosInstance";
import { BaseUrl } from "../Constants/BaseUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import "./viewCourt.css";
import { Button, Card } from "flowbite-react";
import toast from "react-hot-toast";
import { MdCancel } from "react-icons/md";
import { Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { Timings } from "../Constants/Timings";
const ViewCourt = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const { userDetails } = useSelector((state) => state.user);
  const [singleCourtData, setSingleCourtData] = useState({});
  const [loading, setloading] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [cost, setcost] = useState("");
  const [selectedSlot, setselectedSlot] = useState("");
  const [currentDate, setcurrentDate] = useState(new Date());
  const [startDateSelected, setstartDateSelected] = useState(false);
  const [showDropdown, setshowDropdown] = useState(false);
  const [bookingModal, setbookingModal] = useState(false);
  const [selectedTimings, setselectedTimings] = useState([]);
  const [filteredTiming, setfilteredTiming] = useState([]);
  const [active, setactive] = useState({
    today: true,
    tommorrow: false,
  });
  const [resultDate, setresultDate] = useState("");
  const [searchedDate, setsearchedDate] = useState("");
  const [timeSlots, settimeSlots] = useState([]);
  const getSingleCourtData = async () => {
    try {
      setloading(true);
      const { data } = await AxiosInstance.get("/user/get-single-court-data", {
        params: { id },
      });
      setloading(false);
      // console.log(data);
      if (data.success) {
        setSingleCourtData(data.court);
      } else if (data.noToken || data.tokenExp) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAlreadyBooked = () => {
    toast.error("Slot already booked...");
  };
  const getData = async () => {
    try {
      const { data } = await AxiosInstance.get("/admin/start-date", {
        params: { id },
      });
      let date = data.date;
      // console.log(date.slice(0, 10));
      setStartDate(date.slice(0, 10));
      setendDate(new Date(date));
    } catch (error) {
      console.log(error);
    }
  };
  const updateTime = () => {
    setfilteredTiming(Timings);
  };
  useEffect(() => {
    getSingleCourtData();
    updateTime();
    getData();
  }, []);
  const getTimeSlotData = async (date = new Date()) => {
    try {
      console.log(date);
      const { data } = await AxiosInstance.get("/user/getTimeSlotData", {
        params: { courtId: id, date: date },
      });
      console.log(data);
      setresultDate(date);
      settimeSlots(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTimeSlotData(new Date());
  }, []);
  const handleStartDate = (e) => {
    let date = e.target.value;
    console.log(date);
    setStartDate(date);
  };
  const handleEndDate = (e) => {
    let date = e.target.value;
    console.log(date);
    setendDate(date);
  };
  const handleSelectedTime = (id) => {
    let data = [];
    filteredTiming.forEach((time) => {
      if (time.id !== id) {
        data.push(time);
      }
    });
    filteredTiming.forEach((time) => {
      if (time.id === id) {
        setselectedTimings([...selectedTimings, time]);
      }
    });

    setfilteredTiming(data);
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await AxiosInstance.post("/admin/add-slot", {
        selectedTimings,
        cost,
        startDate,
        endDate,
        courtId: id,
      });
      if (data.success) {
        setopenModal(false);
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const initiateBooking = async () => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // creating a new order
      const { data } = await AxiosInstance.post(
        "/payment/order",
        {},
        { params: { slotId: selectedSlot._id } }
      );

      if (!data) {
        alert("Server error. Are you online?");
        return;
      }

      // Getting the order details back
      console.log(data);
      const { amount, id: order_id, currency } = data.order;
      console.log(amount);

      const options = {
        key: "rzp_test_mn6BBcws8w4dnR", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Book my court",
        description: "Test Transaction",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            slotId: selectedSlot._id,
          };

          const result = await AxiosInstance.post("/payment/success", { data });
          let d = new Date();
          if (active.today) {
            let date = new Date();
            setbookingModal(false);
            getTimeSlotData(date);
          } else if(active.tommorrow) {
            setbookingModal(false);
            let tomorrowDate = d.setDate(d.getDate() + 1);
            console.log(tomorrowDate);
            getTimeSlotData(new Date(tomorrowDate));
          }else{
           
            setbookingModal(false);
            getTimeSlotData(new Date(searchedDate))
          }
         
    
          // alert(result.data.msg);
        },
        prefill: {
          name: "Soumya Dey",
          email: "SoumyaDey@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Soumya Dey Corporate Office",
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      function loadScript(src) {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(new Date(startDate).toLocaleString().slice(0,10));
  // console.log(startDate);
  //  min={"2023-12-10"}
  const fetchTimeSlot = (name) => {
    let latestDate = new Date();
    if (name === "today") {
      setactive({ ...active, today: true, tommorrow: false });
      let date = new Date();
      getTimeSlotData(date);
    } else {
      setactive({ ...active, today: false, tommorrow: true });
      let date = latestDate.setDate(latestDate.getDate() + 1);
      getTimeSlotData(new Date(date));
    }
  };
  const handleNavigate=(courtId)=>{
    console.log("CLICKED");
    navigate(`/edit-court/${courtId}`)
  }
  return (
    <div className="bg-gray-900 pb-14">
      <NavBar name="court" />
      {loading === true ? (
        <>
          <div className=" w-full h-screen flex justify-center items-center">
            <div
              role="status"
              className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
            >
              <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg
                  className="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
              <div className="w-full">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5" />
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center w-full md:w-full">
            <div className="w-full relativ md:h-[30rem] h-[25rem]">
              <img
                className="w-full object-cover h-full"
                src={`${BaseUrl}/courts/${singleCourtData?.court_image}`}
                alt=""
              />

              {userDetails.role === 1 && (
                <>
                  <div className="absolute z-5 bottom-60 md:bottom-48 right-10">
                    <button
                      type="button"
                      onClick={() => setopenModal(true)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add Time Slot
                    </button>
                  </div>
                </>
              )}
                {userDetails.role === 1 && (
                <>
                  <div className="absolute z-5 bottom-60 md:bottom-48 right-60">
                    <button
                      type="button"
                      onClick={()=>handleNavigate(id)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Edit court
                    </button>
                  </div>
                </>
              )}
              <div className="absolute z-5 bottom-60 md:bottom-48 left-10">
                <span className="text-white font-bold text-3xl">
                  {singleCourtData?.court_name}
                </span>
              </div>
            </div>
            <div id="scroll-container">
              <div id="scroll-text">Confirm your slot at the earlier...</div>
            </div>
            <div className="p-4 flex justify-center">
              {" "}
              <Card className="max-w-lg">
                <h5 className="text-md flex gap-5 justify-center font-bold tracking-tight text-gray-900 dark:text-white">
                  <button
                    onClick={() => fetchTimeSlot("today")}
                    className={`px-4 py-2 text-md rounded hover:bg-blue-500 outline-sky-700 outline ${
                      active.today && "bg-blue-500 outline-0  text-white"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => fetchTimeSlot("tomorrow")}
                    className={`px-4 py-2 text-md rounded hover:bg-blue-500 outline-sky-700 outline ${
                      active.tommorrow && "bg-blue-500 outline-0  text-white"
                    }`}
                  >
                    Tomorrow
                  </button>
                </h5>
                <div className="flex gap-5 justify-center">
                  <input
                    value={searchedDate}
                    type="date"
                    onChange={(e) => setsearchedDate(e.target.value)}
                    className="px-4 py-2 font-bold dark:text-gray-600 rounded"
                    name=""
                    id=""
                  />
                  <button
                    onClick={() => {
                      searchedDate && getTimeSlotData(new Date(searchedDate)),
                        setactive({
                          ...active,
                          today: false,
                          tommorrow: false,
                        });
                    }}
                    className="px-4 py-2 bg-emerald-600 rounded text-white font-bold"
                  >
                    Search
                  </button>
                </div>

                <div className="">
                  <div className="bg-gray-500 rounded">
                    {timeSlots?.length > 0 ? (
                      <>
                        <div className="flex justify-center text-sm font-bold pt-2">
                          Search result for date :{" "}
                          {resultDate.toString().slice(0, 15)}
                        </div>
                        <div className="flex justify-center py-2  gap-  w-full flex-wrap">
                          {timeSlots?.map((time, id) => {
                            return (
                              <div
                                className="flex flex-col justify-center py-2  px-4 gap-"
                                key={id}
                              >
                                <div className="">
                                  <button
                                    onClick={
                                      time?.bookedBy
                                        ? handleAlreadyBooked
                                        : () => {
                                            setselectedSlot(time);
                                            setbookingModal(true);
                                          }
                                    }
                                    className={`py-2 ${
                                      time?.bookedBy
                                        ? "bg-gray-400"
                                        : " bg-yellow-600"
                                    } flex gap-2 items-center text-white px-4 rounded`}
                                  >
                                    {time.slot.name}{" "}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-6 px-4 flex justify-center text-xl">
                          <span className=""> No slot available</span>
                        </div>{" "}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            <div className="overflow-visible">
              <Modal
                show={openModal}
                size="3xl"
                onClose={() => setopenModal(false)}
                popup
              >
                <Modal.Header> </Modal.Header>
                <Modal.Body>
                  <div className="space-y-6 mt-  mb-">
                    <h3 className="text-xl   font-medium text-gray-900 text-center dark:text-white">
                      {singleCourtData?.court_name}
                    </h3>
                    <span className="text-md  flex justify-center font-medium text-gray-900 text-center dark:text-white">
                      {singleCourtData?.district}
                    </span>

                    <div className="md:flex flex md:justify-between md:flex-row flex-col items-center justify-between gap-2 w-full">
                      <div className="flex justify-center  flex-col items-center w-1/3">
                        <h2 className="text-white mb-2">Starting date</h2>

                        <input
                          value={startDate}
                          min={startDate}
                          selected={startDate}
                          type="date"
                          onChange={handleStartDate}
                          className="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
                          name="startDate"
                          id=""
                        />
                      </div>
                      <div className="flex justify-center items-center ms-4 w-1/3 flex-col gap-2">
                        <span className="text-white font-bold">Cost</span>
                        <div>
                          <TextInput
                            id="small"
                            onChange={(e) => setcost(e.target.value)}
                            type="text"
                            sizing="md"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center flex-col items-center w-1/2">
                        <h2 className="text-white mb-2">Ending date</h2>
                        <input
                          value={endDate}
                          min={startDate}
                          // selected={startDate}
                          type="date"
                          onChange={handleEndDate}
                          className="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm focus:outline-none focus:shadow-outline text-gray-600 font-medium"
                          name="startDate"
                          id=""
                        />
                      </div>
                    </div>
                    <div className="flex  flex-col">
                      <div className="flex gap-5 w-full">
                        <button
                          onClick={() => setshowDropdown(true)}
                          className="dark:bg-gray-600 justify-center w-2/4 md:w-1/4 flex items-center px-5 py-2 rounded"
                        >
                          Select Time
                          <span>
                            <svg
                              className="w-2.5 h-2.5 ms-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 10 6"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                              />
                            </svg>
                          </span>
                        </button>
                        <div className="md:w-3/4 rounded w-2/4 bg-black text-white text-lg items-center flex justify-center">
                          Seleted Timings
                        </div>
                      </div>
                      <div className="w-full flex gap-5">
                        {showDropdown && (
                          <>
                            <div
                              onMouseLeave={() => setshowDropdown(false)}
                              className="md:w-1/4 w-2/4   bg-white h-28 overflow-y-scroll"
                            >
                              <ul className="text-center">
                                {filteredTiming.map((time, id) => {
                                  return (
                                    <li
                                      onClick={() =>
                                        handleSelectedTime(time.id)
                                      }
                                      className=""
                                    >
                                      {time.name}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </>
                        )}

                        <div
                          className={
                            showDropdown ? "md:w-3/4 w-2/4 " : "w-full "
                          }
                        >
                          <div className="bg-gray-500 h-">
                            {selectedTimings?.length > 0 ? (
                              <>
                                <div className="flex gap-  w-full flex-wrap">
                                  {selectedTimings?.map((time, id) => {
                                    return (
                                      <div
                                        className="flex items-center  my-2 px-4 gap-"
                                        key={id}
                                      >
                                        <button className="py-1 flex gap-1 items-center text-white px-2 bg-yellow-600 rounded">
                                          {time.name}{" "}
                                          <span>
                                            <MdCancel />
                                          </span>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="py-6 px-4 flex justify-center text-xl">
                                  <span className="">
                                    {" "}
                                    No time slot selected
                                  </span>
                                </div>{" "}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center">
                        <Button onClick={handleSubmit} color="blue">
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            <div className="">
              <Modal
                show={bookingModal}
                size="3xl"
                onClose={() => setbookingModal(false)}
                popup
              >
                <Modal.Header> </Modal.Header>
                <Modal.Body>
                  <div className="space-y-6 mt-  mb-">
                    <h3 className="text-xl   font-medium text-gray-900 text-center dark:text-white">
                      {selectedSlot?.court?.court_name}
                    </h3>
                    <div className="flex justify-center">
                      <div className="w-96 object-cover  h-60">
                        <img
                          className="w-full h-full"
                          src={`${BaseUrl}/courts/${selectedSlot?.court?.court_image}`}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="flex justify-evenly w-full">
                      <span className="text-md  flex justify-center font-medium text-gray-900 text-center dark:text-white">
                        Date :{" "}
                        {new Date(selectedSlot?.date).toString().slice(0, 15)}
                      </span>
                      <span className="text-md  flex justify-center font-medium text-gray-900 text-center dark:text-white">
                        Time : {selectedSlot?.slot?.name}
                      </span>
                      <span className="text-md  flex justify-center font-medium text-gray-900 text-center dark:text-white">
                        Cost : {selectedSlot?.cost}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={initiateBooking}
                        gradientDuoTone="greenToBlue"
                      >
                        Book now
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

export default ViewCourt;
