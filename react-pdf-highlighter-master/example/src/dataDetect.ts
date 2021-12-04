// libraries imported
import React, { Component } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

// pdf library loaded
const workerSrc = "https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js"
let viewportWidth
let viewportHeight



// generate the content by the page number
async function getItems(src, pg){

  if (typeof workerSrc === "string") {
    GlobalWorkerOptions.workerSrc = workerSrc
  }
  const doc = await getDocument(src).promise
  const page = await doc.getPage(pg)


  const scale = 1;
  const viewport = page.getViewport({ scale });
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1;

  //
  // Prepare canvas using PDF page dimensions
  //
  // const canvas = document.getElementById("the-canvas");

  //divide 0.6 ratio!!! to get the actual page size
  viewportWidth = viewport.width
  viewportHeight = viewport.height
  console.log(viewportWidth)
  console.log(viewportHeight)

  // canvas.width = Math.floor(viewport.width * outputScale);
  // canvas.height = Math.floor(viewport.height * outputScale);
  // canvas.style.width = Math.floor(viewport.width) + "px";
  // canvas.style.height = Math.floor(viewport.height) + "px";




  return await page.getTextContent()

  // const items = content.items.map((item) => {
  //   // console.log(item.str)
  //   // console.log(item.fontName)
  //   // console.log(item.transform)
  //   // console.log(item)
  // })
  
  // return content
}

// define the array for storing the content
let dataPageArray = []
const tranformScale = 0.60008553 //transformed scale
let pageNum, id

// has to the in string format



// get the link for the legal document
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2940/Miller,Phil%20-%20EA-2019-0183%20(06.08.21).pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2947/EA.2021.0126%20R.%20Miah%20s14%20Decision.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2857/Centre%20for%20Criminal%20Appeals%20EA2020-0181%20(040621)-%20JH%20Decision.pdf"
var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2817/Driver%20Ian%20(EA.2019.0254)%2008.04.21.pdf"


// test the getItems function to generate the content of page 1
console.log("grab info from pages")
pageNum = 1
let f = getItems(src, pageNum)

// grab the content of page 1 into array
await f.then(function(pageinfo){ 
  dataPageArray.push(pageinfo.items);
})



// get the actually content of page 1
dataPageArray = dataPageArray[0]
console.log(dataPageArray)



// function getAllPageContents(dataPageArray){
//   for (var i=0;i< dataPageArray.length; i++){

//   }

// }
let contentHighlight = {}
let judgeText = "Judge"
let appellant = 'Appellant'

