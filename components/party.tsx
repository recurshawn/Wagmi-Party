import React, { useEffect, useRef, useState } from "react";

interface coords {
     x: number; y: number 
}
const Party = ({
  getCoords,
  peers,
}: {
  getCoords: ({ x, y }: { x: number; y: number }) => void;
  peers: {[key: string]: coords}
}) => {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 300, y: 200 });
  const [isDragging, setIsDragging] = useState(false);

  const draw = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#4287f5";
    ctx.fill();
    ctx.closePath();

    //Draw peers
    Object.values(peers).forEach(peer => {
        ctx.beginPath();
        ctx.arc(peer.x, peer.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#ab0000";
        ctx.fill();
        ctx.closePath();
    })
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(ctx);
  }, [position]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is inside circle
    const distance = Math.sqrt(
      Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2)
    );

    if (distance < 20) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    getCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <canvas
        className="mx-auto max-w-[1000px]"
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div>
        Coordinates: X: {Math.round(position.x)}, Y: {Math.round(position.y)}
      </div>
    </div>
  );
};

export default Party;

/*import React from "react";
import { type Sketch } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Image, Vector } from "p5";

const sketch: Sketch = (p5) => {
  const canvasWidth = 1000;
  const canvasHeight = canvasWidth / 1.58333;

  const spawnX = canvasWidth / 2;
  const spawnY = canvasHeight / 2;

  let P0: Vector, P1: Vector, PX: Vector;
  let startTime, endTime;

  const clientPlayer = {
    X: spawnX,
    Y: spawnY,
  };
  let room: Image;
  p5.setup = () => {
    room = p5.loadImage("https://static.wikia.nocookie.net/club-penguin-rewritten/images/a/a8/Town_Stadium.png/revision/latest?cb=20190831230502");
    p5.createCanvas(canvasWidth, canvasHeight, p5.WEBGL);

    P0 = p5.createVector(canvasWidth / 2, canvasHeight / 2);
    P1 = p5.createVector(canvasWidth / 2, canvasHeight / 2);
    PX = p5.createVector(canvasWidth / 2, canvasHeight / 2);
    startTime = 0;
    endTime = 0;
  };

  p5.mousePressed = (event) => {
    if(event) {
        clientPlayer.X = PX.x;
        clientPlayer.Y = PX.y;
      
    
        P0.set(PX.x, PX.y);
      
        startTime = millis();
      
        P1.set(event .mouseX, mouseY);
        let vec = p5.createVector()
        endTime = startTime +  vec.dist(P1, P0) * 5;
    }
 
  }

  p5.draw = () => {
    p5.background(100, 50, 50);
 
  };
};

const Party = () => {
  return <NextReactP5Wrapper sketch={sketch} />;
};

export default Party;
*/
