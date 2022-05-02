
## This project is based on react-pdf-highlighter library
The key code is in the 'example' directory, as we are modifyign this to build our system. The sidepane.tsx contains the tasks. 

## react-pdf-highlighter

`react-pdf-highlighter` is a [React](https://reactjs.org/) library that provides annotation experience for PDF documents on web. It is built on top of PDF.js by Mozilla. Text and rectangular highlights are supported. Highlight
data format is independent of the viewport, making it suitable for saving on the
server.

### Example

For online example check https://agentcooper.github.io/react-pdf-highlighter/.

To run the example app locally:

```
npm install
npm start
```


### Installation

`npm install `

### Prior art

[`react-pdf`](https://github.com/wojtekmaj/react-pdf) and
[`react-pdfjs`](https://github.com/erikras/react-pdfjs) only provide React
wrappers for PDF.js and do not have built-in annotation functionality.

[`pdfjs-annotate`](https://github.com/instructure/pdf-annotate.js/) does not
provide text highlights out of the box.

PDF.js provides only viewer:

> [PDF.js is mainly written for reading PDF files, not editing them. Because of that we don't yet support adding any kind of annotations. We do however support rendering a number of annotation types for viewing.](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#is-it-possible-to-add-annotations-to-a-pdf)

See also:

- https://github.com/mozilla/pdf.js
- https://github.com/wojtekmaj/react-pdf
- https://github.com/erikras/react-pdfjs
- https://github.com/instructure/pdf-annotate.js/
- https://blogs.dropbox.com/tech/2016/11/annotations-on-document-previews/

### Compatibility

Works in Google Chrome, Safari 10+, Firefox 52+. Not tested in Internet
Explorer.
