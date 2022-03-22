// libraries imported
// import Login from "./FileSel"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import taskList from '/static/data/taskData.json'
import pdfList from '/static/data/pdfList.json'
import expList from '/static/data/experiment.json'
import { TextContent, TextItem } from "pdfjs-dist/types/display/api";
import { v4 as uuid } from 'uuid';



// import { TaskShow } from "./TaskShow"


// pdf library loaded
const workerSrc = "https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js"

let viewportWidth: number
let viewportHeight: number





// generate the content by the page number
async function getItems(src: string, pg: number) {

  if (typeof workerSrc === "string") {
    GlobalWorkerOptions.workerSrc = workerSrc
  }
  const doc = await getDocument(src).promise
  const page = await doc.getPage(pg)
  // console.log(doc)

  const scale = 1;
  const viewport = page.getViewport({ scale });

  //divide 0.6 ratio!!! to get the actual page size
  viewportWidth = viewport.width
  viewportHeight = viewport.height
  // console.log(viewportWidth)
  // console.log(viewportHeight)

  return page.getTextContent()

}



// define the array for storing the content
let dataPageArray: any[] = []
// let dataPageArray=[]
const tranformScale: number = 0.60008553 //transformed scale
let pageNum: number


console.log(taskList)
console.log(pdfList)
console.log(expList)


// get the link for the legal document
// first case judge
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2912/Wolfe,%20David%20070921%20EA20190204.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2947/EA.2021.0126%20R.%20Miah%20s14%20Decision.pdf"

// second case for judge
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2940/Miller,Phil%20-%20EA-2019-0183%20(06.08.21).pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2857/Centre%20for%20Criminal%20Appeals%20EA2020-0181%20(040621)-%20JH%20Decision.pdf"
// var src = "https://informationrights.decisions.tribunals.gov.uk/DBFiles/Decision/i2817/Driver%20Ian%20(EA.2019.0254)%2008.04.21.pdf"





type ExperimentComp = {
  src: string;
  taskIDs: any[];
}

// const expIdx: string = "exp_0001"
const pdfIdx: string = 'pdfID'
const taskIDs: string = 'taskIDs'


// const taskStatus: any = {}
const expTaskArray: any[] = []


// {expID: exp_0001...}
for (const [key, value] of Object.entries(expList)) {


  let url = pdfList[expList[key][pdfIdx]]
  let taskStatus: any = {}
  for (const { "taskID": key1, "completed": status } of expList[key][taskIDs]) {
    taskStatus[key1] = status;
  }
  expTaskArray.push({
    expID: key,
    src: url,
    taskIDs: taskStatus,
  })

}

console.log(expTaskArray)





// reform the array for storing the contents and highlight information
function reformTextHighlightArray(dataPageArray: TextItem[]) {
  let transformArray = []
  var i: number = 0;
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
      if (nextHeight != iniHeight) {
        iniHeight = nextHeight
        matchcount++
      }

      if (matchcount < 1) {
        curSentOnRow = curSentOnRow + nextStrOfArray
        curSentWidth = curSentWidth + nextWidth
        j++
      }

    }

    if (curSentOnRow[0] != ' ') {
      // console.log(curSentOnRow)
      // console.log("i", i) 
      // console.log("j", j) 
      transformArray.push({
        "org_i": i, "org_j": j, 'str': curSentOnRow, 'transformedLeft': dataPageArray[i]['transform'][4],
        "transformedTop": dataPageArray[i]['transform'][5], "transformedWidth": curSentWidth,
        "transformedHeight": dataPageArray[i]['height'], "single_c_wid": curSentWidth / curSentOnRow.length,
        "sentLen": curSentOnRow.length
      })
      i = j
    } else {
      i++
    }
  }
  return transformArray
}





