var addingWalls=false;
var removingWalls=false;
var solving=false;
var flag=false;

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
var alg=1;
var lastSpeed=0;

$('.speed').change(function(){
  if (!solving) {
    speed=parseFloat($(this).val());
  }
});
$('.alg').change(function(){
  if (!solving) {
    alg=parseFloat($(this).val());
  }
});

$('.mazeData').mousedown(function(e){////////////////////////////////////////////////////////////////////////////////////////////////
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
  if (addingWalls) {
    addingWalls=false;
  }
  if (removingWalls) {
    removingWalls=false;
  }
});

$('.maze').mousemove(function(event){
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

$('.mazeData').on('touchmove', function(e)
{
  var theTouch = e.changedTouches[0];
  var mouseEv;
  mouseEv='mouseMove';
  var mouseEvent = document.createEvent("MouseEvent");
  mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
  theTouch.target.dispatchEvent(mouseEvent);
  let elem = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
    if ($(elem).hasClass('mazeData')) {
      if (addingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
        $(elem).addClass('wall');
      }else if (removingWalls && (!$(this).hasClass(startCoordinates)) && (!$(this).hasClass(endCoordinates)) && !solving) {
        $(elem).removeClass('wall');
      }
    }
  e.preventDefault();
});


$('.clear').on('click touchstart', function(){
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


var stack=['start'];
var queue=[];
var maze=[];


var delay=1800;

function createArray(){
  stack=["start"];
  queue=[];
  lastSpeed=0;
  $('.mazeData').each(function(){
    $(this).removeClass('active');
  });
  flag=false;
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

function findPathDFS(){
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
    findPathDFS();
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
    findPathDFS();
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
    findPathDFS();
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
    findPathDFS();
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

function findPathBFS(){
  queue.push([0,0,0]);
  while(true){
    if (queue.length==0){
      return;
    }
    coords=queue.shift();
    lastSpeed=2*speed*coords[2]
    if (coords[0] && !maze[coords[0]-1][coords[1]] && !(coords[0]-1==0 && coords[1]==0)) {
      maze[coords[0]-1][coords[1]]= coords[2]+1;
      addDelay(coords[0]-1, coords[1], 2*speed*(coords[2]+1)+delay);
      queue.push([coords[0]-1, coords[1], coords[2]+1]);
      if (coords[0]-1==destinationX && coords[1]==destinationY){
        flag=1;
        return;
      }
    }
    if (coords[1] && !maze[coords[0]][coords[1]-1] && !(coords[0]==0 && coords[1]-1==0)) {
      maze[coords[0]][coords[1]-1]= coords[2]+1;
      addDelay(coords[0], coords[1]-1, 2*speed*(coords[2]+1)+delay);
      queue.push([coords[0], coords[1]-1, coords[2]+1]);
      if (coords[0]==destinationX && coords[1]-1==destinationY){
        flag=1;
        return;
      }
    }
    if (coords[0]!=rows-1 && !maze[coords[0]+1][coords[1]] && !(coords[0]+1==0 && coords[1]==0)) {
      maze[coords[0]+1][coords[1]]= coords[2]+1;
      addDelay(coords[0]+1, coords[1], 2*speed*(coords[2]+1)+delay);
      queue.push([coords[0]+1, coords[1], coords[2]+1]);
      if (coords[0]+1==destinationX && coords[1]==destinationY){
        flag=1;
        return;
      }
    }
    if (coords[1]!=columns-1 && !maze[coords[0]][coords[1]+1] && !(coords[0]==0 && coords[1]+1==0)) {
      maze[coords[0]][coords[1]+1]= coords[2]+1;
      addDelay(coords[0], coords[1]+1, 2*speed*(coords[2]+1)+delay);
      queue.push([coords[0], coords[1]+1, coords[2]+1]);
      if (coords[0]==destinationX && coords[1]+1==destinationY){
        flag=1;
        return;
      }
    }
  }
}


$('.find').on('click touchstart', function(){
  if(!solving){
    $('.'+endCoordinates).removeClass('success');
    $('.speed').attr('disabled', true);
    $('.alg').attr('disabled', true);
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
    if (alg=="1"){
      findPathDFS();
    }else if(alg=="2"){
      findPathBFS();
    }
    if (!flag) {
      setTimeout(function(){
        $('.find').text('NO SOLUTION');
        $('.find').addClass('error');
      }, delay+lastSpeed);
    }
    setTimeout(function(){
      solving=false;
      if (flag) {
        $('.find').text('FIND');
        $('.'+endCoordinates).addClass('success');
      }else {
        setTimeout(function(){
          $('.find').text('FIND');
          $('.find').removeClass('error');
        }, delay+1000);
      }
      $('.speed').attr('disabled', false);
      $('.alg').attr('disabled', false);
    }, delay+lastSpeed);
  }
});