for (var i=0;i< dataPageArray.length; i++) {

  let text = dataPageArray[i]['str'].trim()
  // console.log(text)


  let matchText
  let transform
  let transformedWidth
  let transformedHeight
  let transformedLeft
  let transformedTop
  let x1, x2, y1, y2

  if (text.toLowerCase().includes(judgeText.toLowerCase())) {
    console.log(judgeText, i)
    if (text.length == judgeText.length) {
      // match prev or next element of array, need to change it later
      console.log("Only match Judge, need show the name after or before")

     
      transform = dataPageArray[i]['transform']
      transformedLeft = transform[4]
      transformedTop = transform[5]

      transformedWidth = dataPageArray[i]['width']
      transformedHeight = dataPageArray[i]['height']


      // try to match the content after Judge on the same height. write a function for utilisation in later stage
      let initHeight
      let curMHeight
      let subMtext = ''
      let matchcount = true
      var j = i + 1
      while (j < dataPageArray.length && matchcount) {
        // empty string
        if (dataPageArray[j]['str'].trim().length === 0 ){
          console.log("empty string", j)
        } else { // non empty string found

          if (!initHeight) {
            initHeight = dataPageArray[j]['transform'][5]
            console.log("inti",j)
          }
          curMHeight = dataPageArray[j]['transform'][5]
          console.log(j, curMHeight)

          if(initHeight == curMHeight) {
            subMtext = subMtext + ' ' + dataPageArray[j]['str'].trim()
            matchcount = true
          } else{
            matchcount = false
          }
          
        }
        j ++
      }
      
      matchText = subMtext.trim()

      console.log(matchText)
      


      console.log(transform)
      console.log(transformedLeft)
      console.log(transformedTop)
      console.log(transformedWidth)
      console.log(transformedHeight)

      x1 = transformedLeft/tranformScale
      y1 = (viewportHeight - transformedTop - transformedHeight)/tranformScale
      x2 = x1 + transformedWidth/tranformScale
      y2 = y1 + transformedHeight/tranformScale

      console.log(x1, y1, x2, y2)
      // judgeText.charAt(0).toUpperCase() + judgeText.slice(1)
      contentHighlight[judgeText] = 
      {"contentText":matchText, "conmentText": judgeText,
                "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
                "height":viewportHeight/tranformScale,
                "width":viewportWidth/tranformScale,
              "pageNumber":pageNum,
            "id": Date.now().toString()}

    

    } else {
      console.log("remove judge")
      matchText = text.replace(judgeText, '')
      matchText = matchText.replace(judgeText.toLowerCase(), '').trim()
      console.log(matchText)

      //get hight location
      transform = dataPageArray[i]['transform']
      transformedLeft = transform[4]
      transformedTop = transform[5]

      transformedWidth = dataPageArray[i]['width']
      transformedHeight = dataPageArray[i]['height']
      console.log(transform)
      console.log(transformedLeft)
      console.log(transformedTop)


      console.log(transformedWidth)
      console.log(transformedHeight)

      x1 = transformedLeft/tranformScale
      y1 = (viewportHeight - transformedTop - transformedHeight)/tranformScale
      x2 = x1 + transformedWidth/tranformScale
      y2 = y1 + transformedHeight/tranformScale

      console.log(x1, y1, x2, y2)
      // judgeText.charAt(0).toUpperCase() + judgeText.slice(1)
      contentHighlight[judgeText] = 
      {"contentText":matchText, "conmentText": judgeText,
                "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
                "height":viewportHeight/tranformScale,
                "width":viewportWidth/tranformScale,
              "pageNumber":pageNum,
            "id": Date.now().toString()}
    }

  // match appellant process
  } else if (text.toLowerCase().includes(appellant.toLowerCase()))  {
    console.log(appellant, i)
    if (text.length == appellant.length) {
      console.log("Only match appellant, need show the name after or before")

      transform = dataPageArray[i]['transform']
      transformedLeft = transform[4]
      transformedTop = transform[5]

      transformedWidth = dataPageArray[i]['width']
      transformedHeight = dataPageArray[i]['height']
      console.log(transform)
      console.log(transformedLeft)
      console.log(transformedTop)
      console.log(transformedWidth)
      console.log(transformedHeight)

      // try to match the content after Appellant on the same height. write a function for utilisation in later stage
      let initHeight
      let curMHeight
      let subMtext = ''
      let matchcount = true
      let c = ''
      let curWidth, preWidth

      var j = i - 1
      while (j >= 0 && matchcount) {
        // empty string
        if (dataPageArray[j]['str'].trim().length === 0 ){
          console.log("empty string", j)
        } else { // non empty string found

          if (!initHeight) {
            initHeight = dataPageArray[j]['transform'][5]
            console.log("inti",j)
          }
          curMHeight = dataPageArray[j]['transform'][5]
          console.log(j, curMHeight)

          if(initHeight == curMHeight) {
            // write condition for c is space or not
            curWidth = dataPageArray[j]['transform'][4]
            if (preWidth - curWidth < 2){
              c = ' '
            } else {
              c = ''
            }

            subMtext = dataPageArray[j]['str'].trim() + c + subMtext
            matchcount = true
          } else{
            matchcount = false
          }

          preWidth = dataPageArray[j]['transform'][4] + dataPageArray[j]['width']
          
        }
        j --
      }

      matchText = subMtext.trim()

      console.log(matchText)





      x1 = transformedLeft/tranformScale
      y1 = (viewportHeight - transformedTop - transformedHeight)/tranformScale
      x2 = x1 + transformedWidth/tranformScale
      y2 = y1 + transformedHeight/tranformScale

      console.log(x1, y1, x2, y2)
      // judgeText.charAt(0).toUpperCase() + judgeText.slice(1)
      contentHighlight[appellant] = 
      {"contentText":matchText, "conmentText": appellant,
                "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
                "height":viewportHeight/tranformScale,
                "width":viewportWidth/tranformScale,
              "pageNumber":pageNum,
            "id": Date.now().toString()}


    } else {
      transform = dataPageArray[i]['transform']
      transformedLeft = transform[4]
      transformedTop = transform[5]

      transformedWidth = dataPageArray[i]['width']
      transformedHeight = dataPageArray[i]['height']
      console.log(transform)
      console.log(transformedLeft)
      console.log(transformedTop)


      console.log(transformedWidth)
      console.log(transformedHeight)

      x1 = transformedLeft/tranformScale
      y1 = (viewportHeight - transformedTop - transformedHeight)/tranformScale
      x2 = x1 + transformedWidth/tranformScale
      y2 = y1 + transformedHeight/tranformScale

      console.log(x1, y1, x2, y2)
 
      console.log("fewfhewoifhew")

      contentHighlight[appellant] = 
      {"contentText":matchText, "conmentText": appellant,
                "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
                "height":viewportHeight/tranformScale,
                "width":viewportWidth/tranformScale,
              "pageNumber":pageNum,
            "id": Date.now().toString()}

    }

  }

}








