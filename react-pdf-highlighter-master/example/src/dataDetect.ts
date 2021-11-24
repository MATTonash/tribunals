import React, { Component } from "react";


import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

const workerSrc = "https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js"


let dataPageArray = []

async function getContent(src, pg){

  if (typeof workerSrc === "string") {
    GlobalWorkerOptions.workerSrc = workerSrc
  }
  const doc = await getDocument(src).promise
  const page = await doc.getPage(pg)
  return await page.getTextContent()
}

async function getItems(src, pg){
  const content = await getContent(src, pg)

  // const items = content.items.map((item) => {
  //   // console.log(item.str)
  //   // console.log(item.fontName)
  //   // console.log(item.transform)
  //   // console.log(item)
  // })
  
  return content
}

var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf"


console.log("grab info from pages")
let f = getItems(src, 1)

await f.then(function(pageinfo){ 
  dataPageArray.push(pageinfo.items);
})

dataPageArray = dataPageArray[0]
console.log(dataPageArray)



for (var i=0;i< dataPageArray.length; i++) {

  let text = dataPageArray[i]['str'].trim()
  // console.log(text)

  let judgeText = "judge"

  if (text.toLowerCase().includes(judgeText)) {
    console.log(i)
    if (text.length == judgeText.length) {
      // match prev or next element of array
      console.log(i)
    } else {
      text.split
      
    }
  }

}








// console.log("rawData", textItems)




export const data = {
    "testing a getpdffile": [
        {
          content: {
            text: "Stephen Cragg Q.C.",
          },
          position: {
            boundingRect: {
              x1: 140.9876708984375,
              x2: 242.801513671875,
              y1: 341.140625,
              y2: 354.140625,
              height: 818.839750050393,
              width: 579,
            },
            rects: [
              {
                x1: 140.9876708984375,
                x2: 242.801513671875,
                y1: 341.140625,
                y2: 354.140625,
                height: 818.839750050393,
                width: 579,
              },
            ],
            pageNumber: 1,
          },
          comment: {
            emoji: "🔵",
            text: "Judge",
          },
          id: "5639468706820432",
        },
    ],
}