import { React, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'

import logo from '../../../assets/images/logo.png'

import "../../../App.css"

const Login = () => {

    let navigate = useNavigate()

    const [valid, setValid] = useState(false)
    const [error, setError] = useState(false)
    const [errorStatement, setErrorStatement] = useState('')

    const pass = useRef(null)
    const user_email = useRef(null)

    let validate = () => {
        if (user_email.current.value !== '' && pass.current.value !== '') {
            setValid(true)
        } else {
            setValid(false)
        }

    }

    let requestLogin = () => {
        let user_data = {
            email: user_email.current.value,
            password: pass.current.value
        }
        axios.post('https://learningo-backend.vercel.app/login', user_data).then((data) => {
            if (data.data == 'email') {
                setError(true)
                setErrorStatement('Email not found')
            } else if (data.data == 'pass') {
                setError(true)
                setErrorStatement('Password mismatched')
            } else {
                localStorage.setItem('id', data.data._id)
                localStorage.setItem('loggedIn', 'true')
                localStorage.setItem('email', user_email.current.value)
                localStorage.setItem('name', data.data.fname)
                localStorage.setItem('topics', data.data.topics)
                // console.log(data.data.topics)
                localStorage.setItem('lg', data.data.lg)
                navigate('/dashboard')
            }
        })
    }

    return <div className={`flex screen`} id={'auth_screen'} style={{gap:'0px'}}>
        <div className={`container flex`}>
            <span className='title'>Log in</span>
            <div className='hr'></div>
            <div className='flex'>
                <form>
                    <div className='flex' style={{ gap: '7px' }}>
                        <input name="name"type="email" ref={user_email} onChange={validate} placeholder="Email"></input>
                        <input name="name"maxLength={20} onChange={validate} type="password" id={parent.pass} ref={pass} placeholder="Password"></input>
                    </div>
                </form>
                <div style={{width:'100%'}}>
                    <button onClick={requestLogin} disabled={!valid}>Log in</button>
                    <span className='error_text' style={{ display: error ? 'block' : 'none', marginTop:'8px' }}>{errorStatement}</span>
                </div>

            </div>
            <div className='flex'>
                <Link to="/signup" className='link_text'>Don't have an account?</Link>
            </div>
        </div>
    </div>
}

export default Login