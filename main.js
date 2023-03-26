// Function returns a random int/float between min - max
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// nodes can only draw 1 line to another node
// Once the ttl time is up the fading function begins and spawns a new node
class Node {
    constructor(nodeIndex) {

        // This Node ID
        this.nodeID = nodeIndex;

        // This Node ID
        this.partnerNodeID = null;
        
        // Time To Live
        this.ttl = random(100, 150);

        this.connectedX = 0;
        this.connectedY = 0;

        this.XPos = random(0, window.innerWidth);
        this.YPos = random(0, window.innerHeight);

        // Set Speed/Velocity
        this.XVelocity = random(-2, 2);
        this.YVelocity = random(-2, 2);

        this.opacity = 0;

        // If is new node
        this.newNode = true;

        // Boolean to determine when this node is latched onto another node
        this.latched = false;

        // Boolean to determine when another node has connected to this
        this.attached = false;
    }
}

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let nodes = new Array(10);

for(let i = 0; i < nodes.length; i++)
    nodes[i] = new Node(i);

function animate() {

     // Set Canvas width & height
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;

    // clear canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Check if new node - fade in - change opacity from 0 to 1
    for(const element of nodes) {

        if(element.newNode) {

            let nearest = 1000000;

            // Find the nearest node
            if(!element.latched) {
                
                for(let i = 0; i < nodes.length; i++) {
                    
                    
                    

                    if(element.nodeID != i && !nodes[i].attached) {
                        let dist = Math.sqrt( Math.pow((element.XPos-nodes[i].XPos), 2) + Math.pow((element.YPos-nodes[i].YPos), 2));
                        
                        if(dist < nearest) {
                            nearest = dist;
                            element.partnerNodeID = i;

                            element.connectedX = nodes[i].XPos;
                            element.connectedY = nodes[i].YPos;

                            element.latched = true;
                            nodes[i].attached = true;
                            element.newNode = false;
                        }
                            
                    }
                }
            }
        }

        

        ctx.fillStyle = `rgba(255, 255, 255, ${element.opacity})`;
        ctx.fillRect(element.XPos - 5, element.YPos - 5, 10, 10);
        ctx.fill();

        if(element.latched) {
            if(nodes[element.partnerNodeID].attached) {
                ctx.beginPath();
                ctx.moveTo(element.XPos, element.YPos);
                ctx.lineTo(nodes[element.partnerNodeID].XPos, nodes[element.partnerNodeID].YPos);
    
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${element.opacity})`;
                ctx.stroke();
            }
        }

        element.XPos += element.XVelocity;
        element.YPos += element.YVelocity;

        if(element.XPos < 0 || element.XPos > window.innerWidth)
            element.XVelocity = element.XVelocity * -1;

        if(element.YPos < 0 || element.YPos > window.innerHeight)
            element.YVelocity = element.YVelocity * -1;

        if(!(element.latched && element.attached))
            element.ttl-=1;

        if(element.ttl <= 0) {

            if(element.opacity <= 0) {
                if(element.latched) {
                    nodes[element.partnerNodeID].attached = false;
                    nodes[element.partnerNodeID].newNode = true;
                }
    
                const id = parseInt(element.nodeID);
                nodes[id] = new Node(id);
            }
            
            element.opacity-=0.01;
        }

        else
            element.opacity+=0.01;
    }

    window.requestAnimationFrame(animate);
}

animate();