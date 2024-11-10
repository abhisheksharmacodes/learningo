import { React, useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

import { GoogleGenerativeAI } from '@google/generative-ai';

import logo from '../../assets/images/logo1.png'
import arrow from '../../assets/images/arrow.svg'
import coin from '../../assets/images/coin.svg'
import search from '../../assets/images/search.svg'
import loading from '../../assets/images/loading.gif'

import axios from 'axios'

import '../../App.css'
import './dashboard.css'

const API_KEY = 'AIzaSyBLoGQC0Ly4xbc7AVBIcxqWeQ7Lm3scvoo'; // Assuming you've set the API key in .env

const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const Dashboard = () => {

    const [queue, setQueue] = useState([])
    const [topics, setTopics] = useState('Computer')
    const [level, setLevel] = useState('Advanced')
    const [ready,setReady] = useState(false)
    const [askSomethingElse,setAskSomethingElse] = useState(false)
    const [index,setIndex] = useState(0)
    const [test,setTest] = useState([])

    const topic = useRef(null)
    const buttonRefs = useRef([]);

    let answer = ''

    const categories = [
        {
            name: "Computer Science", content: [
                "Programming Fundamentals",
                "Data Structures and Algorithms",
                "Database Systems",
                "Computer Networks",
                "Operating Systems",
                "Software Engineering",
                "Artificial Intelligence",
                "Machine Learning",
                "Web Development",
                "Cybersecurity"
            ]
        },
        {
            name: "Agriculture", content: [
                "Soil Science",
                "Crop Production",
                "Plant Physiology",
                "Animal Husbandry",
                "Agricultural Economics",
                "Agricultural Engineering",
                "Agronomy",
                "Horticulture",
                "Plant Pathology",
                "Entomology"
            ]
        },
        {
            name: "Electrical Engineering", content: [
                "Circuit Theory",
                "Electromagnetic Fields",
                "Control Systems",
                "Power Systems",
                "Digital Electronics",
                "Analog Electronics",
                "Microprocessors",
                "Power Electronics",
                "Signal Processing",
                "Electrical Machines"
            ]
        },
        {
            name: "Mechanical Engineering", content: [
                "Engineering Mechanics",
                "Thermodynamics",
                "Fluid Mechanics",
                "Machine Design",
                "Manufacturing Processes",
                "Thermal Engineering",
                "Dynamics of Machines",
                "Mechatronics",
                "Automobile Engineering",
                "Industrial Engineering"
            ]
        },
        {
            name: "Civil Engineering", content: [
                "Structural Analysis",
                "Soil Mechanics",
                "Concrete Technology",
                "Geotechnical Engineering",
                "Transportation Engineering",
                "Water Resources Engineering",
                "Environmental Engineering",
                "Surveying",
                "Construction Management",
                "Structural Design"
            ]
        },
        {
            name: "Chemical Engineering", content: [
                "Mass Transfer Operations",
                "Heat Transfer Operations",
                "Chemical Reaction Engineering",
                "Process Control",
                "Fluid Mechanics",
                "Thermodynamics",
                "Transport Phenomena",
                "Process Design and Simulation",
                "Materials Science and Engineering",
                "Biochemical Engineering"
            ]
        },
        {
            name: "Biotechnology", content: [
                "Molecular Biology",
                "Genetics",
                "Biochemistry",
                "Cell Biology",
                "Microbial Biotechnology",
                "Plant Biotechnology",
                "Animal Biotechnology",
                "Bioinformatics",
                "Bioprocess Engineering",
                "Immunology"
            ]
        },
        {
            name: "Mathematics", content: [
                "Calculus",
                "Linear Algebra",
                "Differential Equations",
                "Discrete Mathematics",
                "Probability and Statistics",
                "Number Theory",
                "Topology",
                "Real Analysis",
                "Complex Analysis",
                "Numerical Analysis"
            ]
        },
        {
            name: "Physics", content: [
                "Mechanics",
                "Electromagnetism",
                "Optics",
                "Quantum Mechanics",
                "Thermodynamics",
                "Solid State Physics",
                "Nuclear Physics",
                "Atomic Physics",
                "Classical Mechanics",
                "Relativity"
            ]
        },
        {
            name: "Economics", content: [
                "Microeconomics",
                "Macroeconomics",
                "Econometrics",
                "International Economics",
                "Development Economics",
                "Financial Economics",
                "Public Economics",
                "Behavioral Economics",
                "Environmental Economics",
                "Health Economics"
            ]
        }
    ]

    let accordionData = []

    for (let i = 0; i < categories.length; i++) {
        accordionData.push(
            {
                title: categories[i].name,
                content: <nav><ul>{categories[i].content.map(item => <li onClick={() => { setTopics(item); topic.current.value="" }}>{item}</li>)}</ul></nav>
            }
        )
    }

    const generate = async () => {
        setAskSomethingElse(false)
        setReady(false)
        try {
            const googleAI = new GoogleGenerativeAI(API_KEY)
            const geminiModel = googleAI.getGenerativeModel({
                model: "gemini-pro",
                geminiConfig,
            });

            const prompt = `output an array (enclosed in [ and ]) of 5 json strings (separated by commas) each representing a ${level} level question about ${topics} in hindi language. if no question can be generated about ${topics} just return 'false' otherwise output array of 5 json strings. question and answer should be in json format as follows: {"question":"question","options":["a","b","c","d"],"answer":""}. the answer should not be in a,b,c,d but from whole option. options should be an array of four strings only. the answer should exactly match letter by letter with one of the options. then only output the array of 5 json strings. example json output: {"question":"what is computer", "options":["a machine", "a pen", "a box", "a paper"], "answer": "a machine"}`;
            const result = await geminiModel.generateContent(prompt);
            const responseText = JSON.parse(result.response.text())
            console.log('response')
            console.log(responseText)
            if (responseText==='false') {
                setAskSomethingElse(true)
                setReady(true)
            } else {                
                setTest(responseText)
                setReady(true)
            }

        } catch (error) {
            console.error("response error", error);
        }
    };

    const handleAnswerClick = (option) => {
        if (option === answer) {
            buttonRefs.current[option].className = 'option right_option'
        } else {
            buttonRefs.current[option].className = 'option wrong_option'
            buttonRefs.current[answer].className = 'option right_option'
        }
    };

    let navigate = useNavigate()
    let checkStatus = () => {
        if (!localStorage.getItem('id'))
            navigate('/login')
    }

    useEffect(() => {
        checkStatus()
    }, [])

    useEffect(() => {
        if (topics) {
            generate();
        }
    }, [topics]);

    useEffect(()=>{
        console.log('test'+test)
        setQueue(test)
    },[test])

    useEffect(()=>{
        console.log(queue)
    },[queue])

    useEffect(()=>{
        answer = queue[index]?.answer
    },[index])

    const Accordion = ({ title, content }) => {
        const [isActive, setIsActive] = useState(false);
        return (
            <div className="accordion-item">
                <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
                    <span>{title}</span>
                    <img className="arrow" src={arrow} style={{ transform: `rotate(${isActive ? '180deg' : '0deg'})` }} alt="arrow" />
                </div>
                {isActive && <div className="accordion-content">{content}</div>}
            </div>
        );
    };

    return <div id="auth_screen" className="screen" style={{ height: '100%' }}>
        <div id="dash_container" className="flex">
            <header className="flex header">
                <img className="logo" src={logo} alt="logo" />
                <nav>
                    <ul>
                        <li>
                            English (UK)
                            <img className="arrow" src={arrow} alt="" />
                        </li>
                        <li>
                            Beginner
                            <img className="arrow" src={arrow} alt="" />
                        </li>
                        <li>
                            About
                        </li>
                        <li>
                            Log out
                        </li>
                    </ul>
                </nav>
                <div className="normal_flex">
                    <img src={coin} alt="coin" style={{ height: '35px', marginRight: '10px' }} />
                    0
                </div>
            </header>
            <div className="normal_flex" id="content">
                <section id="topics" className="flex">
                    <span className="title">Topics</span>
                    <div className="search_text" style={{ display: 'flex', width: '100%' }}>
                        {/* <button onClick={generate}>generate</button> */}
                        <input ref={topic} onKeyDown={(e) => { if (e.key === 'Enter') { setTopics(topic.current.value) }}} type="text" maxLength={70} placeholder="Enter a topic and practice" />
                        <img src={search} alt="search" class="search" />
                    </div>
                    <div className="normal_flex" id="categories">
                        {accordionData.map(({ title, content }) => (
                            <Accordion title={title} content={content} />
                        ))}
                    </div>
                </section>
                <section id="practice" className="flex">
                    <div className="flex" style={{ gap: '10px' }}>
                        <span className="title">Practice</span>
                        <span className="title" style={{ opacity: '.7', display: 'block' }}>{topics}</span>
                    </div>
                    {ready ? (askSomethingElse ? <span className="title">Ask something else</span> : <><h1 style={{ textAlign: 'center' }}>{queue[index]?.question}</h1>
                    <div id="options" className="flex">
                         {queue[index]?.options?.map((option, index) => <div ref={(el) => (buttonRefs.current[option] = el)} onClick={() => handleAnswerClick(option)} className='option normal'>{option}</div>)}
                    </div>
                    <div id="navigate">
                        <div onClick={()=>{setIndex(index-1)}}>
                            <img className="arrow" src={arrow} style={{ transform: 'rotate(90deg)' }} alt="arrow" />
                            Previous
                        </div>
                        <div onClick={()=>setIndex(index+1)}>
                            Next
                            <img className="arrow" src={arrow} style={{ transform: 'rotate(-90deg)' }} alt="arrow" />
                        </div>
                    </div></>) : <div id="loading_div" className="flex"><img id="loading" src={loading} /></div>}
                </section>
            </div>
        </div>
    </div>
}

export default Dashboard