import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { gapi } from "gapi-script";
import { useDispatch } from "react-redux";
import { BaseUrl } from "../Constants/BaseUrl";
import NavBar from "./NavBar";
import { setUserDetails } from "../Toolkit/userSlice";
const LoginBox = ({ handleBox }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setloading] = useState(false)
  // useEffect(() => {
  //   gapi.load("client:auth2", () => {
  //     gapi.auth2.init({
  //       clientId:
  //         "1095459129528-7ga8q808uf5998953mdfet5uijlh7ush.apps.googleusercontent.com",
  //     });
  //   });
  // }, []);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setloading(true)
      const { data } = await axios.post(`${BaseUrl}/auth/login`, { loginData });
      console.log(data);
      setloading(false)
      if (data.block) {
        toast.error(data.message);
      } else if (data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        // localStorage.setItem("user", data.user);
        var tokenId = data.token;

        var decoded = jwt_decode(tokenId);
        console.log(decoded);
        localStorage.setItem("user", JSON.stringify(decoded));
        function jwt_decode(token) {
          var base64Url = token.split(".")[1];
          var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          var jsonPayload = decodeURIComponent(
            window
              .atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );

          return JSON.parse(jsonPayload);
        }
        dispatch(setUserDetails(decoded));
        navigate("/home");
      } else if (data.noEmail) {
        toast.error(data.message);
        handleBox("signup");
      } else if (data.passError) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const responseGoogleSuccess = async (response) => {
    try {
      const { data } = await axios({
        method: "POST",
        url: `${userApi}/googlelogin`,
        data: { idToken: response.tokenId },
      });
      console.log(data);
      if (data.success) {
        dispatch(getUserData(data.user));
        toast.success("Sign in Successfully!");
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const responseGoogleError = (response) => {
    console.log(response);
  };
  return (
    <div>
      <NavBar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center  text-2xl font-bold leading-9 tracking-tight ">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 "
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setloginData({ ...loginData, email: e.target.value })
                  }
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 "
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setloginData({ ...loginData, password: e.target.value })
                  }
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {
                loading ===true ?(<>
                  <button
                type="button"
                className="text-white w-full  mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <div className="flex justify-center w-full">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline  w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </div>
              </button>
                </>):(<>
                  <button
                type="submit"
                className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <h2 className="flex w-full justify-center">Sign in</h2>
              </button>
                </>)
              }
            

            
            </div>
          </form>
          {/* <div className="flex w-full mt-3 px-4 justify-evenly ">
            <div
              // onClick={handleGoogleAuth}
              className="flex  bg-white py-2 px-4 rounded-full cursor-pointer items-center"
            >
              {" "}
              <GoogleLogin
                clientId="1095459129528-7ga8q808uf5998953mdfet5uijlh7ush.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={responseGoogleSuccess}
                onFailure={responseGoogleError}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div> */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              //   to={"/signup"}
              onClick={handleBox}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
