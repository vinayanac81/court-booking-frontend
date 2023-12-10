import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { useParams } from "react-router-dom";
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
  const { userDetails } = useSelector((state) => state.user);
  const [courtData, setcourtData] = useState({});
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
  const [formattedDate, setformattedDate] = useState({
    startDate: "",
    endDate: "",
  });
  const [timeSlots, settimeSlots] = useState([]);
  let isDateNotSelected = `${startDate.getFullYear()}/${
    startDate.getMonth() + 1
  }/${startDate.getDate()}`;
  const getSingleCourtData = async () => {
    try {
      setloading(true);
      const { data } = await AxiosInstance.get("/user/get-single-court-data", {
        params: { id },
      });
      setloading(false);
      if (data.success) {
        setcourtData(data.court);
      } else if (data.noToken || data.tokenExp) {
        localStorage.clear();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getData = async () => {
    try {
      const { data } = await AxiosInstance.get("/admin/start-date", {
        params: { id },
      });
      let date = data.date;
      setStartDate(new Date(date));
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
  const getTimeSlotData = async () => {
    try {
      const { data } = await AxiosInstance.get("/user/getTimeSlotData", {
        params: { courtId: id, date: new Date() },
      });
      console.log(data);
      settimeSlots(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTimeSlotData();
  }, []);
  const handleStartDate = (date) => {
    setStartDate(date);
    // var Difference_In_Time = date.getTime() - currentDate.getTime();
    // var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    // let modDate = Math.ceil(Difference_In_Days);
    // if (modDate < 0) {
    //   toast.error("Date already passed");
    // } else {
    //   const formattedEndDate = `${date.getFullYear()}/${
    //     date.getMonth() + 1
    //   }/${date.getDate()}`;
    //   setformattedDate({ ...formattedDate, startDate: formattedEndDate });
    //   setStartDate(date);
    //   setstartDateSelected(true);
    // }
  };
  const handleEndDate = (date) => {
    var Difference_In_Time = date.getTime() - currentDate.getTime();
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let modDate = Math.ceil(Difference_In_Days);
    var compare_with_start_date_In_Time = date.getTime() - startDate.getTime();
    // To calculate the no. of days between two dates
    var compare_with_start_date_In_Days =
      compare_with_start_date_In_Time / (1000 * 3600 * 24);
    let compare_with_start_date = Math.ceil(compare_with_start_date_In_Days);
    if (modDate < 0) {
      toast.error("Date already passed");
    } else if (modDate === 0) {
      toast.error("Date is today date...");
    } else if (compare_with_start_date === 0) {
      toast.error("Starting date and ending date are same....");
    } else if (compare_with_start_date < 0) {
      toast.error("Ending date is lower than starting date");
    } else {
      const formattedStartDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;
      setformattedDate({ ...formattedDate, endDate: formattedStartDate });

      setendDate(date);
    }
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
        isDateNotSelected,
        cost,
        startDate,
        endDate,
        courtId: id,
        formattedDate,
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
          };

          const result = await AxiosInstance.post("/payment/success", { data });

          alert(result.data.msg);
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
  return (
    <div className="">
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
                src={`${BaseUrl}/courts/${courtData?.court_image}`}
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
              <div className="absolute z-5 bottom-60 md:bottom-48 left-10">
                <span className="text-white font-bold text-3xl">
                  {courtData?.court_name}
                </span>
              </div>
            </div>
            <div id="scroll-container">
              <div id="scroll-text">This isfldpdsf;fds</div>
            </div>
            <div className="p-4 flex justify-center">
              {" "}
              <Card className="max-w-sm">
                <h5 className="text-2xl flex gap-5 justify-center font-bold tracking-tight text-gray-900 dark:text-white">
                  <Button color="red">Today</Button>
                  <Button color="red">Tommorow</Button>
                </h5>
                <input
                          value={startDate}
                          // min={startDate}
                          // selected={startDate}
                          type="date"
                          onChange={(date) => handleStartDate(date)}
                          className="px-4 py-2 font-bold dark:text-gray-600 rounded"
                          name=""
                          id=""
                        />
                <div className="">
                  <div className="bg-gray-500 rounded">
                    {timeSlots?.length > 0 ? (
                      <>
                        <div className="flex justify-center py-4  gap-  w-full flex-wrap">
                          {timeSlots?.map((time, id) => {
                            return (
                              <div
                                className="flex  items-center  my-2 px-4 gap-"
                                key={id}
                              >
                                <button
                                  onClick={() => {
                                    setselectedSlot(time);
                                    setbookingModal(true);
                                  }}
                                  className="py-2 flex gap-2 items-center text-white px-4 bg-yellow-600 rounded"
                                >
                                  {time.slot.name}{" "}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="py-6 px-4 flex justify-center text-xl">
                          <span className=""> No time slot selected</span>
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
                      {courtData?.court_name}
                    </h3>
                    <span className="text-md  flex justify-center font-medium text-gray-900 text-center dark:text-white">
                      {courtData?.district}
                    </span>
                    
                    <div className="md:flex flex md:justify-between md:flex-row flex-col items-center justify-between gap-2 w-full">
                      <div className="flex justify-center  flex-col items-center w-1/3">
                        <h2 className="text-white mb-2">Starting date</h2>
                        {/* <DatePicker
                          className="rounded px-2 py-2 dark:text-gray-600 font-bold"
                          selected={startDate}
                          minDate={startDate}
                          onChange={(date) => handleStartDate(date)}
                        /> */}
                        <input
                          value={startDate}
                          min={startDate}
                          selected={startDate}
                          type="date"
                          onChange={(date) => handleStartDate(date)}
                          className="px-4 py-2 font-bold dark:text-gray-600 rounded"
                          name=""
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
                        <DatePicker
                          className="rounded px-2  py-2 dark:text-gray-600 font-bold"
                          selected={endDate}
                          minDate={endDate}
                          onChange={(date) => handleEndDate(date)}
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
                                        <button className="py-2 flex gap-2 items-center text-white px-4 bg-yellow-600 rounded">
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
