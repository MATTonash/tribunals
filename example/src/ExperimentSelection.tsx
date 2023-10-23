import React, { useState } from "react"
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import expList from '/static/data/experiment.json'
import pdfList from '/static/data/pdfList.json'
import Menu from "./UIComponents/Menu"





interface TaskDetails {
    taskID: string;
    completed: boolean;
}


interface Login {
    selectedExpID: string,
    name: string;
    pdfID: string;
    tasks: Array<TaskDetails>;

}

interface Props {
    login: Login;
    // url: string;
    browseJson: (updateLogin: Login) => void;
    remove: any
}

export default Login;



export function ExperimentSelection({
    login,
    // url,
    browseJson,
    remove
}: Props) {

    const pdfIdxCol: string = 'pdfID'
    const taskIDsCol: string = 'taskIDs'

    // const [pdfURL, setURLState] = useState("")
    const [userName, setNameState] = useState("")

    const [logDetail, setLogState] = useState({
        selectedExpID: "0",
        name: "",
        pdfID: "",
        tasks: []
    })
    //Holds which option index the user has selected
    const [experimentSelected, setExperimentSelected] = useState(0)

    var onExperimentSelectedCallBack = (optionID: number) : void => {
        //Update our state
        const selectedExpID = experimentIDs[optionID]
        setLogState({
            selectedExpID: selectedExpID,
            name: expList[selectedExpID]['name'],
            pdfID: pdfList[expList[selectedExpID][pdfIdxCol]],
            tasks: expList[selectedExpID][taskIDsCol]
        })

        setExperimentSelected(optionID)
    }

    const [checkInputText, setCheckInputText] = useState('')

    const experimentIDs = Object.keys(expList)



    const opts = experimentIDs.map((expID, index) =>
        <option key={index + 1} value={expID}>{expID}</option>)

        const navigate = useNavigate();



    return (
        <div className="description" style={{ padding: "1rem" }}>
            <div className="navbar">

             <button className="buttonNormal" id='TasksManager' onClick={(e) => {
                navigate('/tasks')
             }
            }>Tasks</button>

            </div>

            <h2 style={{ marginBottom: "1rem" }}>Welcome to the Annotation System</h2>
            <p>
                To get started, please select the experiment file first, and then enter your name.
            </p>
            
            <Menu
                options={experimentIDs}
                onOptionSelectedChanged={onExperimentSelectedCallBack}
                />

            <form>
                <p>
                    <small style={{ color: "red" }}>
                        {checkInputText}
                    </small>
                </p>
                <input type="text" placeholder="Enter your name" className="enterName"
                    value={userName}
                    onChange={(e) => {
                        const enterName = e.target.value;
                        setNameState(enterName)
                        setLogState({ ...logDetail, name: enterName })

                        console.log("Selected EXP ID: " + logDetail.selectedExpID + " Name: " + logDetail.name)


                    }}></input>
                {/* {userName} */}

                <button className="button" id='fileselector' onClick={(e) => {

                    const selectedExpID = experimentIDs[experimentSelected]

                        setLogState({
                            selectedExpID: selectedExpID,
                            name: expList[selectedExpID]['name'],
                            pdfID: pdfList[expList[selectedExpID][pdfIdxCol]],
                            tasks: expList[selectedExpID][taskIDsCol]
                        })

                    if (experimentSelected != -1 && logDetail.name != "") {

                        // const selectedExpID = experimentIDs[experimentSelected]

                        // setLogState({
                        //     selectedExpID: selectedExpID,
                        //     name: expList[selectedExpID]['name'],
                        //     pdfID: pdfList[expList[selectedExpID][pdfIdxCol]],
                        //     tasks: expList[selectedExpID][taskIDsCol]
                        // })

                        // console.log(logDetail);
                        browseJson(logDetail)
                        setCheckInputText('')
                        remove(true)
                    } else if (logDetail.selectedExpID == "0") {
                        e.preventDefault();
                        setCheckInputText('Please select the file.')
                    } else {
                        e.preventDefault();
                        setCheckInputText('Please enter your name.')
             
                    }

                }}>Start</button>
            </form>
        </div >

    );
}

