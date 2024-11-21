import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Login = () => {

  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/login", {userName, userMail, password})
        .then((User)=>{
          localStorage.setItem("token", User.data.token);
          console.log(User)
          navigate('/');
        })
        .catch((error)=>{
            console.log(error);
            navigate('/login');
        })

    setUserName('');
    setUserMail('');
    setPassword('');
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:4000/", {
      headers:{
          Authorization:token,
      }
    })
    .then(()=>{navigate('/');})
    .catch((error)=>{
      console.log(error)
      navigate('/Login');
    })

  
  },[]);

  return (
    <div className='bg-gradient-to-r from-[#fc0599] via-[#03d5e0] to-[#a307e6] min-h-screen flex flex-col items-center justify-center'>

      <NavLink className={`absolute top-4 left-4 text-white py-1 hover:shadow-none shadow-md shadow-black px-3 bg-indigo-500 uppercase rounded-full`} to='/register'>register</NavLink>

    <div className='flex flex-col space-y-6'>
    <h2 className='p-3 text-2xl font-bold text-white uppercase bg-black rounded-xl'> now login your-self here</h2>
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
            placeholder='Enter Your Password'
            name="password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <input 
            className='inline p-2 font-medium text-white transition-all duration-300 shadow-md cursor-pointer bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-black rounded-xl hover:text-black hover:shadow-none hover:bg-gradient-to-r hover:from-purple-600 hover:via-blue-500 hover:to-green-400' 
            value='LOGIN' 
            type="submit" 
          />
        </form>
    </div>

</div>
  )
}

export default Login