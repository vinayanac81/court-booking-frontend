import React, { useState } from 'react'
import LoginBox from '../Components/LoginBox'
import SignupBox from '../Components/SignupBox'

const Login = () => {
    const [boxName, setboxName] = useState("login")
    const handleBox=(boxName)=>{
        console.log("done");
        if(boxName==="signup"){
            setboxName("signup")
        }else if(boxName==="login"){
          setboxName("login")
        }

    }
  return (
    <>
    <div className="">
       {boxName==="login"&&<LoginBox handleBox={()=>handleBox("signup")} />}
       {boxName==="signup"&&<SignupBox handleBox={()=>handleBox("login")}/>}
    </div>
    
    </>
  )
}

export default Login