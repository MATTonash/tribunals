import React, { useState } from "react";
import type { IHighlight } from "./react-pdf-highlighter";
import { ExperimentSelection } from "./ExperimentSelection"
import { TaskShow } from "./TaskShow"
import Login from "./ExperimentSelection"
import { CompletedExp } from "./CompletedExp"

interface Props {
  login: Login;
  // url: string;
  highlights: Array<IHighlight>;
  records: any;
  resetHighlights: () => void;
  browseJson: (updateLogin: Login) => void;
  toggleDocument: (updateTaskID: string) => void;
  updateRecords: (newrecords: any) => void;
  nextExps: (updateLogin: Login) => void;
  endfinished: () => void;
  
}


export function Sidebar({
  login,
  // url,
  highlights,
  records,
  resetHighlights,
  browseJson,
  toggleDocument,
  updateRecords,
  nextExps,
  endfinished

}: Props) {
  // can write use state
  const [selectedExperiment, setShowFileFlag] = useState(false)
  const [completedExp, setcompletedExp] = useState(false)

  if (!selectedExperiment) {
    console.log("Selected experiment is false, showing experiment selection")
    return (
      <div className="sidebar" style={{ width: "25vw" }}>

        {/* <p style={{ fontSize: "0.7rem" }}>
            <a href="https://github.com/agentcooper/react-pdf-highlighter">
              Open in GitHub
            </a>
          </p> */}

        {/* <p>
            <small>
              To create area highlight hold ⌥ Option key (Alt), then click and
              drag.
            </small>
          </p> */}


        <ExperimentSelection
          login={login}
          // url={url}
          browseJson={browseJson}
          remove={setShowFileFlag}

        />

      </div>
    );
  } else {
    console.log("Experiement Selected, showing tasks")

    if (!completedExp) {
      return (
        <div className="sidebar" style={{ width: "25vw" }}>



          <TaskShow
            login={login}
            highlights={highlights}
            toggleDocument={toggleDocument}
            resetHighlights={resetHighlights}
            records={records}
            updateRecords={updateRecords}
            expCompleted={setcompletedExp}
          />

        </div>
      );
    } else {
      return (
        <div className="sidebar" style={{ width: "25vw" }}>
          <CompletedExp
            login={login}
            records={records}
            nextexpids={nextExps}
            showFileFlag={setShowFileFlag}
            expCompleted={setcompletedExp}
            endfinished={endfinished}
          />



        </div>
      );
    }

  }
  // return (
  //   <div className="sidebar" style={{ width: "25vw" }}>

  //     {/* <p style={{ fontSize: "0.7rem" }}>
  //         <a href="https://github.com/agentcooper/react-pdf-highlighter">
  //           Open in GitHub
  //         </a>
  //       </p> */}

  //     {/* <p>
  //         <small>
  //           To create area highlight hold ⌥ Option key (Alt), then click and
  //           drag.
  //         </small>
  //       </p> */}


  //     <FileSel
  //       login={login}
  //       // url={url}
  //       browseJson={browseJson}
  //     />


  //     <TaskShow
  //       highlights={highlights}
  //       resetHighlights={resetHighlights}
  //       toggleDocument={toggleDocument}

  //     />

  //   </div>
  // );
}
