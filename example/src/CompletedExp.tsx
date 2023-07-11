import React, { useState } from "react"
import Login from "./ExperimentSelection"
import taskList from '/static/data/taskData.json'
import { v4 as uuid } from 'uuid';
import expList from '/static/data/experiment.json'
import pdfList from '/static/data/pdfList.json'




interface Props {
    login: Login;
    records: any;
    nextexpids: (updateLogin: Login) => void;
    showFileFlag: any;
    expCompleted: any;
    endfinished: () => void;

}




export function CompletedExp({
    login,
    records,
    nextexpids,
    showFileFlag,
    expCompleted,
    endfinished


}: Props) {

    let d = Date.now();
    // console.log(d.toString())


    timeConverter(d)


    function timeConverter(d: any) {
        var date = new Date(d);
        var timeInfo = "Date: " + date.getDate() +
            "/" + (date.getMonth() + 1) +
            "/" + date.getFullYear() +
            " " + date.getHours() +
            ":" + date.getMinutes() +
            ":" + date.getSeconds()
        console.log(date.getTime())
        console.log(date)
        console.log(new Date(d).toLocaleDateString("en-AU"))
        return timeInfo
    }

    function timeDifference(date1: any, date2: any) {
        var difference = date1 - date2;

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24

        var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60

        var minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60

        var secondsDifference = Math.floor(difference / 1000);

        return (
            // daysDifference + ' day ' +
            hoursDifference + ' hour ' +
            minutesDifference + ' minute ' +
            secondsDifference + ' second ')
    }



    const expID = login.selectedExpID
    const name = login.name
    const pdfID = login.pdfID
    const pdfIdxCol: string = 'pdfID'
    const taskIDsCol: string = 'taskIDs'

    const timeStart = timeConverter(records['startTimestamp'])
    const timeEnd = timeConverter(records['endTimestamp'])
    const timeDiff = timeDifference(records['endTimestamp'], records['startTimestamp'])

    const taskIDs = login.tasks.map((task, index) =>
        <li key={uuid()}>
            {task.taskID}:
            <ul>
                <li key={uuid()}>
                    Question: {JSON.stringify(taskList[task.taskID].question)}
                </li>
              
                {records[task.taskID].map((ele: any, index: any) =>
                    <li key={uuid()}>
                        #{index + 1} Answer : {ele["userInput"]}
                    </li>)}
            
            </ul>
        </li>)

    console.log(login)

    console.log(records)

    const downloadFile = async (fileName:string, records:any) => {
        const myData = records
    
        const json = JSON.stringify(myData);
        const blob = new Blob([json],{type:'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const generateJson = (records:any)=>{
        let tempDic:any = {}
        let rootDic:any = {}
        let rootID = records['expID']
        let commentObj = records['Comments']
        let jsonArray:any = []
        Object.entries(commentObj).forEach(([key, value]: [string, any]) => {
            jsonArray.push({"taskID": key, "comment":value, "status":records[key]})
        })
        tempDic = {"userName": records["userName"], 
        "startTimestamp": records["startTimestamp"], 
        "endTimestamp": records["endTimestamp"], 
        "timeDiff": timeDiff,
        "taskInfo":jsonArray}
        rootDic[rootID] = tempDic
        return rootDic
    }

 

    let [logDetail, setLogState] = useState({
        selectedExpID: "0",
        name: "",
        pdfID: "",
        tasks: []
    })


    let [curExpID, setCurExpID] = useState(expID)
    let [finish, setFinish] = useState(false)    
    let [showsubmitMSG, setShowMSG] = useState("Next experiment")


  

    function generateRestExps() {

        delete expList[curExpID]
        
     
        // curExpIDList = curExpIDs

        let curExpIDArray = Object.keys(expList)
        console.log(curExpID)
        console.log(curExpIDArray)
        console.log(expList)
        if(curExpIDArray.length != 0){
            curExpID = curExpIDArray[0]
        
            logDetail = {
                selectedExpID: curExpID,
                name: records['userName'],
                pdfID: pdfList[expList[curExpID][pdfIdxCol]],
                tasks: expList[curExpID][taskIDsCol]
            }
            // setCurExpIDList(curExpIDList)

            console.log(logDetail)
        } else {
            logDetail = {
                selectedExpID: "0",
                name: "",
                pdfID: "",
                tasks: []
            }
           
            finish = true
            setFinish(true)
            setShowMSG("There is no more experiment.")
            endfinished()
        }

    }

    console.log(login)
    console.log(records)
    console.log(expList)
    // console.log(curExpIDList)
    console.log(curExpID)

    if (finish) {
        return (
        <div className="description" style={{ padding: "1rem" }}>
            <h3>All experiments have been completed. Thanks for your participation. </h3>
        </div>
        )
    } else {
        const fileName = records['expID'] + '_user';
        downloadFile(fileName, (generateJson(records)))

        return (
            <div className="description" style={{ padding: "1rem" }}>
                <h3>Thanks for your participation. The summary is shown below.</h3>
                <ul>
                    <li key={uuid()}>
                        Experiment ID: {expID}
                    </li>
                    <li key={uuid()}>
                        Name: {name}
                    </li>
                    <li key={uuid()}>
                        PDF Path: {pdfID}
                    </li>
                    <li key={uuid()}>
                        Time starts: {timeStart}
                    </li>
                    <li key={uuid()}>
                        Time ends: {timeEnd}
                    </li>
                    <li key={uuid()}>
                        Total time used: {timeDiff}
                    </li>
                    <li key={uuid()}>
                        Task IDs:
                        <ul>
                            {taskIDs}
                        </ul>
                    </li>
    
                </ul>
    
                <div className="description" style={{ padding: "1rem" }}>
                    <h3>Click the button for the next experiment</h3>
                    <form>
                        <div style={{ padding: "1rem" }}>
                            <a href="#" className="nextexp round" id="nextexp"
                            onClick={(e) => {
                               
                                    generateRestExps()
                                    console.log(logDetail)

                                    if (logDetail.selectedExpID != "0"){
                                        nextexpids(logDetail)
                                        expCompleted(false)
                                        showFileFlag = true
                                    } 
                                   
                                   
                                
                                
                            }} style={{ margin: "20px" }}>{showsubmitMSG} &raquo;</a>
                        </div>
                    </form>
    
                </div>
        
            </div>
    
        );
    }

    // return (
    //     <div className="description" style={{ padding: "1rem" }}>
    //         <h3>Thanks for your participation. The summary is shown below.</h3>
    //         <ul>
    //             <li key={uuid()}>
    //                 Experiment ID: {expID}
    //             </li>
    //             <li key={uuid()}>
    //                 Name: {name}
    //             </li>
    //             <li key={uuid()}>
    //                 PDF Path: {pdfID}
    //             </li>
    //             <li key={uuid()}>
    //                 Time starts: {timeStart}
    //             </li>
    //             <li key={uuid()}>
    //                 Time ends: {timeEnd}
    //             </li>
    //             <li key={uuid()}>
    //                 Total time used: {timeDiff}
    //             </li>
    //             <li key={uuid()}>
    //                 Task IDs:
    //                 <ul>
    //                     {taskIDs}
    //                 </ul>
    //             </li>

    //         </ul>

    //         <div className="description" style={{ padding: "1rem" }}>
    //             <h3>Click the button for the next experiment</h3>
    //             <form>
    //                 <div style={{ padding: "1rem" }}>
    //                     <a href="#" className="nextexp round" id="nextexp"
    //                     onClick={(e) => {
    //                         if (finish){
    //                             console.log("herewrewrewrew")
                                
    //                         } else {
    //                             generateRestExps()
    //                             console.log(logDetail)
    //                             nextexpids(logDetail)
    //                             expCompleted(false)
    //                             showFileFlag = true
                               
    //                         }
                            
    //                     }} style={{ margin: "20px" }}>{showsubmitMSG} &raquo;</a>
    //                 </div>
    //             </form>

    //         </div>
       
            
      
    //     </div>

     



    // );
}