// search for the content and highlight information by using regex
function matchWord(transformArray: any[], b4OrAfter: string, regex: RegExp, pageNum: number) {
  // console.log("match word:")
  // console.log(transformArray, b4OrAfter, regex, pageNum)

  let matchWords
  let foundArray = []
  let x1, x2, y1, y2

  // console.log(regex)
  // console.log("pageNum", pageNum)

  // match the words after the specific words
  if (b4OrAfter == 'after') {
    // console.log("in after here")
    // console.log(regex)

    for (var i = 0; i < transformArray.length; i++) {

      let sent = transformArray[i]['str']
      const match = sent.match(regex)

      if (match) {

        // console.log(sent, sent.length)

        let startIdx = match['index']
        // console.log(startIdx)

        let numC = startIdx + match[1].length // numC is the starting index of the sentence for matching

        // console.log("Only match words after Judge", i)
        // console.log(match, numC)
        // console.log(transformArray[i]['transformedLeft'])
        if (match[2]) {
          matchWords = match[2]
          x1 = (transformArray[i]['transformedLeft'] + numC * transformArray[i]['single_c_wid']) / tranformScale
          x2 = x1 + ((matchWords.length + 1) * transformArray[i]['single_c_wid']) / tranformScale
          y1 = (viewportHeight - transformArray[i]["transformedTop"] - transformArray[i]["transformedHeight"]) / tranformScale
          y2 = y1 + transformArray[i]["transformedHeight"] / tranformScale

          foundArray.push({
            "contentText": match[2], "conmentText": match[1].trim(),
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "height": viewportHeight / tranformScale,
            "width": viewportWidth / tranformScale,
            "pageNumber": pageNum,
            "id": uuid()
          })

        } else {
          // console.log("need to fix the bug for judge, matching words might be in next line")
          // console.log(match)

          matchWords = transformArray[i + 1]['str']
          const matchWordsArr = matchWords.split(' ')

          if (matchWordsArr.length <= 9) {
            if(matchWords.includes("&")){
              const firstWords = matchWords.split("&")[0]
              const lastWords = matchWords.split("&")[1]
              match[2] = firstWords
              // console.log(matchWords)
              x1 = transformArray[i + 1]['transformedLeft'] / tranformScale
              x2 = (transformArray[i + 1]['transformedLeft'] + firstWords.length * transformArray[i + 1]['single_c_wid']) / tranformScale
              y1 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"]) / tranformScale
              y2 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"] +
                transformArray[i + 1]["transformedHeight"]) / tranformScale

              foundArray.push({
                "contentText": match[2], "conmentText": match[1].trim(),
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "height": viewportHeight / tranformScale,
                "width": viewportWidth / tranformScale,
                "pageNumber": pageNum,
                "id": uuid()
              })

              match[2] = lastWords
              // console.log(matchWords)
              x1 = (transformArray[i + 1]['transformedLeft'] + (firstWords.length + 2 )* transformArray[i + 1]['single_c_wid']) / tranformScale
              x2 = x1 + ((lastWords.length + 1) * transformArray[i + 1]['single_c_wid']) / tranformScale
              y1 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"]) / tranformScale
              y2 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"] +
                transformArray[i + 1]["transformedHeight"]) / tranformScale
              
              foundArray.push({
                "contentText": match[2], "conmentText": match[1].trim(),
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "height": viewportHeight / tranformScale,
                "width": viewportWidth / tranformScale,
                "pageNumber": pageNum,
                "id": uuid()
              })
            } else {
              match[2] = matchWords
              // console.log(matchWords)
              x1 = transformArray[i + 1]['transformedLeft'] / tranformScale
              x2 = (transformArray[i + 1]['transformedLeft'] + transformArray[i + 1]['str'].length * transformArray[i + 1]['single_c_wid']) / tranformScale
              y1 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"]) / tranformScale
              y2 = (viewportHeight - transformArray[i + 1]["transformedTop"] - transformArray[i + 1]["transformedHeight"] +
                transformArray[i + 1]["transformedHeight"]) / tranformScale
  
              foundArray.push({
                "contentText": match[2], "conmentText": match[1].trim(),
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "height": viewportHeight / tranformScale,
                "width": viewportWidth / tranformScale,
                "pageNumber": pageNum,
                "id": uuid()
              })

              const match2lineWords = transformArray[i + 2]['str']
              const match2lineWordsArr = match2lineWords.split(' ')

              if (match2lineWordsArr.length <= 4 && match2lineWordsArr.length != 0){
                x1 = transformArray[i + 2]['transformedLeft'] / tranformScale
                x2 = (transformArray[i + 2]['transformedLeft'] + transformArray[i + 2]['str'].length * transformArray[i + 2]['single_c_wid']) / tranformScale
                y1 = (viewportHeight - transformArray[i + 2]["transformedTop"] - transformArray[i + 2]["transformedHeight"]) / tranformScale
                y2 = (viewportHeight - transformArray[i + 2]["transformedTop"] - transformArray[i + 2]["transformedHeight"] +
                  transformArray[i + 2]["transformedHeight"]) / tranformScale
    
                foundArray.push({
                  "contentText": match2lineWords, "conmentText": match[1].trim(),
                  "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                  "height": viewportHeight / tranformScale,
                  "width": viewportWidth / tranformScale,
                  "pageNumber": pageNum,
                  "id": uuid()
                })
              }

            }

            
          } else {
            // console.log(matchWords)
          }

          

        }
        
      }
    }
  } else if (b4OrAfter == 'b4') { // match the words before the specific words
    console.log("in b4 here")
    console.log(regex)

    for (var i = 1; i < transformArray.length; i++) {
      let sent = transformArray[i]['str']
      const match = sent.match(regex)
      console.log(sent, match)

      if (match) {
        
        const matchWordsArr = match[0].split(' ')

       

        if (match[1]) {

          if (matchWordsArr.length <= 6){
            matchWords = match[1]

            console.log(matchWords)
            x1 = transformArray[i]['transformedLeft'] / tranformScale
            x2 = (transformArray[i]['transformedLeft'] + transformArray[i]['str'].length * transformArray[i]['single_c_wid']) / tranformScale
            y1 = (viewportHeight - transformArray[i]["transformedTop"] - transformArray[i]["transformedHeight"]) / tranformScale
            y2 = y1 + transformArray[i]["transformedHeight"] / tranformScale

            foundArray.push({
              "contentText": matchWords.trim(), "conmentText": match[2],
              "x1": x1, "y1": y1, "x2": x2, "y2": y2,
              "height": viewportHeight / tranformScale,
              "width": viewportWidth / tranformScale,
              "pageNumber": pageNum, "id": uuid()
            })

          }


        } else {
          matchWords = transformArray[i - 1]['str']
          x1 = transformArray[i - 1]['transformedLeft'] / tranformScale
          x2 = (transformArray[i - 1]['transformedLeft'] + transformArray[i - 1]['str'].length * transformArray[i - 1]['single_c_wid']) / tranformScale
          y1 = (viewportHeight - transformArray[i - 1]["transformedTop"] - transformArray[i - 1]["transformedHeight"]) / tranformScale
          y2 = (viewportHeight - transformArray[i - 1]["transformedTop"] - transformArray[i - 1]["transformedHeight"] +
            transformArray[i - 1]["transformedHeight"]) / tranformScale

          foundArray.push({
            "contentText": matchWords.trim(), "conmentText": match[2],
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "height": viewportHeight / tranformScale,
            "width": viewportWidth / tranformScale,
            "pageNumber": pageNum, "id": uuid()
          })
        }
       

      }

    }

  }

  return foundArray
}


