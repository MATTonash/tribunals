// libraries imported
import taskList from '/static/data/taskData.json'
import expList from '/static/data/experiment.json'
import { v4 as uuid } from 'uuid';

// import the json generated by dataPreproces.tsx
import expTaskArray from '/static/data/expTaskArray.json'
import transformArrayAll from '/static/data/transformArrayAll.json'





function generateHighlightComp(matchWords:any, searchLine:any, pageNum:number, position:number, conmentText:string) {
  let x1, x2, y1, y2: any
  x1 = (searchLine['transformedLeft'] + position * searchLine['single_c_wid'] )/ tranformScale
  x2 = x1 + ((matchWords.length + 1) * searchLine['single_c_wid']) / tranformScale
  y1 = (viewportHeight - searchLine["transformedTop"] - searchLine["transformedHeight"]) / tranformScale
  y2 = y1 + searchLine["transformedHeight"] / tranformScale

  return {
    "contentText": matchWords.trim(), "conmentText": conmentText,
    "x1": x1, "y1": y1, "x2": x2, "y2": y2,
    "height": viewportHeight / tranformScale,
    "width": viewportWidth / tranformScale,
    "pageNumber": pageNum, "id": uuid()
  }
}



// search for the content and highlight information by using regex
// logic: foundposition [1, 2, 3] indicates before the found token, the found token, and after the found token
// if 2 found and 1 and 3 not found, activate searchNextLine or search PrevLine, 
// [] to search for section or specific word
function matchPatterns(sentenceArray: any[], searchLocation: any, regex: RegExp, pageNum: number) {

  let foundHLArray:any = []
  const foundPosition = searchLocation['foundPosition']
  const searchNextLine = searchLocation['searchNextLine']
  const searchPrevLine = searchLocation['searchPrevLine']
  // console.log(foundPosition)

  if (foundPosition.length == 0){
    // console.log("found position is empty")
    for (var i = 0; i < sentenceArray.length; i++) {
      const curSent = sentenceArray[i]['str']
      const match = curSent.match(regex)
     

      if(match){
        // console.log(match)
        let searchLine: any
  
        match.forEach((eachWord:any) => {
          
          let startposition = curSent.split(eachWord.trim())[0].length
          searchLine = sentenceArray[i]
          foundHLArray.push(generateHighlightComp(eachWord, searchLine, pageNum, startposition, eachWord))
          
        });
      }

    }
    
  

  } else {

    for (var i = 0; i < sentenceArray.length; i++) {
      const curSent = sentenceArray[i]['str']
      const match = curSent.match(regex)
  
      // console.log(match)
  
      if (match) {
        // console.log(i, match)
        let matchedWords:string
        let searchLine: any
  
        foundPosition.forEach((eachLoc:any) => {
          if (match[eachLoc]) {
            let startposition = curSent.split(match[eachLoc].trim())[0].length 
            matchedWords = match[eachLoc]
            searchLine = sentenceArray[i]
            foundHLArray.push(generateHighlightComp(matchedWords, searchLine, pageNum, startposition, match[2].trim()))
          }
        });
  
        if (curSent.trim().length == match[2].trim().length || 
          (curSent.trim().split(' ').length - match[2].trim().split(' ').length <= 1)){
  
          if (searchNextLine != 0) {
            for (var j = 1; j<=searchNextLine; j++){
              const nextSent = sentenceArray[i+j]['str']
              const nextSentLen = nextSent.trim().split(' ').length
              // console.log(nextSent)
              // console.log(i, i+j, nextSentLen, nextSent.split(' '))
              // console.log(curSent, match[2].trim())
  
              // not include matched words for the searching next line
              if (!nextSent.includes(match[2].trim())){
                if (nextSentLen <= 8 && nextSentLen > 1) {
                  if (nextSent.includes("&")){
                    const matchedWordsFW = nextSent.split("&")[0].trim()
                    const matchedWordsLW = nextSent.split("&")[1].trim()
                    let startpositionFW = 0
                    searchLine = sentenceArray[i+j]
                    foundHLArray.push(generateHighlightComp(matchedWordsFW, searchLine, pageNum, startpositionFW, match[2].trim()))
                
                    let startpositionLW = nextSent.split(matchedWordsLW)[0].length 
                    searchLine = sentenceArray[i+j]
                    foundHLArray.push(generateHighlightComp(matchedWordsLW, searchLine, pageNum, startpositionLW, match[2].trim()))
  
                  } else if (nextSentLen <= 4 ) {
                    
                    let startposition = 0
                    searchLine = sentenceArray[i+j]
                    foundHLArray.push(generateHighlightComp(nextSent, searchLine, pageNum, startposition, match[2].trim()))
                  }
                }
              }
            }
          }
  
          if (searchPrevLine != 0) {
            for (var k = 1; k<=searchPrevLine; k++){
              const prevSent = sentenceArray[i-k]['str']
              const prevSentLen = prevSent.trim().split(' ').length
              // console.log(prevSent)
              // console.log(i, i-k, prevSentLen, prevSent.split(' '))
              // console.log(curSent, match[2].trim())
  
  
              if (!prevSent.includes(match[2].trim())){
              
                if (prevSentLen <= 8 && prevSentLen > 1) {
             
                  if (prevSent.includes("&")){
                    const matchedWordsFW = prevSent.split("&")[0].trim()
                    const matchedWordsLW = prevSent.split("&")[1].trim()
                    let startpositionFW = 0
                    searchLine = sentenceArray[i-k]
                    foundHLArray.push(generateHighlightComp(matchedWordsFW, searchLine, pageNum, startpositionFW, match[2].trim()))
                
                    let startpositionLW = prevSent.split(matchedWordsLW)[0].length 
                    searchLine = sentenceArray[i-k]
                    foundHLArray.push(generateHighlightComp(matchedWordsLW, searchLine, pageNum, startpositionLW, match[2].trim()))
  
                  } else if (prevSentLen <= 4 ) {
                    // console.log("herereerere")
                    let startposition = 0
                    searchLine = sentenceArray[i-k]
                    foundHLArray.push(generateHighlightComp(prevSent, searchLine, pageNum, startposition, match[2].trim()))
                  }
                }
              }
  
  
            }
          }
  
        }
      }
  
    }
  }

  // console.log(foundHLArray)
  return foundHLArray
}



