import { React, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import axios from 'axios'

import "../../../App.css"
import styles from './signup.module.css'

const Signup = () => {

    let navigate = useNavigate()

    const email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const [valid, setValid] = useState(false)
    const [error, setError] = useState(false)

    const fname = useRef(null)
    const pass = useRef(null)
    const repass = useRef(null)
    const user_email = useRef(null)
    const checkPass = useRef(null)
    const passMessage = useRef(null)

    const veryWeak_ = useRef(null)
    const Weak_ = useRef(null)
    const Moderate_ = useRef(null)

    // Class toggles
    const [_useremail, _setUseremail] = useState(false)
    const [_pass, _setPass] = useState(false)
    const [_repass, _setRepass] = useState(false)
    const [_veryWeak_, _setveryWeak_] = useState(false)
    const [_Weak_, _setWeak_] = useState(false)
    const [_Moderate_, _setModerate_] = useState(false)

    let password_strength = () => {

        let password = pass.current.value

        if (password === '') {
            _setveryWeak_(false)
            _setWeak_(false)
            _setModerate_(false)
            passMessage.current.innerText = "Add Capital and Small letters"
            setValid(false)
            _setPass(true)
            return
        }

        if (/[a-zA-Z]/.test(password)) {
            _setPass(true)
            setValid(false)
            passMessage.current.innerText = "Add numbers"
            _setveryWeak_(true)
            _setWeak_(false)
            _setModerate_(false)
            if (/[0-9]/.test(password)) {
                _setPass(true)
                setValid(false)
                passMessage.current.innerText = "Add special characters"
                _setveryWeak_(true)
                _setWeak_(true)
                _setModerate_(false)
                if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#£_()/=+$!%*?&])[A-Za-z\d@#£_()/=+$!%*?&]/.test(password)) {
                    if (pass.current.value === repass.current.value) setValid(true)
                    _setPass(false)
                    passMessage.current.innerText = ""
                    _setveryWeak_(true)
                    _setWeak_(true)
                    _setModerate_(true)
                }
            }
        }

    }

    let emailValidate = () => {
        if (email.test(user_email.current.value)) {
            setValid(true)
            validate()
            _setUseremail(false)
        } else {
            setValid(false)
            _setUseremail(true)
        }
    }

    let validate = () => {
        if (fname.current.value !== '' && user_email.current.value !== '' && pass.current.value !== '') {
            if (pass.current.value === repass.current.value) {
                _setRepass(false)
                setValid(true)
                password_strength()
                return
            } else {
                _setRepass(true)
                setValid(false)
                password_strength()
                return
            }
        }
        setValid(false)
    }

    let addUser = async () => {
        let user_data = {
            fname: fname.current.value,
            email: user_email.current.value,
            password: pass.current.value,
            lg: 0,
            topics: []
        }
        axios.post('https://learningo-backend.vercel.app/adduser', user_data).then((data) => {
            localStorage.setItem('id', data.data)
            localStorage.setItem('loggedIn', 'true')
            localStorage.setItem('email', user_email.current.value)
            localStorage.setItem('name', fname.current.value)
            localStorage.setItem('topics', [])
            localStorage.setItem('lg', '0')
            navigate("/dashboard")
        }).catch((e) => {
            setError(true)
        })
    }

    return <div className={'flex screen'} id='auth_screen'>

        <div className={`flex container`} >
            <span className='title'>Sign up</span>
            <div className='hr'></div>
            <div className='flex'>
                <form>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <input name="name"ref={fname} maxLength={35} placeholder="Name"></input>
                        <div className='normal_flex'>
                            <input name="name"type="email" ref={user_email} className={_useremail ? 'error' : ``} onChange={emailValidate} placeholder="Email"></input>
                        </div>
                        <div className='normal_flex' style={{ flexDirection: 'column' }}>
                            <input name="name"maxLength={20} className={_pass ? 'error' : ``} onChange={validate} onFocus={() => checkPass.current.style.display = 'flex'} onBlur={() => checkPass.current.style.display = 'none'} type="password" id={styles.pass} ref={pass} onInput={password_strength} placeholder="Password"></input>
                            <div ref={checkPass} style={{ display: 'none', gap: '10px' }} className='flex'>
                                <div className={styles.password_status}>
                                    <div className={_veryWeak_ ? styles.green_status : ``} ref={veryWeak_}></div>
                                    <div className={_Weak_ ? styles.green_status : ``} ref={Weak_}></div>
                                    <div className={_Moderate_ ? styles.green_status : ``} ref={Moderate_}></div>
                                </div>
                                <span className={styles.info_text} ref={passMessage}>Add capital and small letters</span>
                            </div>
                        </div>
                        <input name="name"maxLength={20} type="password" id={'repass'} ref={repass} onInput={validate} placeholder="Re-enter password" className={_repass ? 'error' : ``}></input>
                    </div>
                </form>
                <button disabled={!valid} onClick={addUser}>Sign up</button>
                <span className={'error_text'} style={{ display: error ? 'block' : 'none' }}>Something went wrong</span>
            </div>
            <div className={'flex'}>
                <Link to="/login" className={'link_text'}>Already have an account?</Link>
            </div>
        </div> </div>
}

export default Signup