// generate the hightlight elements for react
function generateHighlightArray(array: any[]) {
  let newArray = []
  for (var i = 0; i < array.length; i++) {
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



function generateMatchingArray(searchPattern: string, b4OrAfterLine: string,
  transformArray: any[], pageNum: number, matchType: string) {
  let regex: RegExp = new RegExp(searchPattern, matchType)
  // b4OrAfterLine = 'after'
  return matchWord(transformArray, b4OrAfterLine, regex, pageNum)
}




function switchSearchFunction(searchFunction: string,
  transformArray: any[], pageNum: number, searchPattern:string) {

  let eachTask: any = {}
  // let searchPattern: any
  let b4OrAfterLine: string
  let matchType: string
  // console.log(transformArray)

  // /((?:Judge)|(?:JUDGE)) ([A-Z][A-Za-z]+ [A-Z][A-Za-z]+)/m

  if (searchFunction === "JUDGE") {
    // searchPattern = "((?:Judge )|(?:JUDGE ))([A-Z][A-Za-z]+ [A-Z][A-Za-z]+)"
    b4OrAfterLine = 'after'
    matchType = 'm'
    eachTask[searchFunction] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)

  } else if (searchFunction === "APPEAL REFERENCE/NUMBER") {
    // searchPattern = "(Appeal Reference:|Appeal number:)(.*)"
    b4OrAfterLine = 'after'
    matchType = 'i'
    eachTask[searchFunction] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)

  } else if (searchFunction === "Tribunal Member") { // fix the bug here for multiple members
    // searchPattern = "(^Tribunal Members? )([A-Z][A-Za-z]+ [A-Z][A-Za-z]+)?"
    b4OrAfterLine = 'after'
    matchType = 'i'
    eachTask[searchFunction] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)
    // console.log(eachTask[searchToken])

  } else if (searchFunction === "APPELLANT") {
    // searchPattern = "(.*)?(Appellants?:?\\s{1,}$)"
    b4OrAfterLine = 'b4'
    matchType = 'i'
    eachTask[searchFunction] = generateMatchingArray(searchPattern, b4OrAfterLine, transformArray, pageNum, matchType)

  }
  return eachTask
}

function generateTaskArray(taskIDs: any[], taskList: any, transformArray: any[], pageNum: number) {
  let taskDic: any = {}
  // console.log(taskIDs, taskList)
  Object.entries(taskIDs).forEach(([key, value]) => {
    // console.log(taskList[key], value)
    let search_function: string = taskList[key]['search_function']
    let searchPattern: string = taskList[key]['searchPattern']
    // console.log(searchToken)
    taskDic[key] = switchSearchFunction(search_function, transformArray, pageNum, searchPattern)[search_function]
    // console.log(taskDic[key])
    taskDic[key] = generateHighlightArray(taskDic[key])

  })
  return taskDic
}

