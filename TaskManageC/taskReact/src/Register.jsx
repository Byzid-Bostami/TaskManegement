import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post("https://taskmanegement-backend.onrender.com/register", {userName, userMail, password})
        .then(()=>{
          navigate('/login');
        })
        .catch((error)=>{
            console.log(error);
            navigate('/register');
        })

    setUserName('');
    setUserMail('');
    setPassword('');
  };


  return (
    <div className='bg-gradient-to-r from-[#fc0599] via-[#03d5e0] to-[#a307e6] min-h-screen flex flex-col items-center justify-center'>
      <NavLink className={`absolute top-4 left-4 text-white py-1 hover:shadow-none shadow-md shadow-black px-3 bg-indigo-500 uppercase rounded-full`} to='/login'>login</NavLink>
      <div className='flex flex-col space-y-6'>
        <h2 className='p-3 text-2xl font-bold text-white uppercase bg-black rounded-xl'>You have to register first</h2>
        
        <form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
          <input 
            className='p-2 capitalize outline-none rounded-xl focus:ring-2 ring-violet-700' 
            required 
            type="text" 
            value={userName}  
            placeholder='Enter Your Name' 
            name='userName' 
            onChange={(e) => setUserName(e.target.value)} 
          />
          <input 
            className='p-2 capitalize outline-none rounded-xl focus:ring-2 ring-violet-700' 
            required 
            type="email" 
            value={userMail} 
            placeholder='Enter Your Email' 
            name="userMail" 
            onChange={(e) => setUserMail(e.target.value)} 
          />
          <input 
            className='p-2 capitalize outline-none rounded-xl focus:ring-2 ring-violet-700' 
            required 
            type="password" 
            value={password} 
            placeholder='Set A Strong Password' 
            name="password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <input 
            className='inline p-2 font-medium text-white transition-all duration-300 shadow-md cursor-pointer bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-black rounded-xl hover:text-black hover:shadow-none hover:bg-gradient-to-r hover:from-purple-600 hover:via-blue-500 hover:to-green-400' 
            value='REGISTER' 
            type="submit" 
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
