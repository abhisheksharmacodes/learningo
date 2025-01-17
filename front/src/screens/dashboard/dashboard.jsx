import { React, useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

import { GoogleGenerativeAI } from '@google/generative-ai';

import logo from '../../assets/images/logo1.png'
import menu from '../../assets/images/menu.png'
import arrow from '../../assets/images/arrow.svg'
import coin from '../../assets/images/coin.svg'
import search from '../../assets/images/search.svg'
import loading from '../../assets/images/loading.gif'

import axios from 'axios'

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
    const [topics, setTopics] = useState('How to concentrate')
    const [level, setLevel] = useState(localStorage.getItem('level') ? localStorage.getItem('level') : 'Beginner')
    const [ready, setReady] = useState(false)
    const [askSomethingElse, setAskSomethingElse] = useState(false)
    const [index, setIndex] = useState(0)
    const [test, setTest] = useState([])
    const [color, setColor] = useState('black')
    const [option, setOption] = useState('Next')
    const [lang, setLang] = useState(localStorage.getItem('lang') ? localStorage.getItem('lang') : 'english')
    const [LG, setLG] = useState(localStorage.getItem('lg') ? parseInt(localStorage.getItem('lg')) : 0)
    const [yourTopics, setYourTopics] = useState(localStorage.getItem('topics') ? localStorage.getItem('topics').split(",") : [])

    // UI variables
    const [blurShow, setBlurShow] = useState(false)
    const [levelShow, setLevelShow] = useState(false)
    const [aboutShow, setAboutShow] = useState(false)
    const [leaderboardShow, setLeaderboardShow] = useState(false)
    const [langShow, setLangShow] = useState(false)
    const [right, setRight] = useState(0)
    const [leaderboard, setLeaderboard] = useState()
    const [change,setChange] = useState(1)

    const topic = useRef(null)
    const buttonRefs = useRef([]);

    const answer = useRef('');

    let navigate = useNavigate()

    let checkStatus = () => {
        if (!localStorage.getItem('id'))
            navigate('/login')
    }

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

    if (yourTopics.length > 0) {
        accordionData.push(
            {
                title: "Your Topics",
                content: <nav><ul>{yourTopics.map(item => <li key={item} className="topic" onClick={() => { setTopics(item); topic.current.value = "" }}>{item}</li>)}</ul></nav>
            }
        )
    }

    for (let i = 0; i < categories.length; i++) {
        accordionData.push(
            {
                title: categories[i].name,
                content: <nav><ul>{categories[i].content.map(item => <li key={item} className="topic" onClick={() => { setTopics(item); topic.current.value = "" }}>{item}</li>)}</ul></nav>
            }
        )
    }

    const languages = [
        "Amharic",
        "Arabic",
        "Assamese",
        "Awadhi",
        "Azerbaijani",
        "Belarusian",
        "Bengali",
        "Bhojpuri",
        "Bulgarian",
        "Burmese",
        "Cebuano",
        "Chhattisgarhi",
        "Chinese",
        "Chittagonian",
        "Czech",
        "Deccan",
        "Dutch",
        "English",
        "Farsi",
        "French",
        "Fulfulde",
        "German",
        "Greek",
        "Gujarati",
        "Haitian",
        "Haryanvi",
        "Hausa",
        "Hindi",
        "Hungarian",
        "Igbo",
        "Ilocano",
        "Indonesian",
        "Italian",
        "Japanese",
        "Javanese",
        "Kazakh",
        "Kannada",
        "Korean",
        "Lombard",
        "Magahi",
        "Malay",
        "Malayalam",
        "Malagasy",
        "Madura",
        "Maithili",
        "Marathi",
        "Marwari",
        "Nepali",
        "Oriya",
        "Oromo",
        "Pashto",
        "Polish",
        "Portuguese",
        "Punjabi",
        "Romanian",
        "Russian",
        "Saraiki",
        "Serbo-Croatian",
        "Sindhi",
        "Sinhala",
        "Somali",
        "Spanish",
        "Sunda",
        "Swedish",
        "Tagalog",
        "Tamil",
        "Tatar",
        "Telugu",
        "Thai",
        "Turkish",
        "Uyghur",
        "Ukrainian",
        "Urdu",
        "Uzbek",
        "Vietnamese",
        "Yoruba",
        "Zulu",
        "Zhuang"
    ];

    const generate = async () => {
        setAskSomethingElse(false)
        setReady(false)
        setRight(0)
        try {
            const googleAI = new GoogleGenerativeAI(API_KEY)
            const geminiModel = googleAI.getGenerativeModel({
                model: "gemini-pro",
                geminiConfig,
            });

            const prompt = `output an array (enclosed in [ and ]. don't put '\`' sign anywhere) of 5 valid json strings (separated by commas) each representing a ${level} level question about ${topics}. questions should be in ${lang} language. question and answer should be in json format as follows: {"question":"question","options":["a","b","c","d"],"answer":""}. the answer should not be in a,b,c,d but from whole option. options should be an array of four strings only. the answer should exactly match letter by letter with one of the options strictly (double check it). then only output the array of 5 json strings. example json output: {"question":"what is computer", "options":["a machine", "a pen", "a box", "a paper"], "answer": "a machine"}`;
            const result = await geminiModel.generateContent(prompt);
            const responseText = JSON.parse(result.response.text())
            if (responseText === 'false') {
                setAskSomethingElse(true)
                setReady(true)
            } else {
                setTest(responseText)
                setReady(true)
                setIndex(0)
                setColor('grey')
            }

        } catch (error) {
            console.error("response error", error);
            setTimeout(() => {
                generate()
            }, 1000)
        }
    };

    const handleAnswerClick = (option) => {
        // // console.log(`
        //     option: ${option},\n
        //     answer: ${answer.current},\n
        //     index: ${index},\n 
        // `)
        // // console.log(queue[index])
        if (option === answer.current) {
            buttonRefs.current[option].className = 'option right_option'
            setRight(right + 1)
            // // console.log(right)
        } else {
            buttonRefs.current[option].className = 'option wrong_option'
            buttonRefs.current[answer.current].className = 'option right_option'
        }
    };

    useEffect(() => {
        checkStatus()
        axios.get('https://learningo-backend.vercel.app/leads').then((data) => {
            setLeaderboard(data.data)
        })
    }, [change])

    useEffect(() => {
        if (topics) {
            generate();
        }
    }, [topics]);

    useEffect(() => {
        localStorage.setItem('lang', lang)
        generate()
    }, [lang]);

    useEffect(() => {
        // // console.log('test' + test)
        setQueue(test)
    }, [test])

    useEffect(() => {
        // // console.log('queue' + queue)
        answer.current = queue[index]?.answer
        // // console.log(answer)
    }, [queue])

    useEffect(() => {
        answer.current = queue[index]?.answer
        // // console.log(answer.current)
        if (index == queue.length - 1) { setOption('More') } else { setOption('Next') }
        queue[index]?.options.forEach(option => {
            buttonRefs.current[option].className = 'option normal'
        })
    }, [index])

    useEffect(() => {
        localStorage.setItem('level', level)
        generate()
    }, [level])

    useEffect(() => {
        localStorage.setItem('topics', yourTopics.join(","))
        axios.put('https://learningo-backend.vercel.app/topics/' + localStorage.getItem('id'), [yourTopics.join(",")]).then(() => {
            
        })
    }, [yourTopics])

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

    const _setLevel = (_level) => {
        setBlurShow(false)
        setLevelShow(false)
        setLevel(_level)
    }

    const initial = () => {
        setLangShow(false)
        setAboutShow(false)
        setLevelShow(false)
        setLeaderboardShow(false)
        setBlurShow(true)
    }

    const more = () => {
        if (index == queue.length - 1) {
            let new_points = Math.floor((right + 5) * right / 5)
            switch (level) {
                case 'Intermediate':
                    new_points = Math.floor(new_points * 1.5)
                    break
                case 'Advance':
                    new_points = new_points * 2
                    break
            }
            let new_lg = parseInt(localStorage.getItem('lg')) + new_points
            setLG(new_lg)
            localStorage.setItem('lg', new_lg.toString())
            axios.put('https://learningo-backend.vercel.app/lg/' + localStorage.getItem('id'), {"lg":parseInt(new_lg)}).then(() => {
                navigate('/dashboard')
            })
            generate()
        } else {
            setIndex(index + 1)
            setColor('black')
        }
    }

    const handleCheckTopic = async (checkTopic) => {
        const googleAI = new GoogleGenerativeAI(API_KEY)
        const geminiModel = googleAI.getGenerativeModel({
            model: "gemini-pro",
            geminiConfig,
        });
        const prompt = `it is a sentence "${checkTopic}". output true if 1. if it is  2. it is appropriate and doesn't contain bad words. otherwise false. just output true or false`;
        const result = await geminiModel.generateContent(prompt);
        const response = result.response.text()
        // // console.log(response)
        if (response.toString().toLowerCase() !== "false") {
            setTopics(checkTopic)
            if (!yourTopics.includes(checkTopic)) {
                setYourTopics([...yourTopics, checkTopic])
            }
        }
        else {
            const animation = topic.current.animate([
                { boxShadow: 'inset 0px 0px 5px 2px rgba(255, 0, 0, .5)' }, // Start from invisible
                { boxShadow: 'none' }  // Animate to fully visible
            ], {
                duration: 400, // Animation duration in milliseconds
                fill: 'forwards'  // Keep the final state after animation
            });
        }
    }

    return <div className="screen" style={{ height: '100%' }}>
        <div id="dash_container" className="flex">
            <div id="blur" style={{ display: (blurShow ? 'flex' : 'none') }}>
                <div onClick={() => { initial(); setBlurShow(false) }} style={{ height: '100%', width: '100%', background: 'transparent', position: 'fixed' }} id="back"></div>
                <div className="options level" style={{ display: (levelShow ? 'flex' : 'none') }}>
                    <nav>
                        <ul>
                            <li onClick={() => _setLevel('Beginner')}>Beginner</li>
                            <li onClick={() => _setLevel('Intermediate')}>Intermediate</li>
                            <li onClick={() => _setLevel('Advance')}>Advance</li>
                        </ul>
                    </nav>
                </div>
                <div className="options about normal_flex" style={{ display: (aboutShow ? 'flex' : 'none') }}>
                    <h2>About</h2>
                    <p>Elevate your learning experience with our AI-powered MCQ practice platform. Our platform offers a wide range of subjects and topics, allowing you to customize your practice sessions to your specific needs. With our dynamic question generation and diverse practice modes, you can effectively prepare for exams and improve your understanding of the subject matter. Our platform provides a user-friendly interface and is accessible from any device, making it the perfect tool for students of all levels.</p>
                    <p> Credits - <a href="https://www.flaticon.com/free-animated-icons/reading" title="reading animated icons" target="_blank">Icons created by Freepik - Flaticon</a></p>
                </div>
                <div className="options leaderboard normal_flex" style={{ display: (leaderboardShow ? 'flex' : 'none'), padding:'30px' }}>
                    <h2>Leaderboard</h2>
                    <ul id="leaderboard">
                    {leaderboard && leaderboard.map((item)=>{
                        return <li className={(item.email == localStorage.getItem('email') ? 'highlight' : '')} key={item.fname}>
                            <span>
                            {leaderboard.indexOf(item)+1}. &nbsp;
                            {item.fname}</span>
                            <div><img src={coin} alt="coin" style={{ height: '24px', marginRight: '7px' }} /> {item.lg}</div>
                        </li>
                    })}
                    </ul>
                </div>
                <div className="options lang normal_flex" style={{ display: (langShow ? 'flex' : 'none') }}>
                    <h2>Choose your language</h2>
                    <div id="langs" className="normal_flex">
                        <div className="lang_section">
                            {languages.slice(0, 9).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(10, 19).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(20, 29).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(30, 39).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(40, 49).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(50, 59).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(60, 69).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                        <div className="lang_section">
                            {languages.slice(70, 79).map((langs) => (langs == lang) ? <span style={{ opacity: 1, fontWeight: 'bold' }} onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span> : <span onClick={() => { initial(); setBlurShow(); setLang(langs) }} key={langs} >{langs}</span>)}
                        </div>
                    </div>
                </div>
            </div>
            <header className="flex header">
                <img id="burger" src={menu} alt="burger" />
                <img className="logo" src={logo} alt="logo" />
                <nav id="max-nav">
                    <ul>
                        <li onClick={() => { initial(); setLangShow(true) }}>
                            <span className="langtext">{lang}</span>
                            <img className="arrow" src={arrow} alt="" />
                        </li>
                        <li onClick={() => { initial(); setLevelShow(true) }}>
                            {level}
                            <img className="arrow" src={arrow} alt="" />
                        </li>
                        <li onClick={() => { initial(); setAboutShow(true) }}>
                            About
                        </li>
                        <li onClick={() => { localStorage.clear(); navigate('/login') }}>
                            Log out
                        </li>
                    </ul>
                </nav>
                <div style={{cursor:'pointer'}} onClick={() => { initial(); setLeaderboardShow(true); setChange(change+1) }} className="normal_flex">
                    <img src={coin} alt="coin" style={{ height: '35px', marginRight: '10px' }} />
                    {LG}
                </div>
            </header>
            <div className="normal_flex" id="content">
                <section id="topics" className="flex">
                    <span className="title">Topics</span>
                    <div id="search_area">
                        <div className="search_text" style={{ display: 'flex', width: '100%' }}>
                            {/* <button onClick={generate}>generate</button> */}
                            <input name="name"ref={topic} onKeyDown={(e) => { if (e.key === 'Enter') { handleCheckTopic(topic.current.value) } }} type="text" maxLength={70} placeholder="Enter a topic and practice" autoComplete="true" />
                            <img src={search} alt="search" className="search" />
                        </div>
                    </div>
                    <div className="normal_flex" id="categories">
                        {accordionData.map(({ title, content }) => (
                            <Accordion key={title} title={title} content={content} />
                        ))}
                    </div>
                </section>
                <section id="practice" className="flex">
                    <div className="flex" style={{ gap: '10px' }}>
                        <span className="title">Practice</span>
                        <span className="title" style={{ opacity: '.7', display: 'block' }}>{topics}</span>
                    </div>
                    {ready ? (askSomethingElse ? <span className="title">Ask something else</span> : <><h1 style={{ textAlign: 'center', fontSize: '1.5em' }}>{queue[index]?.question}</h1>
                        <div id="options" className="flex">
                            {queue[index]?.options?.map((option, index) => <div key={option} ref={(el) => (buttonRefs.current[option] = el)} onClick={() => { handleAnswerClick(option) }} className='option normal'>{option}</div>)}
                        </div>
                        <div id="navigate">
                            <div style={{ color: color }} onClick={() => { if (index > 0) { setIndex(index - 1) } else { setColor('grey') } }}>
                                <img className="arrow" src={arrow} style={{ transform: 'rotate(90deg)' }} alt="arrow" />
                                Previous
                            </div>
                            <div onClick={more}>
                                {option}
                                <img className="arrow" src={arrow} style={{ transform: 'rotate(-90deg)' }} alt="arrow" />
                            </div>
                        </div></>) : <div id="loading_div" className="flex"><img id="loading" src={loading} /></div>}
                </section>
            </div>
        </div>
    </div>
}

export default Dashboard