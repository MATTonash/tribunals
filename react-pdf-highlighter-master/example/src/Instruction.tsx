import React from "react"
import Login from "./FileSel"
import taskList from '/static/data/taskData.json'
// import { v4 as uuid } from 'uuid';
// import { testHighlights } from "./dataDetect";

// console.log("testhights")
// console.log(testHighlights)

interface Props {
    login: Login
    startTask: any
}







export function Instruction({
    login,
    startTask


}: Props) {

    // const unique_id = uuid();
    const expID = login.expID
    const name = login.name
    const pdfID = login.pdfID

    function generateCompleted(status: boolean) {
        let text: string = ""
        if (status) {
            text = "Completed"
        }
        else {
            text = "NA"
        }
        return text
    }

    // task details
    const taskIDs = login.tasks.map((task, index) =>
        <li key={index}>
            {task.taskID}:
            <ul>
                <li >
                    Question: {JSON.stringify(taskList[task.taskID].question)}
                </li>
                <li >
                    Status: {generateCompleted(task.completed)}
                </li>

            </ul>
        </li>)


    return (

        <div className="description" style={{ padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Experiment setup and task instruction</h2>
            <p>
                Please check the following logging information and tasks in the experiment below:
            </p>
            <ul>
                <li>
                    Experiment ID: {expID}
                </li>
                <li>
                    Name: {name}
                </li>
                <li>
                    PDF Path: {pdfID}
                </li>
                <li>
                    Task IDs:
                    <ul>
                        {taskIDs}
                    </ul>
                </li>

            </ul>
            <p>
                Please press the button to start the tasks once the information has been confirmed.
            </p>

            <button type="button" onClick={(e) => {
                startTask(true)

            }}>Start</button>


        </div>

    );
}


