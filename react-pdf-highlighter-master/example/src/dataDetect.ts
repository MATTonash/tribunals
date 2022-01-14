// libraries imported
import React, { Component } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import taskData from '/static/data/taskData.json'
import pdfList from '/static/data/pdfList.json'


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

  //divide 0.6 ratio!!! to get the actual page size
  viewportWidth = viewport.width
  viewportHeight = viewport.height
  console.log(viewportWidth)
  console.log(viewportHeight)

  return await page.getTextContent()

}

// define the array for storing the content
let dataPageArray = []
const tranformScale = 0.60008553 //transformed scale
let pageNum


console.log(taskData)
console.log(pdfList)


// get the link for the legal document
// first case judge
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2947/EA.2021.0126%20R.%20Miah%20s14%20Decision.pdf"

// second case for judge
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2940/Miller,Phil%20-%20EA-2019-0183%20(06.08.21).pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2857/Centre%20for%20Criminal%20Appeals%20EA2020-0181%20(040621)-%20JH%20Decision.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2817/Driver%20Ian%20(EA.2019.0254)%2008.04.21.pdf"
var src = "/static/1.pdf"


// test the getItems function to generate the content of page 1
console.log("grab info from pages")
pageNum = 1
let f = getItems(src, pageNum)

// grab the content of page 1 into array
await f.then(function(pageinfo){ 
  dataPageArray.push(pageinfo.items);
})






// algo should be like this: concatnate the strings in array based on the same height (in a row)
// then check if specific word in the concatnated strings,
// then find out the hightlight region




// reform the array for storing the contents and highlight information
function reformTextHighlightArray (dataPageArray) {
  let transformArray = []
  var i = 0;
  while (i < dataPageArray.length) {

    // let curStrOfArray = dataPageArray[i]['str']
    let curSentOnRow = dataPageArray[i]['str']
    let iniHeight = dataPageArray[i]['transform'][5]
    let matchcount = 0
    let curSentWidth = dataPageArray[i]['width'] 


    var j = i + 1

    while (j < dataPageArray.length && matchcount < 1) {
      let nextHeight = dataPageArray[j]['transform'][5]
      let nextStrOfArray = dataPageArray[j]['str']
      let nextWidth = dataPageArray[j]['width'] 
      
      // concatnate the string into a sentence based on the same height
      if (nextHeight != iniHeight){
        iniHeight = nextHeight
        matchcount ++
      }

      if (matchcount < 1) {
        curSentOnRow = curSentOnRow + nextStrOfArray
        curSentWidth = curSentWidth + nextWidth
        j ++
      }

    }

    if (curSentOnRow[0] != ' ') {
      // console.log(curSentOnRow)
      // console.log("i", i) 
      // console.log("j", j) 
      transformArray.push({"org_i":i,"org_j":j,'str':curSentOnRow,'transformedLeft':dataPageArray[i]['transform'][4], 
        "transformedTop":dataPageArray[i]['transform'][5],"transformedWidth": curSentWidth,
        "transformedHeight":dataPageArray[i]['height'], "single_c_wid":curSentWidth/curSentOnRow.length,
        "sentLen":curSentOnRow.length})
      i = j 
    } else {
      i++
    }
  }
  return transformArray
}





// search for the content and highlight information by using regex
function matchWord(transformArray, b4OrAfter, regex, pageNum){
  let matchWords
  let foundArray = []
  let x1, x2, y1, y2

  // match the words after the specific words
  if (b4OrAfter == 'after') {
    for (var i=0;i < transformArray.length; i++) {

      let sent = transformArray[i]['str']
      const match = sent.match(regex)

      if (match) {
        let startIdx = match['index']
        let numC = startIdx + match[1].length

        console.log("Only match words after Judge", i)
        console.log(match, numC)
        console.log(transformArray[i]['transformedLeft'])
        if (match[2]){
          matchWords = match[2]
          x1 = (transformArray[i]['transformedLeft'] + numC*transformArray[i]['single_c_wid'])/tranformScale
          x2 = x1 + ((matchWords.length + 1)* transformArray[i]['single_c_wid'])/tranformScale
          y1 = (viewportHeight - transformArray[i]["transformedTop"] - transformArray[i]["transformedHeight"])/tranformScale
          y2 = y1 + transformArray[i]["transformedHeight"]/tranformScale

              

        } else {
          console.log("need to fix the bug for judge, matching words might be in next line")


        }
        foundArray.push({"contentText":match[2], "conmentText": match[1].trim(),
                        "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
                        "height":viewportHeight/tranformScale,
                        "width":viewportWidth/tranformScale,
                      "pageNumber":pageNum,
                    "id": Date.now().toString()})
      }
    }
  } else if (b4OrAfter == 'b4'){ // match the words before the specific words
    for (var i=1;i < transformArray.length; i++) {
      let sent = transformArray[i]['str']
      const match = sent.match(regex)

      if (match){
        console.log(match)
        if (match[1]) {
          matchWords = match[1]

          console.log(matchWords)
          x1 = transformArray[i]['transformedLeft']/tranformScale
          x2 = (transformArray[i]['transformedLeft'] + transformArray[i]['str'].length * transformArray[i]['single_c_wid'])/tranformScale
          y1 = (viewportHeight - transformArray[i]["transformedTop"] - transformArray[i]["transformedHeight"])/tranformScale
          y2 = y1 + transformArray[i]["transformedHeight"]/tranformScale

        } else {
          matchWords = transformArray[i-1]['str']
          x1 = transformArray[i-1]['transformedLeft']/tranformScale
          x2 = (transformArray[i-1]['transformedLeft'] + transformArray[i-1]['str'].length * transformArray[i-1]['single_c_wid'])/tranformScale
          y1 = (viewportHeight - transformArray[i-1]["transformedTop"] - transformArray[i-1]["transformedHeight"])/tranformScale
          y2 = (viewportHeight - transformArray[i-1]["transformedTop"] - transformArray[i-1]["transformedHeight"] + 
            transformArray[i-1]["transformedHeight"])/tranformScale
        }
        foundArray.push({"contentText":matchWords.trim(), "conmentText": match[2],
          "x1":x1, "y1":y1, "x2":x2, "y2":y2, 
          "height":viewportHeight/tranformScale,
          "width":viewportWidth/tranformScale,
        "pageNumber":pageNum, "id": Date.now().toString()})
        
      }

    }

  }

  return foundArray
}