function generateFinalTaskArray(taskDicAll: any, taskDic:any){
  if (JSON.stringify(taskDicAll) === JSON.stringify({})){
    return taskDic
  } else {
    let tempDic:any = {}
 
    Object.entries(taskDicAll).forEach(([key, value]:[string, any]) => {
      let tempArr = taskDic[key]
      tempArr.forEach((element:any)=>{
        value.push(element)
      })
      
      tempDic[key] = value
    })
    return tempDic
  }
}




let arrPagesPro: any[] = []
let arrPages:any[] = []

expTaskArray.forEach(element => {
  // test the getItems function to generate the content of page 1
  console.log(element)

  if (typeof workerSrc === "string") {
    GlobalWorkerOptions.workerSrc = workerSrc
  }
  let docxs = getDocument(element.src).promise

  arrPagesPro.push(docxs)
  // Promise.resolve(docxs).then(function (value) {
  //   arrPages.push(value["_pdfInfo"]["numPages"])
  // });


})
console.log(arrPagesPro)

await Promise.all(arrPagesPro.map(function (entity: any) {
    return entity;})).then(function (data: any) {
      arrPages = data
});

console.log(arrPages)



var promises: any[] = []

expTaskArray.forEach((element, index) => {
  // test the getItems function to generate the content of page 1
  console.log(element)
  var eachPDFpromises: any[] = []
  let expComp: ExperimentComp = {
    src: element.src,
    taskIDs: element.taskIDs
  }

  console.log("grab info from pages")
  console.log(expComp)
  // pageNum = 1

  pageNum = 1
  let j: number = arrPages[index]["_pdfInfo"]["numPages"]
  while (pageNum <= j) {
    eachPDFpromises.push(getItems(expComp.src, pageNum))
    pageNum = pageNum + 1
  }
  promises.push(eachPDFpromises)
});



let dataPageArrayAll: any[] = []
await Promise.all(promises.map(function (entity: any) {
  return Promise.all(entity.map(function (item: any) {
    return item;
  }));
})).then(function (data) {
  dataPageArrayAll = data
});



console.log(promises)
console.log(dataPageArrayAll)

let contentHighlight: any[] = []

dataPageArrayAll.forEach((elementArray,indexExp) => {
  let expComp = expTaskArray[indexExp]
  console.log(expComp)
  let taskDicAll:any  = {}

  elementArray.forEach((element: any, index: any) => {

    let items = element["items"]
    let pageNum = index + 1

    let taskDic= {}
    let transformArray = []

    transformArray = reformTextHighlightArray(items)
    taskDic = generateTaskArray(expComp.taskIDs, taskList, transformArray, pageNum)
    taskDicAll = generateFinalTaskArray(taskDicAll, taskDic)

  })
  contentHighlight.push(taskDicAll)
  console.log(taskDicAll)

})


console.log(contentHighlight)

let contentHighlightFinal: any[] = []

contentHighlight.forEach((element)=>{

  let taskDicAllFinal:any = {}
  Object.entries(element).forEach(([key, value]:[string, any]) => {

    let tempArray:any = []

    value.forEach((element2:any , index2: number)=>{
      element2['comment']['text'] = taskList[key]['search_function'] + ' ' + String(index2 + 1)
      tempArray.push(element2)
    })
    taskDicAllFinal[key] = tempArray
  })
  contentHighlightFinal.push(taskDicAllFinal)
})

contentHighlight = contentHighlightFinal

console.log(contentHighlight)



export const testHighlights: any = {}
export let userRecords: any = {}

contentHighlight.forEach((element, index) => {
  // console.log(expTaskArray[index]['expID'])
  testHighlights[expTaskArray[index]['expID']] = element
  // console.log(testHighlights[expTaskArray[index]['expID']])


  let tempDic: any = {}
  let tempDic2: any = {}

  Object.entries(element).forEach(([key, value]: [string, any]) => {
    let temArray: any = []


    console.log(key, value)
    if (value.length === 0){
      temArray.push({ userInput: "", timestamp: 0, typingtimestamp:0 , completed: false , hint: ""})
    } else {
      value.forEach((ele2: any, index2: any) => {
        // console.log(ele2)
        temArray.push({ userInput: ele2["content"]["text"], timestamp: 0, typingtimestamp:0, completed: false, hint: ele2["content"]["text"] })
        testHighlights[expTaskArray[index]['expID']][key][index2]['content']['text'] = ""

      })
    }
    tempDic[key] = temArray
    tempDic2[key] = ""
    
  })
  tempDic["startTimestamp"] = 0
  tempDic["endTimestamp"] = 0
  tempDic["userName"] = expList[expTaskArray[index]['expID']]["name"]
  tempDic["expID"] = expTaskArray[index]['expID']
  tempDic["Comments"] = tempDic2
  userRecords[expTaskArray[index]['expID']] = tempDic
})


console.log(testHighlights)
console.log(userRecords)
