//Gets the offset of an element relative to the top left corner of the screen
Element.prototype.screenOffset = function () {
  var x = this.offsetLeft;
  var y = this.offsetTop;

  var element = this.offsetParent;

  while (element !== null) {
    x = parseInt (x) + parseInt (element.offsetLeft);
    y = parseInt (y) + parseInt (element.offsetTop);

    element = element.offsetParent;
  }

  return {x:x, y:y};
};

//initializes the whiteboard when the window loads
window.onload = function() {

  //initializes some useful variables
  var whiteboard = document.getElementById('whiteboard');
  var body = document.getElementsByTagName('body')[0];
  var dragging = 0;
  var posX=0, posY=0;

  //toggles whether or not you are dragging the mouse
  whiteboard.onmousedown = function(e) {
    dragging = 1;
    posX = e.clientX || e.pageX;
    posY = e.clientY || e.pageY;
    var whiteboardOffset = whiteboard.screenOffset();
    posX -= whiteboardOffset.x;
    posY -= whiteboardOffset.y;
  };
  body.onmouseup = function() {
    dragging = 0;
  };

  //updates the canvas whenever the mouse moves
  whiteboard.onmousemove = function(e) {

    //will not draw unless the mouse is down
    if(!dragging)
      return;
    
    //starts the mouse in the last position
    var ctx = whiteboard.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(posX,posY);
    
    //gets the current position of the mouse relative to the canvas
    posX = e.clientX || e.pageX;
    posY = e.clientY || e.pageY;
    var whiteboardOffset = whiteboard.screenOffset();
    posX -= whiteboardOffset.x;
    posY -= whiteboardOffset.y;

    //draws the end of the line at the updated mouse position
    ctx.lineTo(posX,posY);
    ctx.stroke();
  };
}
