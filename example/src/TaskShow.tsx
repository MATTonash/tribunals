import React, { useState } from "react"
import type { IHighlight } from "./react-pdf-highlighter";
import { Instruction } from "./Instruction"
import Login from "./FileSel"
import taskList from '/static/data/taskData.json'
import TextField from "@material-ui/core/TextField";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
// import { v4 as uuid } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';



interface Props {
    highlights: Array<IHighlight>;
    resetHighlights: () => void;
    toggleDocument: (updateTaskID: string) => void;
    login: Login;
    records: any;
    updateRecords: (newrecords: any) => void;
    expCompleted: any

}

const updateHash = (highlight: IHighlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

export function TaskShow({
    highlights,
    toggleDocument,
    resetHighlights,
    login,
    records,
    updateRecords,
    expCompleted

}: Props) {

    //filter the uncompleted tasks
    const taskStatus: any = []
    login.tasks.forEach((element) => {
        if (element['completed'] == false) {
            taskStatus.push(element)
        }
    })



    let [startTaskFlag, setStartTaskFlag] = useState(false)
    let [taskID, setTaskID] = useState(0)
    let [question, setQuestion] = useState(taskList[taskStatus[0]['taskID']]['question'])
    let [hint, setHint] = useState(taskList[taskStatus[0]['taskID']]['hint'])
    // const [hightlightID, setHightlightID] = useState(taskStatus[0]['taskID'])
    // const [hightlight, setHightlight] = useState(highlights)
    const maxNumTask = taskStatus.length
    const minNumTask = 1

    // let [answer, setAnswer] = useState("")
    let [locRec, setLocRec] = useState(records)
    let [completed, setCompleted] = useState(true)
    let [submitWarningMessages, setSWM] = useState("")
    let [showValid, setShowValid] = useState(false)
    let [validMSG, setValidMSG] = useState("")

    let [imcompletedIDs, setImcompletedIDsIDs] = useState([])
    let [curextraTFIdx, setcurExtraTFIdx] = useState(locRec[taskStatus[0]['taskID']].length)
    const [showDetMSG, setShowDetMSG] = useState("")
 

    console.log(highlights.length)
    console.log(curextraTFIdx)

    function nextTask() {
        if (taskID < maxNumTask) {
            setQuestion(taskList[taskStatus[taskID]['taskID']]['question'])
            // setHightlightID(taskStatus[taskID]['taskID'])
            // resetHighlights()
            console.log(taskStatus)
            console.log(records[taskStatus[taskID]['taskID']])
            if(records[taskStatus[taskID]['taskID']][0]['hint'].length === 0){
                setHint("There is no hint available.")
                records[taskStatus[taskID]['taskID']][0]['timestamp'] = Date.now()
            } else {
                setHint(taskList[taskStatus[taskID]['taskID']]['hintMSG'])
                let recordsArray = records[taskStatus[taskID]['taskID']]
                recordsArray.forEach((element: any, index: number) => {
                    records[taskStatus[taskID]['taskID']][index]['completed'] = true
                    records[taskStatus[taskID]['taskID']][index]['timestamp'] = Date.now()
                });
            
            }
           
            toggleDocument(taskStatus[taskID]['taskID'])
            setcurExtraTFIdx(locRec[taskStatus[taskID]['taskID']].length)
            taskID = taskID + 1
            setTaskID(taskID)
            console.log(taskID)
            console.log(locRec)
           
        }
    }

    function prevTask() {
        if (taskID > minNumTask) {

            taskID = taskID - 1;
            setTaskID(taskID);
            // console.log(taskID, taskList[taskStatus[taskID - 1]['taskID']]['question'])
            setQuestion(taskList[taskStatus[taskID - 1]['taskID']]['question'])

            if(records[taskStatus[taskID - 1]['taskID']][0]['hint'].length === 0){
                setHint("There is no hint available")
            } else {
                setHint(taskList[taskStatus[taskID - 1]['taskID']]['hintMSG'])
            }

            // setHint(taskList[taskStatus[taskID - 1]['taskID']]['hint'])
            toggleDocument(taskStatus[taskID - 1]['taskID'])
            // console.log(taskID)
            setcurExtraTFIdx(locRec[taskStatus[taskID-1]['taskID']].length)
        } else {

        }

    }

    function checkRecordCompleted() {
        taskStatus.forEach((element: any) => {
            let eachTaskRecord: any = locRec[element['taskID']]
            eachTaskRecord.forEach((ele2: any) => {
                if (ele2["completed"] === false) {
                    console.log("fdfddsfsdfsdfsdf")
                    completed = false
                    setCompleted(false)
                }
            })

        })
        // return true
        // setCompleted(false)
        // console.log(completed)
    }


    function validataion() {
        let locrecordsArray = locRec[taskStatus[taskID - 1]['taskID']]
        console.log("ccc", showValid, taskID)
        let tempArray:any = []

        locrecordsArray.forEach((element: any, index:number) => {
            console.log(element['userInput'])
            if (element['completed'] === false){
                console.log("fdfds")       
                tempArray.push(index)
                showValid = true
                setShowValid(true)
            }
        });
        imcompletedIDs = tempArray
        setImcompletedIDsIDs(tempArray)
        
    }



    if (!startTaskFlag) {
        return (
            <div >
                <Instruction
                    login={login}
                    startTask={setStartTaskFlag}
                    nextTask={nextTask}
                    setLocRec={setLocRec}
                    records={records}
                />
            </div>)
    } else {

        // console.log(taskStatus[taskID - 1])
        console.log(locRec[taskStatus[taskID - 1]['taskID']][0]['userInput'])
        const fileNameArray = login.pdfID.split('/')
        let fileName = fileNameArray[fileNameArray.length - 1]
        let highlighLen: number
        if (highlights.length) {
            highlighLen = highlights.length
        } else {
            highlighLen = 0
        }

        let filterETF = locRec[taskStatus[taskID - 1]['taskID']].slice(highlighLen)

        return (

            <div >
                <div className="description" style={{ padding: "1rem" }}>
                    <h2 style={{ marginBottom: "1rem" }}>Task {taskID} </h2>
                    <p>
                        Please identify the words in <span className="bold_text">{fileName} </span>file for the annotation base on the following question:
                    </p>


                    <h3>
                        <li>{question}</li>
                    </h3>

                    {/* <form><input type="text" placeholder="CHRIS"></input>
                    </form> */}

                    <p>
                        {hint} Leave the input box "N/A" if the task has no answer.
                    </p>



                </div>
                {<div id='addicon'>

                <Tooltip title="Add additional input box">
                            <IconButton   sx={{
          bgcolor: 'lightgray',
        }} color="primary" onClick={(e) => { 
                            console.log(taskList[taskStatus[taskID - 1]['taskID']]['search_function']['name'])
                          

                            console.log(locRec[taskStatus[taskID - 1]['taskID']])
                            locRec[taskStatus[taskID - 1]['taskID']].push({
                                completed: false,
                                hint: "N/A/Extra addIcon",
                                timestamp: Date.now(),
                                typingtimestamp: 0,
                                userInput: ""
                             
                            })

                            curextraTFIdx = locRec[taskStatus[taskID - 1]['taskID']].length
                            setcurExtraTFIdx(locRec[taskStatus[taskID - 1]['taskID']].length)
                        }}>
                                <AddIcon  />
                            </IconButton>
                        </Tooltip>
                    {/* <Fab size="small" color="primary" aria-label="add">
                        <AddIcon    onClick={(e) => { 
                            console.log(taskList[taskStatus[taskID - 1]['taskID']]['search_function']['name'])
                          

                            console.log(locRec[taskStatus[taskID - 1]['taskID']])
                            locRec[taskStatus[taskID - 1]['taskID']].push({
                                completed: false,
                                hint: "N/A/Extra addIcon",
                                timestamp: Date.now(),
                                typingtimestamp: 0,
                                userInput: ""
                             
                            })

                            curextraTFIdx = locRec[taskStatus[taskID - 1]['taskID']].length
                            setcurExtraTFIdx(locRec[taskStatus[taskID - 1]['taskID']].length)
                        }}/>
                    </Fab> */}

                </div>}


                {/* hightlight indicates the component information (position,text,id)
            index indicates the order showed on the side bar */}
                <ul className="sidebar__highlights">
                    {/* {console.log(highlights)} */}
                    {highlights.map((highlight, index) => (

                        <li
                            key={index}
                            className="sidebar__highlight"

                        >

                            <div onClick={() => {
                                console.log(JSON.stringify(highlight.comment.text))
                                console.log(highlight.id)
                                updateHash(highlight);
                                console.log(highlight)
                                console.log(highlight.id)
                                console.log(index)
                            }}>
                                <div>
                                    <strong>{highlight.comment.text}</strong>
                                    {highlight.content.text ? (
                                        <blockquote style={{ marginTop: "0.5rem" }}>
                                            {/* change back for the ... */}
                                            {/* {`${highlight.content.text.slice(0, 90).trim()}…`} */}
                                            {`${highlight.content.text}`}
                                        </blockquote>
                                    ) : null}
                                    {highlight.content.image ? (
                                        <div
                                            className="highlight__image"
                                            style={{ marginTop: "0.5rem" }}
                                        >
                                            <img src={highlight.content.image} alt={"Screenshot"} />
                                        </div>
                                    ) : null}
                                </div>

                                <div className="highlight__location">
                                    Page {highlight.position.pageNumber}
                                </div>
                            </div>

                            <div>
                                <TextField autoComplete="off" fullWidth key={index}
                                    value={records[taskStatus[taskID - 1]['taskID']][index]['userInput']}
                                    id="outlined-basic" color="secondary" label="Enter your answer" variant="outlined" 
                                    onChange={(e) => {
                                        // setAnswer(e.target.value)
                                        console.log("typingg!!!!")
                                        locRec[taskStatus[taskID - 1]['taskID']][index]['userInput'] = e.target.value
                              
                                        if (e.target.value.length != 0 && e.target.value.trim().length != 0) {
                                            locRec[taskStatus[taskID - 1]['taskID']][index]['completed'] = true
                                            locRec[taskStatus[taskID - 1]['taskID']][index]['typingtimestamp'] = Date.now()
                                            setShowValid(false)
                                        
                                        } else {
                                            locRec[taskStatus[taskID - 1]['taskID']][index]['completed'] = false
                                            

                                        }

                                        setLocRec(locRec)
                                        updateRecords(locRec)

                                    }} />
                                {/* <input maxLength={50}
                                    type="text"
                                    value={locRec[taskStatus[taskID - 1]['taskID']][index]['userInput']}
                                    onChange={(e) => {
                                        // setAnswer(e.target.value)
                                        locRec[taskStatus[taskID - 1]['taskID']][index]['userInput'] = e.target.value
                                        setLocRec(locRec)
                                        updateRecords(locRec)

                                    }}
                                ></input> */}
                            </div>

                        </li>
                    ))}
                   
                </ul>



                {highlights.length != curextraTFIdx ? (
                    <ul className="sidebar__highlights">
                    {console.log(curextraTFIdx)}

                    {filterETF.map((element: any, index:any) => (

                        <li
                            key={highlighLen + index}
                            className="sidebar__highlight"

                        >
                        <div>
                            <strong style={{ marginTop: "0.5rem" }}>{taskList[taskStatus[taskID - 1]['taskID']]['search_function']['name'] + ' ' + (highlighLen + index + 1)}</strong>
                        </div>
                        <div className="highlight__location">
                        <Tooltip title="Delete this additional input box">
                            <IconButton onClick={(e) => { 
                     
                            console.log(locRec[taskStatus[taskID - 1]['taskID']])
                            let tempID:number
                            tempID = highlighLen + index
                            locRec[taskStatus[taskID - 1]['taskID']].splice(tempID, 1)
                            console.log(tempID)
                            console.log(locRec[taskStatus[taskID - 1]['taskID']])

                            curextraTFIdx = locRec[taskStatus[taskID - 1]['taskID']].length
                            setcurExtraTFIdx(locRec[taskStatus[taskID - 1]['taskID']].length)
                        }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                            
                        </div>
                        <div>
                            <TextField autoComplete="off" fullWidth key={highlighLen + index}
                                value={records[taskStatus[taskID - 1]['taskID']][highlighLen + index]['userInput']}
                                id="outlined-basic" color="secondary" label="Enter your answer" variant="outlined" 
                                onChange={(e) => {
                                    // e.preventDefault()
                                    // setAnswer(e.target.value)
                                    console.log("typingg!!!!")
                                    locRec[taskStatus[taskID - 1]['taskID']][highlighLen + index]['userInput'] = e.target.value
                                    console.log(locRec[taskStatus[taskID - 1]['taskID']][highlighLen + index]['userInput'])
                                    console.log(e.target.value)
                                    if (e.target.value.length != 0 && e.target.value.trim().length != 0) {
                                        locRec[taskStatus[taskID - 1]['taskID']][highlighLen + index]['completed'] = true
                                        locRec[taskStatus[taskID - 1]['taskID']][highlighLen + index]['typingtimestamp'] = Date.now()
                                        setShowValid(false)
                                    
                                    } else {
                                        locRec[taskStatus[taskID - 1]['taskID']][highlighLen + index]['completed'] = false
                                        

                                    }

                                    setLocRec(locRec)
                                    updateRecords(locRec)

                                }} />
                        </div>

                    </li>
                    ))}

                    </ul>
                    
                ) : null}

                
              
                <p style={{padding: "1rem" , color: "red" }}>
                    {validMSG}
                </p>
                   
            

                {/* if hightlight components has more than 0, it shows reset button, else is null */}
                {/* {highlights.length > 0 ? (
                    <div style={{ padding: "1rem" }}>
                        <button onClick={resetHighlights}>Reset highlights</button>
                    </div>

                ) : null} */}
                <div style={{ padding: "1rem" }}>
                    <a href="#" className="previous round" id="prev"
                        onClick={(e) => {
                            validataion()
                            console.log(imcompletedIDs)

                            if (imcompletedIDs.length != 0) {
                                setValidMSG("Warning: The answer(s) is/are blank! Modify the answer, or leave it as the blank by clicking the Prev or the Next buttons again.")
                                imcompletedIDs.forEach((element: any) => {
                                    locRec[taskStatus[taskID - 1]['taskID']][element]['completed'] = true
                                  
                                });
                                imcompletedIDs = []
                                setImcompletedIDsIDs([])
                            } else {
                                prevTask()
                                setSWM("")
                                setShowValid(false)
                                setValidMSG("")
                             
                            }

                            // if (showValid){
                            //     setValidMSG("The answer can not be blank!")
                            //     showValid = false
                            //     console.log(locRec[taskStatus[taskID - 1]['taskID']])

                            // } else {
                            //     prevTask()
                            //     setSWM("")
                            //     setShowValid(false)
                            //     setValidMSG("")
                            // }

                            
                        }} style={{ margin: "10px" }}>&laquo; Prev</a>

                    {taskID < maxNumTask ? (<a href="#" className="next round" id="next" onClick={(e) => {
                        
                        // add condition here for the validataion function
                        validataion()

                        if (imcompletedIDs.length != 0) {
                            setValidMSG("Warning: The answer(s) is/are blank! Modify the answer, or leave it as the blank by clicking the Prev or the Next buttons again.")
                            imcompletedIDs.forEach((element: any) => {
                                locRec[taskStatus[taskID - 1]['taskID']][element]['completed'] = true
                              
                            });
                            imcompletedIDs = []
                            setImcompletedIDsIDs([])
                        } else {
                            nextTask()
                            updateRecords(locRec)
                            setShowValid(false)
                            setValidMSG("")
                         
                        }

                        // if (showValid){
                        //     setValidMSG("Do you want to leave a blank for the answer?")
                        //     showValid = false
                          
                        //     setShowValid(false)
                        //     console.log(locRec[taskStatus[taskID - 1]['taskID']])
                        // } else {
                        //     nextTask()
                        //     updateRecords(locRec)
                        //     setShowValid(false)
                        //     setValidMSG("")
                        // }
                    
                    }} style={{ margin: "20px" }}>Next &raquo;</a>) :
                        (<div>
                            <p>
                                Complete all the tasks by clicking the "Submit" button below.
                            </p>
                            <p style={{ color: "red" }}>
                                {submitWarningMessages}
                            </p>
                            <a href="#" className="submit round" id="submit" onClick={(e) => {
                                // setAnswer(answer)
                                console.log(records)
                                checkRecordCompleted()
                                console.log(completed)
                                if (completed) {
                                    console.log("in checkrecordcompleted")
                                    records['endTimestamp'] = Date.now()
                                    setLocRec(records)
                                    updateRecords(locRec)
                                    expCompleted(true)
                                    resetHighlights()
                                 

                                } else {
                                    completed = true
                                    setCompleted(true)
                                    setSWM("Please answer all the tasks")
                                }

                            }} style={{ margin: "10px" }}>Submit</a>
                        </div>)}
                    {/* <a href="#" className="next round" id="next" onClick={(e) => {
                        // setAnswer(answer)
                        nextTask()
                        updateRecords(locRec)
                    }} style={{ margin: "20px" }}>Next &raquo;</a> */}
                </div>

                <div className="sidebar__highlight">
                    <TextField autoComplete="off" fullWidth
                        id="outlined-multiline-static"
                        label="Leave the comments if any"
                        multiline
                        rows={8}
                        value={records['Comments'][taskStatus[taskID - 1]['taskID']]}
                        variant="outlined"
                        onChange={(e) => {
                           
                            locRec['Comments'][taskStatus[taskID - 1]['taskID']] = e.target.value
                            setLocRec(locRec)
                            updateRecords(locRec)
                            console.log(records)
                   
                       
                        }}/>
                </div>

            </div >

        );
    }
}
