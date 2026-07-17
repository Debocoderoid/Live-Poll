import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import HomePage from "./pages/HomePage";
import PollPage from "./pages/PollPage";
import CreatePage from "./pages/CreatePage.jsx";
import './styles/index.css'

function App(){
    return(
        <Router>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path='/' element= {<HomePage/>}/>
                    <Route path='/poll/:id' element= {<PollPage/>}/>
                    <Route path='/create' element= {<CreatePage/>}/>
                </Routes>
            </main>
        </Router>
    );
}

export default App;