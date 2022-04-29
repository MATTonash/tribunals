import React, { useState } from "react"
import expList from '/static/data/experiment.json'
import pdfList from '/static/data/pdfList.json'





interface TaskDetails {
    taskID: string;
    completed: boolean;
}


interface Login {
    expID: string,
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



export function FileSel({
    login,
    // url,
    browseJson,
    remove
}: Props) {




    const pdfIdxCol: string = 'pdfID'
    const taskIDsCol: string = 'taskIDs'

    const [expIDState, setExpIDState] = useState("0")
    // const [pdfURL, setURLState] = useState("")
    const [userName, setNameState] = useState("")
    const [logDetail, setLogState] = useState({
        expID: "0",
        name: "",
        pdfID: "",
        tasks: []
    })
    const [checkInputText, setCheckInputText] = useState('')

    const expIDs = Object.keys(expList)
    console.log(expIDs)

    // const taskIDs = login.tasks.map((task, index) =>
    // <li key={index}>
    //     {task.taskID}:
    //     <ul>
    //         <li >
    //             Question: {JSON.stringify(taskList[task.taskID].question)}
    //         </li>
    //         <li >
    //             Status: {generateCompleted(task.completed)}
    //         </li>

    //     </ul>
    // </li>)

    const opts = expIDs.map((expID, index) =>
        <option key={index + 1} value={expID}>{expID}</option>)



    return (
        <div className="description" style={{ padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Welcome to the Annotation System</h2>
            <p>
                To get started, please select the experiment file first, and then enter your name.
            </p>
            <form>
                <select className="expSelect"
                    value={expIDState}
                    onChange={(e) => {
                        const selectedExpID = e.target.value;
                        setExpIDState(selectedExpID)
                        // setURLState(pdfList[expList[selectedExpID][pdfIdxCol]])

                        setLogState({
                            ...logDetail,
                            expID: selectedExpID,
                            name: expList[selectedExpID]['name'],
                            pdfID: pdfList[expList[selectedExpID][pdfIdxCol]],
                            tasks: expList[selectedExpID][taskIDsCol]
                        })

                        login = logDetail
                        // url = logDetail.pdfID
                        console.log(expList[selectedExpID]['name'])
                        setNameState(expList[selectedExpID]['name'])

                    }}>
                    <option key="0" value="0" disabled>Choose a file</option>
                    {/* <option value="exp_0001">exp_0001</option>
                    <option value="exp_0002">exp_0002</option> */}
                    {opts}
                </select>
          
            </form>

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
                    }}></input>
                {/* {userName} */}

                <button className="button" id='fileselector' onClick={(e) => {
                    if (logDetail.expID != "0" && logDetail.name != "") {
                        setLogState({
                            ...logDetail
                        });
                        console.log(logDetail);
                        browseJson(logDetail)
                        setCheckInputText('')
                        remove(true)
                    } else if (logDetail.expID == "0") {
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

