import React, { Component, useState } from "react";
import { Route, Router, Routes, useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
//Import the task list
import taskList from '/static/data/taskData.json'
import { FormControl, InputLabel, Menu, MenuItem, Select, TextField } from "@material-ui/core";
import { Height } from "@mui/icons-material";
import { Stack } from "@mui/material";


interface Props {
    taskID: String;
    deleteTaskID: (tastID: String) => void;
}


function Task({ taskID, deleteTaskID }: Props) {

    const navigate = useNavigate();

    var currentTask = taskList[taskID]

    const [responseType, setResponseType] = useState(currentTask["response_type"])

    return <div className="description" style={{ padding: "0rem" }}>
        <button className="rightButtonRed" title="click to close" onClick={() => {

            //Delete this task from the task list

            deleteTaskID(taskID)
            
        }} aria-label="click to close">x</button>
        <Popup
            trigger={<button className="rightButtonNormal">Edit</button>}
            modal
            nested
        >
            {(close: React.MouseEventHandler<HTMLButtonElement> | undefined) => (
                <div className="modal">
                    <div className="header"> Edit Task </div>
                    <div className="content">

                        <Stack spacing={2}>
                            <TextField id="outlined-multiline-flexible" multiline label="Question" variant="outlined" size="medium" style={{ width: '100ch' }} maxRows={4} defaultValue={currentTask["question"]} />
                            <TextField id="outlined-multiline-flexible" multiline label="Hint Message" variant="outlined" size="medium" style={{ width: '100ch' }} maxRows={4} defaultValue={currentTask["hintMSG"]} />
                            <FormControl variant="standard">
                                <InputLabel id="demo-simple-select-standard-label">Response Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={responseType}
                                    onChange={(event) => setResponseType(event.target.value)}
                                    label="Response Type"
                                >
                                    <MenuItem value={"free text"}>free text</MenuItem>
                                    <MenuItem value={"Single Choice"}>Single Choice</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField id="outlined-multiline-flexible" multiline label="Item Name" variant="outlined" size="medium" style={{ width: '100ch' }} maxRows={4} defaultValue={currentTask["search_function"]["name"]} />
                            <TextField id="outlined-multiline-flexible" multiline label="Regular Expression" variant="outlined" size="medium" style={{ width: '100ch' }} maxRows={4} defaultValue={currentTask["search_function"]["regex"]} />
                        </Stack>

                    </div>
                    <div className="actions">
                        <button
                            className="button"
                            onClick={() => {
                                console.log('modal closed ');
                                close();
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </Popup>


        <h2>ID: {taskID}</h2>
        <p>
            {taskList[taskID]["question"]}
        </p>
    </div>

}



export function ManageTasks() {

    const navigate = useNavigate();

    const [localTaskList, setLocalTaskList] = useState(taskList)


    const deleteCallBack = (taskID: String) => {
        delete localTaskList[taskID]
        setLocalTaskList(localTaskList)

        console.log(localTaskList)
    }

    //Get the array of TaskIDs from our taskData JSON
    const taskIDsFromJson: string[] = []
    for (var task in taskList) {
        taskIDsFromJson.push(task)
    }


    //Convert them to a list to be displayed
    const taskIDs = taskIDsFromJson.map((task) =>
        <ul className="fullclick"><li ><Task taskID={task} deleteTaskID={deleteCallBack} /></li></ul>)

    return <div className="sidebar" style={{ width: "25vw" }}>
        <div className="description" style={{ padding: "1rem" }}>

            <div className="navbar">
                <button className="buttonNormal" id='BackButton' onClick={(e) => {
                    navigate('/')
                }
                }>Back</button>
                {/* <button className="buttonTopRight" id='SaveButton' onClick={(e) => {
                    console.log("Save pressed!")
                }
                }>Save</button> */}
            </div>

            <h2 style={{ marginBottom: "1rem" }}>Manage Tasks</h2>
            {taskIDs}

        </div>
    </div>

}

