import React from "react";
import type { IHighlight } from "./react-pdf-highlighter";

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  nextTask: () => void;
  updateTaskNo: number;
  taskQuestion?: string;
  suggestion?: string;

}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

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
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Proof Reading helper</h2>

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

        <p>
            Task {updateTaskNo}/8
        </p>
        
        <p>
        {updateTaskNo}. {taskQuestion}
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

      <div>
        <div style={{ padding: "1rem" }}>
        <p>
            We found one instance of the {suggestion}'s name, Please check this.
        </p>
        </div>
      </div>
     
      {/* <div style={{ padding: "1rem" }}>

        <button className="button button3" onClick={toggleDocument}>More suggestion</button>

      </div> */}

      <div style={{ padding: "1rem" }}>

        <button className="button button2" onClick={nextTask}>Next task</button>
  
        {/* <button className="button button4" onClick={toggleDocument}>Only show red</button> */}
      </div>
      
      
      <div style={{ padding: "1rem" }}>
        <button onClick={toggleDocument}>Default highlight</button>
      </div>

      {/* if hightlight components has more than 0, it shows reset button, else is null */}
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    
    </div>
  );
}
