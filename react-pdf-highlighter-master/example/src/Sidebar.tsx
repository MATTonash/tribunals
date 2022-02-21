import React from "react";
import type { IHighlight } from "./react-pdf-highlighter";
import FileSel from "./FileSel"
import { TaskShow } from "./TaskShow"

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  nextTask: () => void;
  updateTaskNo: number;
  taskQuestion?: string;
  suggestion?: string;
}


export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  nextTask,
  updateTaskNo,
  taskQuestion,
  suggestion,


}: Props) {
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


      <FileSel />


      <TaskShow
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
        nextTask={nextTask}
        updateTaskNo={updateTaskNo}
        taskQuestion={taskQuestion}
        suggestion={suggestion} />

    </div>
  );
}