function generateMatchingArray(searchPattern: string, searchLocation: any,
  sentenceArray: any[], pageNum: number, matchType: string) {
  let regex: RegExp = new RegExp(searchPattern, matchType)
  // console.log(sentenceArray, searchLocation)
  return matchPatterns(sentenceArray, searchLocation, regex, pageNum)
}


function switchSearchFunction(searchName: string,
  sentenceArray: any[], pageNum: number, searchPattern:string, searchLocation:any, matchType:string) {

  let eachTask: any = {}

  if (searchName === "JUDGE") {
    eachTask[searchName] = generateMatchingArray(searchPattern, searchLocation, sentenceArray, pageNum, matchType)

  } else if (searchName === "APPEAL REFERENCE/NUMBER") {
    eachTask[searchName] = generateMatchingArray(searchPattern, searchLocation, sentenceArray, pageNum, matchType)

  } else if (searchName === "Tribunal Member") { 
    eachTask[searchName] = generateMatchingArray(searchPattern, searchLocation, sentenceArray, pageNum, matchType)

  } else if (searchName === "APPELLANT") {
    eachTask[searchName] = generateMatchingArray(searchPattern, searchLocation, sentenceArray, pageNum, matchType)

  } else if (searchName === "Section") {
    // console.log(sentenceArray)
    eachTask[searchName] = generateMatchingArray(searchPattern, searchLocation, sentenceArray, pageNum, matchType)

  }
  // console.log(eachTask)
  return eachTask
}

// generate the hightlight elements for react
function generateHighlightArray(array: any) {
  // console.log(array)
  let newArray = []
  // let tempArray:any
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
  return JSON.parse(JSON.stringify(newArray))
}


function generateTaskArray(taskIDs: any[], taskList: any, sentenceArray: any[], pageNum: number) {
  let taskDic: any = {}
  const tempArray: any = []

  Object.entries(taskIDs).forEach(([key, value]) => {
    let searchName: string = taskList[key]['search_function']['name']
    let searchPattern: string = taskList[key]['search_function']['regex']
    let searchLocation: string = taskList[key]['search_function']['location']
    let matchType: string = taskList[key]['search_function']['matchType']
    // console.log(searchName, searchPattern)
    taskDic[key] = switchSearchFunction(searchName, sentenceArray, pageNum, searchPattern, searchLocation, matchType)[searchName]
    // console.log(taskDic)
    tempArray.push({[key]: generateHighlightArray(taskDic[key])})
  })

  let tempDic:any = {}
  tempArray.forEach((element:any) => {
    Object.entries(element).forEach(([key, value])=>{
      tempDic[key] = value
    })
  });
  // console.log(tempDic)
  return tempDic
}


function generateFinalTaskArray(taskDicAll: any, taskDic:any){
  if (JSON.stringify(taskDicAll) === JSON.stringify({})){
    // console.log("fewfewhfhewkljfhewkljfhkewlhjfkjlewhfkjewh")
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
    // console.log(tempDic)
    return tempDic
  }
}


// transformation configuration
const tranformScale: number = 0.60008553 //transformed scale
const viewportWidth: number = 595.2
const viewportHeight: number = 842.2

let contentHighlight: any = []

//console.log(transformArrayAll)

