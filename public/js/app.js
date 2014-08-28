//Gets the offset of an element relative to the top left corner of the screen
Element.prototype.screenOffset = function () {
  var x = this.offsetLeft - window.pageXOffset;
  var y = this.offsetTop - window.pageYOffset;

  var element = this.offsetParent;

  while (element !== null) {
    x = parseInt (x) + parseInt (element.offsetLeft);
    y = parseInt (y) + parseInt (element.offsetTop);

    element = element.offsetParent;
  }

  return {x:x, y:y};
};

function drawLine(startX, startY, endX, endY) {
  var ctx = document.getElementById('whiteboard').getContext('2d');

  //starts the mouse in the last position
  ctx.beginPath();
  ctx.moveTo(startX,startY);

  //draws the end of the line at the updated mouse position
  ctx.lineTo(endX,endY);
  ctx.stroke();
}

//initializes the whiteboard when the window loads
window.onload = function() {

  //initializes some useful variables
  var whiteboard = document.getElementById('whiteboard');
  var body = document.getElementsByTagName('body')[0];
  var dragging = 0;
  var posX=0, posY=0;
  var socket = io.connect("http://kindleboard.student.rit.edu/");
  
  socket.on('connected', function() {
    socket.on('draw', function(data) {
      console.log(data);
      drawLine(data.startX, data.startY, data.endX, data.endY);
    });
  });

  //toggles whether or not you are dragging the mouse
  whiteboard.onmousedown = function(e) {
    dragging = 1;

    //gets an updated position of the mouse
    posX = e.clientX || e.pageX;
    posY = e.clientY || e.pageY;
    var whiteboardOffset = whiteboard.screenOffset();
    posX -= whiteboardOffset.x;
    posY -= whiteboardOffset.y;

    var ctx = whiteboard.getContext('2d');
    ctx.rect(posX,posY,1,1);
    ctx.fill();

  };
  body.onmouseup = function() {
    dragging = 0;
  };

  //updates the canvas whenever the mouse moves
  whiteboard.onmousemove = function(e) {

    //will not draw unless the mouse is down
    if(!dragging)
      return;
   
    var startX = posX;
    var startY = posY;
 
    //gets the current position of the mouse relative to the canvas
    posX = e.clientX || e.pageX;
    posY = e.clientY || e.pageY;
    var whiteboardOffset = whiteboard.screenOffset();
    posX -= whiteboardOffset.x;
    posY -= whiteboardOffset.y;
    
    drawLine(startX, startY, posX, posY);
    
    socket.emit('draw', {
      startX:startX,
      startY:startY,
      endX:posX,
      endY:posY 
    });
  };
}
