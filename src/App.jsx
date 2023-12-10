import Login from "./Pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import AddNewCourt from "./Pages/AddNewCourt";
import ViewCourt from "./Pages/ViewCourt";
import Profile from "./Pages/Profile";
import AuthProtectedRoute from "./Components/AuthProtectedRoute";
import Booking from "./Pages/Booking";
import { AdminAuth, UserAuth } from "./Authorization/Authorization";
import EditCourt from "./Pages/EditCourt";
import District from "./Pages/District";
import Sports from "./Pages/Sports";
function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={
              <AuthProtectedRoute>
                <Login />
              </AuthProtectedRoute>
            }
          />
          {/* <Route element={<LoginAuth />}>
            {" "}
            <Route path="/" element={<Login />} />
          </Route> */}
          {/* userRoute */}
          <Route element={<UserAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/district/:district" element={<District />} />
            <Route path="/sports/:sports" element={<Sports />} />
            <Route path="/view-court/:id" element={<ViewCourt />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
          {/* //admin ROute */}
          <Route element={<AdminAuth />}>
            <Route path="/add-new-court" element={<AddNewCourt />} />
            <Route path="/edit-court/:id" element={<EditCourt />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