console.log(contentHighlight)

export let PRIMARY_URL

PRIMARY_URL = src


export let testHighlights = {}

testHighlights[PRIMARY_URL] = [
  {
    content: {
      text: contentHighlight[judgeText]["contentText"],
    },
    position: {
      boundingRect: {
        x1: contentHighlight[judgeText]["x1"],
        x2: contentHighlight[judgeText]["x2"],
        y1: contentHighlight[judgeText]["y1"],
        y2: contentHighlight[judgeText]["y2"],
        height: contentHighlight[judgeText]["height"],
        width: contentHighlight[judgeText]["width"],
      },
      rects: [
        {
          x1: contentHighlight[judgeText]["x1"],
          x2: contentHighlight[judgeText]["x2"],
          y1: contentHighlight[judgeText]["y1"],
          y2: contentHighlight[judgeText]["y2"],
          height: contentHighlight[judgeText]["height"],
          width: contentHighlight[judgeText]["width"],
        },
      ],
      pageNumber: contentHighlight[judgeText]["pageNumber"],
    },
    comment: {
      emoji: "",
      text: contentHighlight[judgeText]["conmentText"],
    },
    id: contentHighlight[judgeText]["id"],
  },


  
  
]



// export const testHighlights = {
//   PRIMARY_URL: [
//         {
//           content: {
//             text: contentHighlight[judgeText]["contentText"],
//           },
//           position: {
//             boundingRect: {
//               x1: contentHighlight[judgeText]["x1"],
//               x2: contentHighlight[judgeText]["x2"],
//               y1: contentHighlight[judgeText]["y1"],
//               y2: contentHighlight[judgeText]["y2"],
//               height: contentHighlight[judgeText]["height"],
//               width: contentHighlight[judgeText]["width"],
//             },
//             rects: [
//               {
//                 x1: contentHighlight[judgeText]["x1"],
//                 x2: contentHighlight[judgeText]["x2"],
//                 y1: contentHighlight[judgeText]["y1"],
//                 y2: contentHighlight[judgeText]["y2"],
//                 height: contentHighlight[judgeText]["height"],
//                 width: contentHighlight[judgeText]["width"],
//               },
//             ],
//             pageNumber: contentHighlight[judgeText]["pageNumber"],
//           },
//           comment: {
//             emoji: "",
//             text: contentHighlight[judgeText]["conmentText"],
//           },
//           id: contentHighlight[judgeText]["id"],
//         },
//     ],
// }