// generate all highlighted terms with the transformed sentence information
transformArrayAll.forEach((elementArray: any, indexExp: any) => {
  let expComp = expTaskArray[indexExp]
  let taskDicAll:any  = {}

  elementArray.forEach((element: any, index: any) => {
    let pageNum = index + 1
    let taskDic= {}
    taskDic = generateTaskArray(expComp.taskIDs, taskList, element, pageNum)
    // console.log(taskDic)
    taskDicAll = generateFinalTaskArray(taskDicAll, taskDic)
  })
  contentHighlight.push(taskDicAll)
})


// generate the sequence headers for the highlighted terms
let contentHighlightFinal: any = []

contentHighlight.forEach((element:any)=>{
  let taskDicAllFinal:any = {}
  Object.entries(element).forEach(([key, value]:[string, any]) => {
    let tempArray:any = []
    value.forEach((element2:any , index2: number)=>{
      element2['comment']['text'] = taskList[key]['search_function']['name'] + ' ' + String(index2 + 1)
      tempArray.push(element2)
    })
    taskDicAllFinal[key] = tempArray
  })
  contentHighlightFinal.push(taskDicAllFinal)
})

//console.log(contentHighlightFinal)




// generate the user records and highlighted terms for the app
export const testHighlights: any = {}
export let userRecords: any = {}
// export let secRecords: any = {}
let secIdx: any = {}

contentHighlightFinal.forEach((element:any, index:any) => {
  let searchPattern = /[0-9]{1,4}|\([0-9A-z]+\)/
  let searchreg = new RegExp(searchPattern, "gi")

  let indexSet= new Set()
  Object.entries(element).forEach(([key, value]: [string, any]) => {
    // console.log(taskList[key])
    let match:any
    if (taskList[key]['search_function']['name'] == 'Section') {
      
      value.forEach((ele: any, index: any) => {
        match = ele["content"]["text"].match(searchreg)
        if (match){
          match.forEach((found: any) => {
            if (!indexSet.has(found)){
              indexSet.add(found)
              secIdx[found] = []
            } 

            if(indexSet.has(found)){
              secIdx[found].push(ele)
            }
          })
        }
      })

    }
  })
})


//console.log(secIdx)


contentHighlightFinal.forEach((element:any, index:any) => {

  testHighlights[expTaskArray[index]['expID']] = element

  let tempDic: any = {}
  let tempDic2: any = {}

  Object.entries(element).forEach(([key, value]: [string, any]) => {
    let temArray: any = []
    let secArray: any = []
    // not found any task
    if (value.length === 0){
      temArray.push({ userInput: "", timestamp: 0, typingtimestamp:0 , completed: false , hint: ""})
    } else { // found at least one hint
  
      if (taskList[key]['search_function']['name'] == 'Section') {
        Object.entries(secIdx).forEach(([key1, value1]: [string, any]) => {
          let i = 1
          //console.log(key1)
          value1.forEach((ele3: any, index3: any) => {
            // let tempEle = Object.assign({}, ele3)
            let newText = "Section " + String(key1) +'     ...' + String(i)
            temArray.push({ userInput: ele3["content"]["text"], timestamp: 0, typingtimestamp:0, completed: false, hint: ele3["content"]["text"] })
            secArray.push({
              content: {
                text: ele3["content"]["text"],
              },
              position: {
                boundingRect: {
                  x1: ele3['position']['boundingRect']["x1"],
                  x2: ele3['position']['boundingRect']["x2"],
                  y1: ele3['position']['boundingRect']["y1"],
                  y2: ele3['position']['boundingRect']["y2"],
                  height: ele3['position']['boundingRect']["height"],
                  width: ele3['position']['boundingRect']["width"],
                },
                rects: [
                  {
                    x1: ele3['position']['rects'][0]["x1"],
                    x2: ele3['position']['rects'][0]["x2"],
                    y1: ele3['position']['rects'][0]["y1"],
                    y2: ele3['position']['rects'][0]["y2"],
                    height: ele3['position']['rects'][0]["height"],
                    width: ele3['position']['rects'][0]["width"],
                  }
                ],
                pageNumber: ele3['position']["pageNumber"],
              },
              comment: {
                emoji: ele3["comment"]["emoji"],
                text: newText,
              },
              id: ele3["id"],
            })
            i = i + 1
           
          })
        
        })  
        testHighlights[expTaskArray[index]['expID']][key] = secArray
      } else {
        value.forEach((ele2: any, index2: any) => {
          // console.log(ele2)
          temArray.push({ userInput: ele2["content"]["text"], timestamp: 0, typingtimestamp:0, completed: false, hint: ele2["content"]["text"] })
          testHighlights[expTaskArray[index]['expID']][key][index2]['content']['text'] = ""
  
        })
      }
      
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


// console.log(testHighlights)
// console.log(userRecords)
