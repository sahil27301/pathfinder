var addingWalls=false;
var removingWalls=false;
var solving=false;
var flag=false;
$('.solving').hide();

var startCoordinates='0-0';
var endCoordinates='21-49';
var columns=50;
var rows=22;
var startX=parseInt(startCoordinates.split('-')[0]);
var startY=parseInt(startCoordinates.split('-')[1]);
var destinationX=parseInt(endCoordinates.split('-')[0]);
var destinationY=parseInt(endCoordinates.split('-')[1]);
var currentX, currentY;
var speed=15;

$('.speed').change(function(){
  if (!solving) {
    speed=parseFloat($(this).val());
  }
});

$('.mazeData').mousedown(function(e){////////////////////////////////////////////////////////////////////////////////////////////////
  console.log("mousedown");
  e.preventDefault();
  if((!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving && !$(this).hasClass('wall')){
    $(this).addClass('wall');
    addingWalls=true;
  }else if ((!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving && $(this).hasClass('wall')) {
    $(this).removeClass('wall');
    removingWalls=true;
  }
});

$('.mazeData').on("touchstart", function(e){////////////////////////////////////////////////////////////////////////////////////////////////
  console.log("touch start");
  e.preventDefault();
  if((!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving && !$(this).hasClass('wall')){
    $(this).addClass('wall');
    addingWalls=true;
  }else if ((!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving && $(this).hasClass('wall')) {
    $(this).removeClass('wall');
    removingWalls=true;
  }
});

$(document).mouseup(function(e){////////////////////////////////////////////////////////////////////////////////////////////////
  // console.log('mouseup occured');
  e.preventDefault();
  if (addingWalls) {
    addingWalls=false;
  }
  if (removingWalls) {
    removingWalls=false;
    // console.log('removing walls toggled');
  }
});

$(document).on("touchend", function(e){////////////////////////////////////////////////////////////////////////////////////////////////
  // console.log('mouseup occured');
  e.preventDefault();
  console.log("touch end");
  if (addingWalls) {
    addingWalls=false;
  }
  if (removingWalls) {
    removingWalls=false;
    // console.log('removing walls toggled');
  }
});

$('.maze').mousemove(function(event){
  event.preventDefault();
});

$('.maze').on("touchmove", function(event){
  event.preventDefault();
});

$('.mazeData').mousemove(function(event){
  event.preventDefault();
  if (addingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
    $(this).addClass('wall');
  }else if (removingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
    $(this).removeClass('wall');
  }
});

$('.mazeData').on("touchmove", function(event){
  event.preventDefault();
  console.log($(this).attr("class"));
  if (addingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
    $(this).addClass('wall');
  }else if (removingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
    $(this).removeClass('wall');
  }
});

$('.clear').click(function(){
  if(!solving){
    $('.'+endCoordinates).removeClass('success');
    $('.mazeData').each(function(){
      $(this).removeClass('wall');
      $(this).removeClass('active');
    });
  }
});

$('.'+startCoordinates).addClass('startPoint');
$('.'+endCoordinates).addClass('endPoint');


var stack=['start']
var maze=[];


var delay=1800;

function createArray(){
  $('.mazeData').each(function(){
    $(this).removeClass('active');
  });flag=false;
  maze=[];
  delay=1800;
  currentX=startX;
  currentY=startY;
  for (var i = 0; i < rows; i++) {
    maze.push([]);
    for (var j = 0; j < columns; j++) {
      if ($('.'+i+'-'+j).hasClass('wall')) {
        maze[i].push(1)
      }else {
        maze[i].push(0)
      }
    }
  }
}
function activate(currentX, currentY){
  if (!(currentX==startX && currentY==startY) && !(currentX==destinationX && currentY==destinationY)) {
    $('.'+currentX+'-'+currentY).addClass('active');
    // $('.'+currentX+'-'+currentY).addClass('flash');
    // setTimeout(function(){
    //   $('.'+currentX+'-'+currentY).removeClass('flash');
    // }, 25);
  }
}

function deactivate(currentX, currentY){
  if (!(currentX==startX && currentY==startY) && !(currentX==destinationX && currentY==destinationY)) {
    $('.'+currentX+'-'+currentY).removeClass('active');
  //   $('.'+currentX+'-'+currentY).addClass('flash');
  //   setTimeout(function(){
  //     $('.'+currentX+'-'+currentY).removeClass('flash');
  //   }, 25);
  }
}

function addDelay(currentX, currentY, delay){
  setTimeout(function(){
    activate(currentX, currentY);
  }, delay);
}
function removeDelay(currentX, currentY, delay){
  setTimeout(function(){
    deactivate(currentX, currentY);
  }, delay);
}

function findPath(){
  maze[currentX][currentY]=2;
  addDelay(currentX, currentY, delay);
  delay+=speed;
  if (currentX==destinationX && currentY==destinationY){
    flag=1;
    return;
  }
  //try going right, if you haven't come from the right and it isnt' visited and it's inside the board
  if(stack[stack.length-1]!='left' && currentY!=columns-1 && maze[currentX][currentY+1]!=1 && maze[currentX][currentY+1]!=2)
  {
    currentY+=1;
    stack.push("right");
    findPath();
    currentY-=1;
    if(flag)
    {
        return;
    }
    stack.pop();
  }
  //Same way for down
  if(stack[stack.length-1]!='up' && currentX!=rows-1 && maze[currentX+1][currentY]!=1 && maze[currentX+1][currentY]!=2)
  {
    currentX+=1;
    stack.push("down");
    findPath();
    currentX-=1;
    if(flag)
    {
        return;
    }
    stack.pop();
  }
  //Same way for left
  if(stack[stack.length-1]!='right' && currentY!=0 && maze[currentX][currentY-1]!=1 && maze[currentX][currentY-1]!=2)
  {
    currentY-=1;
    stack.push("left");
    findPath();
    currentY+=1;
    if(flag)
    {
        return;
    }
    stack.pop();
  }
  //Same way for up
  if(stack[stack.length-1]!='down' && currentX!=0 && maze[currentX-1][currentY]!=1 && maze[currentX-1][currentY]!=2)
  {
    currentX-=1;
    stack.push("up");
    findPath();
    currentX+=1;
    if(flag)
    {
        return;
    }
    stack.pop();
  }
  removeDelay(currentX, currentY, delay);
  delay+=speed;
}


$('.find').click(function(){
  if(!solving){
    $('.'+endCoordinates).removeClass('success');
    $('.find').text('FINDING')
    setTimeout(function(){
      $('.find').text($('.find').text()+'.')
    }, 600);
    setTimeout(function(){
      $('.find').text($('.find').text()+'.')
    }, 1200);
    setTimeout(function(){
      $('.find').text($('.find').text()+'.')
    }, 1800);
    solving=true;
    createArray();
    findPath();
    if (!flag) {
      setTimeout(function(){
        alert("No solution!");
      }, delay);
    }
    setTimeout(function(){
      solving=false;
      $('.'+endCoordinates).addClass('success');
      $('.find').text('FIND')
    }, delay);
  }
});
