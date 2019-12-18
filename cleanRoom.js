const fs = require('fs');
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

   if(!inputFile) throw new Error('input.txt was found, but there appears to be nothing in it.')
   
   return inputFile
}

function validateInstructions(variableFile){
    //split instructions into array & removes any unintentional whitespace 
    let variableArray = variableFile.split('\n').map(str => str.replace('\r', '').trim())
    let condensedInput = variableArray.filter(line => line.length !== 0)

    //checks for directions, if null throw error
    if(condensedInput[condensedInput.length-1].match(/([^nwse])/gi)){
        throw new Error('Directions input can only contain \'N,W,S,E\'' +'\n' + condensedInput[condensedInput.length-1])

    }
    else{
        //checks for a whitespace and X and Y coordinates
        condensedInput.slice(0, condensedInput.length-1).map((line, el) =>{
                if(!line.includes(' ')){
                    throw new Error(`Line:${el+1} doesn't have a whitespace. An X and Y value is needed \n ${line}`)
                }
        })
    }
    return  inputVariables = condensedInput;  
}

function generateRoom(variableList){

    let roomDims = createRoomDimensions(variableList[0])
    let tileCoords = variableList.slice(1, variableList.length-1)
    let roombaDirections = variableList[variableList.length-1]
    let roombaPosition;

    //final check of tiles, if fine
    testTileLocation(roomDims,tileCoords)
    //fill in tileCoords
    roombaPosition = addRoombaPosition(tileCoords[0],roomDims)

    addDirtTiles(tileCoords.slice(1, tileCoords.length),roomDims)
    //cycle through directions
    return mapOverRoombaMovements(roombaDirections,roombaPosition, roomDims)  
}

function createRoomDimensions(roomCoords){

    roomSize = {upperBoundX: null, upperBoundY: null}
    
    //find x and y upperbound coordinates
    roomSize.upperBoundX = parseInt(roomCoords.split(' ')[0])
    roomSize.upperBoundY = parseInt(roomCoords.split(' ')[1])

    //generate flat array size, then maps over and adds new arrays with size of Y
    roomGrid = Array.from(Array(roomSize.upperBoundY), () => new Array(roomSize.upperBoundX).fill('tile'));

    return roomSize
}

function testTileLocation(roomPos, tiles){
    //iterate through tiles and their positions, checking they match rulesets
    
    for(let i = 0; i < tiles.length; i++){
       let tileObj = {posX: parseInt(tiles[i].split(' ')[0]), posY: parseInt(tiles[i].split(' ')[1])}
       
       if(tileObj.posX >= roomPos.upperBoundX){
            throw new Error(`Line: ${i+2}, X coordinate is out of bounds. \nTile X:${tileObj.posX} \nRoom X:${roomPos.upperBoundX}`)

       }else if(tileObj.posY >= roomPos.upperBoundY){
            throw new Error(`Line: ${i+2}, Y coordinate is out of bounds. \nTile Y:${tileObj.posY} \nRoom Y:${roomPos.upperBoundY}`)
       }

       if(tileObj.posX < 0){
            throw new Error(`Line: ${i+2}, X coordinate is below 0. \nTile X:${tileObj.posX}`)

       }else if(tileObj.posY < 0){
            throw new Error(`Line: ${i+2}, Y coordinate is below 0. \nTile Y:${tileObj.posY}`)
       }
       
    }
}

function addRoombaPosition(roomba, roomDimObj){
    let roombaCoords = {posX: null, posY: null}

    roombaCoords.posX = parseInt(roomba.split(' ')[0])
    //Work in the opposite direction, with North moving "up" the Y axis of the roomGrid
    roombaCoords.posY = (roomDimObj.upperBoundY-1) - parseInt(roomba.split(' ')[1])

    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'

    return roombaCoords
}

function addDirtTiles(dirtyTiles,roomDimObj){

    if(dirtyTiles.length === 0){
        console.log("Why would you do this? The roomba has a singular purpose, and yet you've decided to play God and laugh as he drives around aimlessly with false hope that it may complete it's task of hoovering up dirt.")
    }else{

        for(let i = 0; i< dirtyTiles.length; i ++){
            let dirtPosX = parseInt(dirtyTiles[i].split(' ')[0])
            let dirtPosY = (roomDimObj.upperBoundY-1) - parseInt(dirtyTiles[i].split(' ')[1])
    
            roomGrid[dirtPosY][dirtPosX] = 'DIRT'
        }
    }

}

function mapOverRoombaMovements(roombaPath, roombaCoords, roomSize){
    //map over directions, accumulate cleaned tiles
    // console.log(roombaCoords, roomSize)
    // console.log(roomGrid)
   roombaPath.split('').map(dir => {
       
        switch(dir){
            case 'S':
                if(roombaCoords.posY !== roomSize.upperBoundY){
                    roombaCoords.posY += 1
                    
                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY-1][roombaCoords.posX] = 'CLEAN'
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'

                    // console.log('S',roombaCoords,'\n', roomGrid)
                }
                break;
            case 'E':
                if(roombaCoords.posX !== roomSize.upperBoundX){
                    roombaCoords.posX += 1

                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY][roombaCoords.posX-1] = 'CLEAN'

                    // console.log('E',roombaCoords, '\n',roomGrid)
                }
                break;
            case 'N':
                if(roombaCoords.posY !== 0){
                    roombaCoords.posY -= 1

                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY+1][roombaCoords.posX] = 'CLEAN'

                    // console.log('N',roombaCoords,'\n', roomGrid)
                }
                break;
            case 'W':
                if(roombaCoords.posX !== 0){
                    roombaCoords.posX -= 1

                    if(roomGrid[roombaCoords.posY][roombaCoords.posX] === 'DIRT'){
                        cleanedTiles++
                    }
                    
                    roomGrid[roombaCoords.posY][roombaCoords.posX] = 'ROOMBA'
                    roomGrid[roombaCoords.posY][roombaCoords.posX+1] = 'CLEAN'

                    // console.log('W',roombaCoords, '\n',roomGrid)
                }
                break;
            }
   })
    
   //console.log(roomGrid)

   //save roomba Y coordinate with cardinal position, and not array Y position
   roombaCoords.posY = (roomSize.upperBoundY-1) - roombaCoords.posY

   return roombaFinalPos = roombaCoords
}

function outputRoombaResults(freshlyCleaned, coords){
    console.log(`${coords.posX} ${coords.posY}`)
    console.log(freshlyCleaned)
}


inputVariables = getRoombaInstructions()
validateInstructions(inputVariables)
generateRoom(inputVariables)
outputRoombaResults(cleanedTiles, roombaFinalPos)
process.exit(0)