// generate the hightlight elements for react
function generateHighlightArray (array){
  let newArray = []
  for(var i=0;i<array.length;i++){
    newArray.push({
      content: {
        text: array[i]["contentText"],
      },
      position: {
        boundingRect: {
          x1: array[i]["x1"],
          x2: array[i]["x2"],
          y1: array[i]["y1"],
          y2: array[i]["y2"],
          height: array[i]["height"],
          width: array[i]["width"],
        },
        rects: [
          {
            x1: array[i]["x1"],
            x2: array[i]["x2"],
            y1: array[i]["y1"],
            y2: array[i]["y2"],
            height: array[i]["height"],
            width: array[i]["width"],
          },
        ],
        pageNumber: array[i]["pageNumber"],
      },
      comment: {
        emoji: "",
        text: array[i]["conmentText"],
      },
      id: array[i]["id"],
    })
  }
  return newArray
}

// show the specific contents by matching array
function selectTaskToShow(taskID, task, array){
  let contentHighlight = generateHighlightArray(array[taskID][task])
  return contentHighlight
}


function generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType) {
  let regex = new RegExp(searchPattern, matchType)
  b4OrAfterLine = 'after'
  return matchWord(transformArray, b4OrAfterLine, regex, pageNum)
}


function generateKeysForTask(taskArray){
  let taskIdxToName = {}
  for (var i=0;i<taskArray.length;i++){
    for (var j in taskArray[i]){
      var sub_key = j
    }
    taskIdxToName[i] = sub_key
  }
  return taskIdxToName
}


//code for the main script
// get the actually content of page 1
dataPageArray = dataPageArray[0] //array is the first element of the dictionary
console.log(dataPageArray)


let contentHighlight = []
let judgeText = "Judge"
let reference = 'Appeal Reference:|Appeal number:'
let tribunalMembers = 'Tribunal Members'
let appellant = 'Appellant'
let taskArray = []
let transformArray = []
let eachTask = {}


transformArray = reformTextHighlightArray (dataPageArray)
console.log(transformArray)

let searchPattern
let b4OrAfterLine
let matchType

// task for judge
searchPattern = "\(" + judgeText + " \)\(\\w+ \\w+\)"
b4OrAfterLine = 'after'
matchType = 'i'
eachTask[judgeText] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)
taskArray.push(eachTask)

eachTask = {}
searchPattern = "\(" + reference + "\)\(.*\)"
b4OrAfterLine = 'after'
matchType = 'i'
eachTask[reference] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)
taskArray.push(eachTask)

eachTask = {}
searchPattern = "\(.*\)\(" + appellant + "\) $"
b4OrAfterLine = 'b4'
matchType = 'i'
eachTask[appellant] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)
taskArray.push(eachTask)

eachTask = {}
searchPattern = "\(" + tribunalMembers + "? \)\(\\w+ \\w+\)"
b4OrAfterLine = 'after'
matchType = 'i'
eachTask[tribunalMembers] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)
taskArray.push(eachTask)




console.log(taskArray)
console.log(taskArray.length)



//task ID and taskName are matached
let taskIdxToName

taskIdxToName = generateKeysForTask(taskArray)

for (var i=0;i<taskArray.length;i++) {
  let tempDic = {}
  tempDic[taskIdxToName[i]] = selectTaskToShow(i, taskIdxToName[i], taskArray)
  contentHighlight.push(tempDic)
}
// contentHighlight = selectTaskToShow(taskID, taskIdxToName[3], taskArray)


console.log(contentHighlight)
console.log(contentHighlight[3])


// export generated data for all the tasks
export let PRIMARY_URL
export let testHighlights = {}
export let taskIDDic, totalTasks

PRIMARY_URL = src
// testHighlights[PRIMARY_URL] = contentHighlight[0][taskIdxToName[0]]
testHighlights[PRIMARY_URL] = contentHighlight
taskIDDic = taskIdxToName
totalTasks = contentHighlight
