import React, { Component } from "react";

import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from "./react-pdf-highlighter";


import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";

import "./style/App.css";

import { data } from "./dataDetect";



// write auto detect function to show the text or content from pdf
const autoDetectData: Record<string, Array<IHighlight>> = data;
console.log(autoDetectData)


const testHighlights333: Record<string, Array<IHighlight>> = _testHighlights;



interface State {
  url: string;
  highlights: Array<IHighlight>;
  updateTaskNo: number;
  taskQuestion: string;
  suggestion:string;
}




const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf";
const SECONDARY_PDF_URL = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

// console.log(initialUrl)
var testHighlights = {"https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf" : [testHighlights333[initialUrl][0]]}
// console.log(testHighlights)



var curTaskID = 1;
const taskList = ["What is the Judge's name?", "What is the Appellant's name?", 
                  "What is the Respondents' name?"]; 
const sugList = ["Judge", "Appellant", "Respondents"]; 

const curTaskQuestion = taskList[0]
const curSug = sugList[0]

function getNextTaskId(taskID: number) {
  return taskID + 1;
}

function getNextTaskQuestion(idx: number) {
  return taskList[idx];
}

function getNextTaskSuggestion(idx: number) {
  testHighlights = {"https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf" : [testHighlights333[initialUrl][idx-1]]}
  return testHighlights;
}

function getNextSug(idx: number) {
  return sugList[idx];
}

console.log("this is a main file")
console.log(getNextSug(2))


class App extends Component<{}, State> {
  state = {
    url: initialUrl,
    highlights: testHighlights[initialUrl]
      ? [...testHighlights[initialUrl]]
      : [],
    updateTaskNo: curTaskID,
    taskQuestion: curTaskQuestion,
    suggestion: curSug,
  };



  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  toggleDocument = () => {
    const newUrl =
      this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    this.setState({
      url: newUrl,
      highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],
    });
  };

  nextTask = () => {
    const newTaskNo = this.state.updateTaskNo = getNextTaskId(this.state.updateTaskNo)
    const newTaskQue = this.state.taskQuestion = getNextTaskQuestion(newTaskNo-1)
    const newSug = this.state.suggestion = getNextSug(newTaskNo-1)
    const newHighlight = this.state.highlights = getNextTaskSuggestion(newTaskNo)



    this.setState({
      updateTaskNo: newTaskNo,
      taskQuestion: newTaskQue,
      suggestion: newSug,
      highlights : newHighlight[initialUrl],

      
    });
  };

  
  scrollViewerTo = (highlight: any) => { };

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener(
      "hashchange",
      this.scrollToHighlightFromHash,
      false
    );
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  // add highlight object with the location information
  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }

    // only update the image highlight by dragging the mouse
  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      }),
    });
  }

  render() {
    const { url, highlights, updateTaskNo, taskQuestion, suggestion} = this.state;

    return (
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          highlights={highlights}
          resetHighlights={this.resetHighlights}
          toggleDocument={this.toggleDocument}
          nextTask={this.nextTask}
          updateTaskNo={updateTaskNo}
          taskQuestion={taskQuestion}
          suggestion={suggestion}

        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        >
          <PdfLoader url={url} beforeLoad={<Spinner />}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;
         
                  this.scrollToHighlightFromHash();
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      this.addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        this.updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
}

export default App;
