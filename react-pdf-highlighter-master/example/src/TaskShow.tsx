import React, { useState } from "react"
import type { IHighlight } from "./react-pdf-highlighter";
import { Instruction } from "./Instruction"
import Login from "./FileSel"
import taskList from '/static/data/taskData.json'




interface Props {
    highlights: Array<IHighlight>;
    resetHighlights: () => void;
    toggleDocument: (updateTaskID: string) => void;
    login: Login;

}

const updateHash = (highlight: IHighlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

export function TaskShow({
    highlights,
    toggleDocument,
    resetHighlights,
    login
}: Props) {

    //filter the uncompleted tasks
    const taskStatus: any = []
    login.tasks.forEach((element) => {
        if (element['completed'] == false) {
            taskStatus.push(element)
        }
    })



    const [startTaskFlag, setStartTaskFlag] = useState(false)
    const [taskID, setTaskID] = useState(1)
    const [question, setQuestion] = useState(taskList[taskStatus[0]['taskID']]['question'])
    const [hightlightID, setHightlightID] = useState(taskStatus[0]['taskID'])
    // const [hightlight, setHightlight] = useState(highlights)



    function updateTask() {
        setTaskID(function (prev) {
            return prev + 1
        })
        setQuestion(taskList[taskStatus[taskID]['taskID']]['question'])
        setHightlightID(taskStatus[taskID]['taskID'])
        resetHighlights()
    }




    if (!startTaskFlag) {
        return (
            <div >
                <Instruction
                    login={login}
                    startTask={setStartTaskFlag}
                />
            </div>)
    } else {

        console.log(login)
        console.log(highlights)


        return (

            <div >
                <div className="description" style={{ padding: "1rem" }}>
                    <h2 style={{ marginBottom: "1rem" }}>Task {taskID}</h2>
                    <p>
                        Please identify the words in PDF for the annotation base on the following question:
                    </p>

                    <p>
                        {question}
                    </p>




                </div>


                {/* hightlight indicates the component information (position,text,id)
            index indicates the order showed on the side bar */}
                <ul className="sidebar__highlights">
                    {highlights.map((highlight, index) => (
                        <li
                            key={index}
                            className="sidebar__highlight"
                            onClick={() => {
                                console.log(highlight.id)
                                updateHash(highlight);
                                console.log(highlight)
                                console.log(highlight.id)
                                console.log(index)
                            }}
                        >
                            <div>
                                <strong>{highlight.comment.text}</strong>
                                {highlight.content.text ? (
                                    <blockquote style={{ marginTop: "0.5rem" }}>
                                        {`${highlight.content.text.slice(0, 90).trim()}…`}
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
                        </li>
                    ))}
                </ul>

                {/* <div>
                <div style={{ padding: "1rem" }}>
                    <p>
                        We found one instance of the {suggestion}'s name, Please check this.
                    </p>
                </div>
            </div> */}

                {/* <div style={{ padding: "1rem" }}>
  
            <button className="button button3" onClick={toggleDocument}>More suggestion</button>
  
          </div> */}


                {highlights.length == 0 ? (
                    <div style={{ padding: "1rem" }}>
                        <button onClick={(e) => toggleDocument(hightlightID)}>Show highlight</button>
                    </div>

                ) : null}

                {/* <div style={{ padding: "1rem" }}>
                    <button onClick={(e) => toggleDocument(hightlightID)}>Show highlight</button>
                </div> */}

                {/* if hightlight components has more than 0, it shows reset button, else is null */}
                {highlights.length > 0 ? (
                    <div style={{ padding: "1rem" }}>
                        <button onClick={resetHighlights}>Reset highlights</button>
                    </div>

                ) : null}

                <div style={{ padding: "1rem" }}>
                    <button onClick={updateTask}>Next</button>
                </div>

            </div>

        );
    }
}
