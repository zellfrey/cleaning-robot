const fs = require('fs');
const path = require('path');
const ROOMBA_INPUT_FILE = 'input.txt'

let roomGrid;
let inputVariables = null
let cleanedTiles = 0
let roombaFinalPos = null

function getRoombaInstructions(){
   let inputFile = fs.readFileSync(ROOMBA_INPUT_FILE,'utf8',(err, data) =>{
        if (err) throw err;

        return data 
   })
   
   return inputFile
}
function processInstructions(variableFile){
    //split instructions into array, removes any unintentional text addition
    let variableArray = variableFile.split('\n').map(str => str.replace('\r', ''))

    let dirtCoordsArray = variableArray.slice(2, variableArray.length-1)
    
    //fill room Grid using 1st line of input.txt
    let maxRoomSize = createRoomDimensions(variableArray[0])
    //add roomba position using 2nd line of input.txt
    let roombaPosition = addRoombaPosition(variableArray[1])
    //exclusively use 3rd line upto last line of input.txt and generate dirt tiles
    addDirtTiles(dirtCoordsArray)
    // console.log(roomGrid)
    //cycle through directions
    return mapOverRoombaMovements(variableArray[variableArray.length-1],roombaPosition, maxRoomSize)
}

function createRoomDimensions(coordBoundaries){
     //find x and y upperbound coordinates
     roomSize = {upperBoundX: null, upperBoundY: null}

    roomSize.upperBoundX = parseInt(coordBoundaries.split(' ')[0])
    roomSize.upperBoundY = parseInt(coordBoundaries.split(' ')[1])
    //generate flat array size, then maps over and adds new arrays with size of Y
    roomGrid = Array.from(Array(roomSize.upperBoundX), () => new Array(roomSize.upperBoundY).fill('tile'));

    return roomSize
}

function addRoombaPosition(roomba){
    let roombaCoords = {posX: null, posY: null}
    roombaCoords.posX = parseInt(roomba.split(' ')[0])
    roombaCoords.posY = parseInt(roomba.split(' ')[1])

    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'

    return roombaCoords
}

function addDirtTiles(dirtyTiles){

    for(let i = 0; i< dirtyTiles.length; i ++){
        let dirtPosX = parseInt(dirtyTiles[i].split(' ')[0])
        let dirtPosY = parseInt(dirtyTiles[i].split(' ')[1])

        roomGrid[dirtPosY][dirtPosX] = 'DIRT'
    }
}

function mapOverRoombaMovements(roombaPath, roombaCoords, roomSize){
    //map over directions, accumulate cleaned tiles
    // console.log(roombaCoords, roomSize)
   roombaPath.split('').map(dir => 
    {
        switch(dir){
            case 'N':
                if(roombaCoords.posY !== roomSize.upperBoundY){
                    roombaCoords.posY += 1
                    
                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY-1][roombaCoords.posX] = 'CLEAN'
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'

                    // console.log('N',roombaCoords,'\n', roomGrid)
                }

                break;
            case 'W':
                if(roombaCoords.posX !== roomSize.upperBoundX){
                    roombaCoords.posX -= 1

                    
                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY][roombaCoords.posX+1] = 'CLEAN'

                    // console.log('W',roombaCoords, '\n',roomGrid)
                }
                break;
            case 'S':
                if(roombaCoords.posY !== 0){
                    roombaCoords.posY -= 1

                    
                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY+1][roombaCoords.posX] = 'CLEAN'

                    // console.log('S',roombaCoords,'\n', roomGrid)
                }
                break;
            case 'E':
                if(roombaCoords.posX !== 0){
                    roombaCoords.posX += 1

                    
                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY][roombaCoords.posX-1] = 'CLEAN'

                    // console.log('E',roombaCoords, '\n',roomGrid)
                }
                break;
            }

   })
   return roombaFinalPos = roombaCoords
   //save final coords and return information
}

function outputRoombaResults(freshlyCleaned, coords){
    console.log(`${coords.posX} ${coords.posY}`)
    console.log(freshlyCleaned)
}


inputVariables = getRoombaInstructions()
// process.stdout.write(inputVariables + '\n')
processInstructions(inputVariables)
outputRoombaResults(cleanedTiles, roombaFinalPos)
process.exit(0)
