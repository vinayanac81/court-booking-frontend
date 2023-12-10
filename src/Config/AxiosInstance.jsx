import axios from "axios";
import { BaseUrl } from "../Constants/BaseUrl";
const AxiosInstance=axios.create({
    baseURL:"https://court-booking-backend.onrender.com"
})

AxiosInstance.interceptors.request.use(function(config){
    const token=localStorage.getItem("token")
    config.headers['Authorization']=`Bearer ${token}`
    config.headers['Access-control-Allow-Origin']='*'
    return config
})
export default AxiosInstance