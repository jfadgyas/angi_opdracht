// Variables
const result=document.querySelector('#result')
const currentPoint=document.querySelector('#currentPoint')
const raster = document.querySelector('#raster')
const path = document.querySelector('#path')
const trafficBoards = [
    'R2', 'L3', 'R2', 'R4', 'L2', 'L1', 'R2', 'R4', 'R1', 'L4', 'L5', 'R5', 'R5', 'R2', 'R2', 'R1', 'L2', 'L3', 'L2', 'L1', 'R3', 'L5', 'R187', 'R1', 'R4', 'L1', 'R5', 'L3', 'L4', 'R50', 'L4', 'R2', 'R70', 'L3', 'L2', 'R4', 'R3', 'R194', 'L3', 'L4', 'L4', 'L3', 'L4', 'R4', 'R5', 'L1', 'L5', 'L4', 'R1', 'L2', 'R4', 'L5', 'L3', 'R4', 'L5', 'L5', 'R5', 'R3', 'R5', 'L2', 'L4', 'R4', 'L1', 'R3', 'R1', 'L1', 'L2', 'R2', 'R2', 'L3', 'R3', 'R2', 'R5', 'R2', 'R5', 'L3', 'R2', 'L5', 'R1', 'R2', 'R2', 'L4', 'L5', 'L1', 'L4', 'R4', 'R3', 'R1', 'R2', 'L1', 'L2', 'R4', 'R5', 'L2', 'R3', 'L4', 'L5', 'L5', 'L4', 'R4', 'L2', 'R1', 'R1', 'L2', 'L3', 'L2', 'R2', 'L4', 'R3', 'R2', 'L1', 'L3', 'L2', 'L4', 'L4', 'R2', 'L3', 'L3', 'R2', 'L4', 'L3', 'R4', 'R3', 'L2', 'L1', 'L4', 'R4', 'R2', 'L4', 'L4', 'L5', 'L1', 'R2', 'L5', 'L2', 'L3', 'R2', 'L2' 
]
let direction = 0 // Current heading, not which direction to turn
let points = [{
    x: 1860, // Start point x;y coordinates
    y: 500,
}]
let move = []

// Functions
// Math section
/* Using a sin-cos function to get which direction to turn. The variable 'direction' is to get the PI right.
    Need to round because for some reason it doesn't give 0 back.
    Cos function must be inverted (-cos), becasue of the screen coordinate system (y axis increase)
    Movement is how many blocks we need to move, *10 is the block size
    Put the new coordinates to an array, because it's easier to work with
*/

trafficBoards.map((item, index) =>{    
    // Separate heading (L, R) and movement
    move.push({
        direction: item.slice(0, 1),
        movement: item.slice(1)
    })
    move[index].direction === 'R' ? direction += 0.5 : direction -= 0.5 // Change heading
    // Calculate the next point
    const newPoint = {
        x: points[points.length-1].x + Math.round(Math.sin(Math.PI * direction)) * move[index].movement * 10,
        y: points[points.length-1].y + Math.round(-Math.cos(Math.PI * direction)) * move[index].movement * 10
    }
    points.push(newPoint)
})

// Calculate distance (/10 is the block size)
const xDistance = (points[points.length-1].x - points[0].x) / 10
const yDistance = (points[points.length-1].y - points[0].y) / 10
let resultText = 'Je bent'

// If you change the path, you still get correct results
switch(true){
    case xDistance > 0:
        resultText += ` ${Math.abs(xDistance)} blokken oost`
        break
    case xDistance < 0:
        resultText += ` ${Math.abs(xDistance)} blokken west`
        break
    default:
        console.log('0')
}
switch(true){
    case yDistance > 0:
        resultText += `, ${Math.abs(yDistance)} blokken zuid`
        break
    case yDistance < 0:
        resultText += `, ${Math.abs(yDistance)} blokken noord`
        break
    default:
        console.log('0')
}
resultText += `, totaal ${Math.abs(xDistance) + Math.abs(yDistance)} blokken ver.`
result.innerHTML = resultText

// Graphics section
// Creating the raster
const drawRaster = () => {
    let d = ''
    for (let i=0; i<2000; i+=10){
        d += `M ${i} 0 L ${i} 2000 M 0 ${i} L 2000 ${i}`
    }
    raster.setAttribute('d', d)
}

// Get the next point's visuals
const getPoint = index => {
    // Turn the traffic sign
    move[index].direction === 'R' ? direction += 0.5 : direction -= 0.5
    document.documentElement.style.setProperty('--direction', `${direction / 2}turn`)
    currentPoint.innerHTML = trafficBoards[index]    
    // Draw path
    path.setAttribute('d', `${path.getAttribute('d')} L ${points[index+1].x} ${points[index+1].y}`)
}

// Show the path step by step
const showPath = () => {
    document.removeEventListener('click', showPath)
    // Reset direction
    direction = 0
    move.map((item, index) => 
    setTimeout(() => getPoint(index), index*1000)
    )
}

drawRaster()

document.addEventListener('click', showPath)