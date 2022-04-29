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
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";
import Login from "./FileSel"


import "./style/App.css";

// enable the line to generate the json data read by pdf highlighter,
// and move the json file into /example/static/data folder. 
// Once the json files have been moved, disenable it
// import "./dataPreproces.tsx";
// enable to test on dataDectcts script
import { testHighlights, userRecords } from "./dataDetect";




interface State {
  login: Login;
  url: string;
  highlights: Array<IHighlight>;
  records: any;
  end: any;

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



// state initilisation
const loginEmpty = {} as Login;
const urlEmpty: string = '';
const highlightsEmpty: Array<IHighlight> = [];
const recordEmpty = {}



class App extends Component<{}, State> {

  state = {
    login: loginEmpty,
    url: urlEmpty,
    // highlights: testHighlights[PRIMARY_PDF_URL]
    //   ? [...testHighlights[PRIMARY_PDF_URL]]
    //   : [],
    highlights: highlightsEmpty,
    records: recordEmpty,
    end: false
  };



  resetHighlights = () => {
    
  
    this.setState({
      // login: loginEmpty,
      url: urlEmpty,
      highlights: highlightsEmpty,
      // records: recordEmpty
    });
  };

  browseJson = (updateLogin: Login) => {

    const newLogin = this.state.login = updateLogin
    userRecords[newLogin.expID]['userName'] = newLogin['name']
    let newrecords = this.state.records = userRecords[newLogin.expID]

    this.setState({
      login: newLogin,
      url: newLogin['pdfID'],
      records: newrecords,
    });

  };

  nextExps = (updateLogin: Login) => {

    const newLogin = this.state.login = updateLogin
    userRecords[newLogin.expID]['userName'] = newLogin['name']
    let newrecords = this.state.records = userRecords[newLogin.expID]

    this.setState({
      login: newLogin,
      url: newLogin['pdfID'],
      records: newrecords,
    });

  };


  updateRecords = (newrecords: any) => {
    console.log("updateRecords")
    const newRecords = this.state.records = newrecords

    this.setState({
      records: newRecords
    });


  };


  toggleDocument = (updateTaskID: string) => {

    const newExpID = this.state.login.expID;
    const newHLID = updateTaskID


    // this.state.url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    console.log(newExpID)
    console.log(newHLID)
    this.setState({
      // url: newUrl,
      // highlights: testHighlights[newUrl] ? [...testHighlights[newUrl]] : [],

      // show highlight content directly
      highlights: testHighlights[newExpID][newHLID],
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

  
  endfinished = () => {
  
    this.setState({
      end: true
    });
  };


  render() {

    const { login, url, highlights, records, end } = this.state;
    console.log(login, url, highlights, records, end)

    if (end) {
      console.log(end)
      return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
         <p className="blocktext">All experiments have been completed. 
         
         <img className="displayed" src="/static/thankyou.jpg" ></img>
         </p>
         
        </div>
      )

    } else {
      return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
          <Sidebar
            login={login}
            // url={url}
            highlights={highlights}
            toggleDocument={this.toggleDocument}
            browseJson={this.browseJson}
            resetHighlights={this.resetHighlights}
            records={records}
            updateRecords={this.updateRecords}
            nextExps={this.nextExps}
            endfinished={this.endfinished}
  
          />
          <div style={{ height: "100vh", width: "75vw", position: "relative" }}>
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
}

export default App;
