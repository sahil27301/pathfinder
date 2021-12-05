var addingWalls = false;
var removingWalls = false;
var solving = false;
var flag = false;
var shiftingStart = false;
var shiftingEnd = false;
var stack = ["start"];
var queue1 = [];
var queue2 = [];
var priorityQueue = [];
var maze = [];
var delay = 1800;
var startCoordinates = "0-0";
var endCoordinates = "21-49";
var columns = 50;
var rows = 22;
var startX = parseInt(startCoordinates.split("-")[0]);
var startY = parseInt(startCoordinates.split("-")[1]);
var destinationX = parseInt(endCoordinates.split("-")[0]);
var destinationY = parseInt(endCoordinates.split("-")[1]);
var currentX, currentY;
var speed = 20;
var alg = 1;
var lastSpeed = 0;
let visited = [];
let visitedNodeCount = 0;
let pathLength = 0;
for (let i = 0; i < rows; i++) {
  visited.push([]);
  for (let j = 0; j < columns; j++) {
    visited[i].push(0);
  }
}

$("." + startCoordinates).addClass("startPoint");
$("." + endCoordinates).addClass("endPoint");

$(document).ready(function () {
  $(".speed").change(function () {
    if (!solving) {
      speed = parseFloat($(this).val());
    }
  });
  $(".alg").change(function () {
    if (!solving) {
      alg = parseFloat($(this).val());
    }
  });

  $(".mazeData").mousedown(function (e) {
    e.preventDefault();
    if ($(this).hasClass("startPoint")) {
      shiftingStart = true;
    } else if ($(this).hasClass("endPoint")) {
      $(this).removeClass("success");
      shiftingEnd = true;
    } else if (
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving &&
      !$(this).hasClass("wall")
    ) {
      $(this).addClass("wall");
      addingWalls = true;
    } else if (
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving &&
      $(this).hasClass("wall")
    ) {
      $(this).removeClass("wall");
      removingWalls = true;
    }
  });

  $(".mazeData").on("touchstart", function (e) {
    e.preventDefault();
    if ($(this).hasClass("startPoint")) {
      shiftingStart = true;
    } else if ($(this).hasClass("endPoint")) {
      $(this).removeClass("success");
      shiftingEnd = true;
    } else if (
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving &&
      !$(this).hasClass("wall")
    ) {
      $(this).addClass("wall");
      addingWalls = true;
    } else if (
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving &&
      $(this).hasClass("wall")
    ) {
      $(this).removeClass("wall");
      removingWalls = true;
    }
  });

  $(document).mouseup(function (e) {
    e.preventDefault();
    if (shiftingStart) {
      shiftingStart = false;
    }
    if (shiftingEnd) {
      shiftingEnd = false;
    }
    if (addingWalls) {
      addingWalls = false;
    }
    if (removingWalls) {
      removingWalls = false;
    }
  });

  $(document).on("touchend", function (e) {
    if (shiftingStart) {
      shiftingStart = false;
    }
    if (shiftingEnd) {
      shiftingEnd = false;
    }
    if (addingWalls) {
      addingWalls = false;
    }
    if (removingWalls) {
      removingWalls = false;
    }
  });

  $(".maze").mousemove(function (event) {
    event.preventDefault();
  });

  $(".mazeData").mousemove(function (event) {
    event.preventDefault();
    if (shiftingStart && !$(this).hasClass("endPoint") && !solving) {
      $(this).removeClass("wall");
      $(this).removeClass("active");
      $(this).removeClass("shortestPath");
      $(".startPoint").removeClass("startPoint");
      $(this).addClass("startPoint");
    } else if (shiftingEnd && !$(this).hasClass("startPoint") && !solving) {
      $(this).removeClass("wall");
      $(this).removeClass("active");
      $(this).removeClass("shortestPath");
      $(".endPoint").removeClass("endPoint");
      $(this).addClass("endPoint");
    } else if (
      addingWalls &&
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving
    ) {
      $(this).addClass("wall");
    } else if (
      removingWalls &&
      !$(this).hasClass("startPoint") &&
      !$(this).hasClass("endPoint") &&
      !solving
    ) {
      $(this).removeClass("wall");
    }
  });

  $(".mazeData").on("touchmove", function (e) {
    var theTouch = e.changedTouches[0];
    var mouseEv;
    mouseEv = "mouseMove";
    var mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(
      mouseEv,
      true,
      true,
      window,
      1,
      theTouch.screenX,
      theTouch.screenY,
      theTouch.clientX,
      theTouch.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    theTouch.target.dispatchEvent(mouseEvent);
    let elem = document.elementFromPoint(
      mouseEvent.clientX,
      mouseEvent.clientY
    );
    if ($(elem).hasClass("mazeData")) {
      if (shiftingStart && !$(elem).hasClass("endPoint") && !solving) {
        $(elem).removeClass("wall");
        $(elem).removeClass("active");
        $(elem).removeClass("shortestPath");
        $(".startPoint").removeClass("startPoint");
        $(elem).addClass("startPoint");
      } else if (shiftingEnd && !$(elem).hasClass("startPoint") && !solving) {
        $(elem).removeClass("wall");
        $(elem).removeClass("active");
        $(elem).removeClass("shortestPath");
        $(".endPoint").removeClass("endPoint");
        $(elem).addClass("endPoint");
      }
      if (
        addingWalls &&
        !$(elem).hasClass("startPoint") &&
        !$(elem).hasClass("endPoint") &&
        !solving
      ) {
        $(elem).addClass("wall");
      } else if (
        removingWalls &&
        !$(elem).hasClass("startPoint") &&
        !$(elem).hasClass("endPoint") &&
        !solving
      ) {
        $(elem).removeClass("wall");
      }
    }
    e.preventDefault();
  });

  $(".clear").on("click touchstart", function () {
    if (!solving) {
      $(".endPoint").removeClass("success");
      $(".mazeData").each(function () {
        $(this).removeClass("wall");
        $(this).removeClass("active");
        $(this).removeClass("shortestPath");
      });
    }
  });

  function createArray() {
    stack = ["start"];
    queue1 = [];
    queue2 = [];
    priorityQueue = [];
    lastSpeed = 0;
    $(".mazeData").each(function () {
      $(this).removeClass("active");
      $(this).removeClass("shortestPath");
    });
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        visited[i][j] = 0;
      }
    }
    flag = false;
    maze = [];
    delay = 1800;
    startCoordinates = document.querySelector(".startPoint").classList[1];
    endCoordinates = document.querySelector(".endPoint").classList[1];
    startX = parseInt(startCoordinates.split("-")[0]);
    startY = parseInt(startCoordinates.split("-")[1]);
    destinationX = parseInt(endCoordinates.split("-")[0]);
    destinationY = parseInt(endCoordinates.split("-")[1]);
    currentX = startX;
    currentY = startY;
    for (var i = 0; i < rows; i++) {
      maze.push([]);
      for (var j = 0; j < columns; j++) {
        if ($("." + i + "-" + j).hasClass("wall")) {
          maze[i].push(1);
        } else {
          maze[i].push(0);
        }
      }
    }
  }

  function addDelay(currentX, currentY, delay) {
    setTimeout(function () {
      ++visitedNodeCount;
      $("#visitedCount").text(visitedNodeCount);
      if (
        !(currentX == startX && currentY == startY) &&
        !(currentX == destinationX && currentY == destinationY)
      ) {
        $("." + currentX + "-" + currentY).addClass("active");
        $("." + currentX + "-" + currentY).addClass("shortestPath");
        setTimeout(function () {
          $("." + currentX + "-" + currentY).removeClass("shortestPath");
        }, 2 * speed);
      }
    }, delay);
  }
  function removeDelay(currentX, currentY, delay) {
    setTimeout(function () {
      if (
        !(currentX == startX && currentY == startY) &&
        !(currentX == destinationX && currentY == destinationY)
      ) {
        $("." + currentX + "-" + currentY).removeClass("active");
        $("." + currentX + "-" + currentY).addClass("shortestPath");
        setTimeout(function () {
          $("." + currentX + "-" + currentY).removeClass("shortestPath");
        }, 2 * speed);
      }
    }, delay);
  }

  function findPathDFS(firstCall = false) {
    visitedNodeCount -= firstCall;
    maze[currentX][currentY] = 2;
    addDelay(currentX, currentY, delay);
    delay += speed;
    if (currentX == destinationX && currentY == destinationY) {
      flag = 1;
      return;
    }
    if (
      stack[stack.length - 1] != "left" &&
      currentY != columns - 1 &&
      maze[currentX][currentY + 1] != 1 &&
      maze[currentX][currentY + 1] != 2
    ) {
      currentY += 1;
      stack.push("right");
      findPathDFS();
      currentY -= 1;
      if (flag) {
        return;
      }
      stack.pop();
    }
    if (
      stack[stack.length - 1] != "up" &&
      currentX != rows - 1 &&
      maze[currentX + 1][currentY] != 1 &&
      maze[currentX + 1][currentY] != 2
    ) {
      currentX += 1;
      stack.push("down");
      findPathDFS();
      currentX -= 1;
      if (flag) {
        return;
      }
      stack.pop();
    }
    if (
      stack[stack.length - 1] != "right" &&
      currentY != 0 &&
      maze[currentX][currentY - 1] != 1 &&
      maze[currentX][currentY - 1] != 2
    ) {
      currentY -= 1;
      stack.push("left");
      findPathDFS();
      currentY += 1;
      if (flag) {
        return;
      }
      stack.pop();
    }
    if (
      stack[stack.length - 1] != "down" &&
      currentX != 0 &&
      maze[currentX - 1][currentY] != 1 &&
      maze[currentX - 1][currentY] != 2
    ) {
      currentX -= 1;
      stack.push("up");
      findPathDFS();
      currentX += 1;
      if (flag) {
        return;
      }
      stack.pop();
    }
    removeDelay(currentX, currentY, delay);
    delay += speed;
  }

  function addPath(x, y, delay) {
    setTimeout(function () {
      ++pathLength;
      $("#pathLength").text(pathLength);
      $("." + x + "-" + y).addClass("shortestPath");
    }, 1.5 * delay);
  }

  function drawPath() {
    let tempX = destinationX;
    let tempY = destinationY;
    let currentLength = maze[destinationX][destinationY];
    while (currentLength) {
      if (
        tempX &&
        maze[tempX - 1][tempY] < maze[tempX][tempY] &&
        maze[tempX - 1][tempY] != 0 &&
        !$("." + (tempX - 1) + "-" + tempY).hasClass("wall") &&
        visited[tempX - 1][tempY] == 1
      ) {
        tempX -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY &&
        maze[tempX][tempY - 1] < maze[tempX][tempY] &&
        maze[tempX][tempY - 1] != 0 &&
        !$("." + tempX + "-" + (tempY - 1)).hasClass("wall") &&
        visited[tempX][tempY - 1] == 1
      ) {
        tempY -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempX != rows - 1 &&
        maze[tempX + 1][tempY] < maze[tempX][tempY] &&
        maze[tempX + 1][tempY] != 0 &&
        !$("." + (tempX + 1) + "-" + tempY).hasClass("wall") &&
        !$("." + (tempX + 1) + "-" + tempY).hasClass("wall") &&
        visited[tempX + 1][tempY] == 1
      ) {
        tempX += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY != columns - 1 &&
        maze[tempX][tempY + 1] < maze[tempX][tempY] &&
        maze[tempX][tempY + 1] != 0 &&
        !$("." + tempX + "-" + (tempY + 1)).hasClass("wall") &&
        visited[tempX][tempY + 1] == 1
      ) {
        tempY += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      }
      currentLength -= 1;
    }
  }

  function findPathBFS() {
    queue1.push([startX, startY, 0]);
    visited[startX][startY] = 1;
    while (true) {
      if (queue1.length == 0) {
        delay += lastSpeed;
        return;
      }
      coords = queue1.shift();
      lastSpeed = 2 * speed * coords[2];
      if (
        coords[0] &&
        !maze[coords[0] - 1][coords[1]] &&
        !(coords[0] - 1 == startX && coords[1] == startY)
      ) {
        maze[coords[0] - 1][coords[1]] = coords[2] + 1;
        addDelay(coords[0] - 1, coords[1], 2 * speed * (coords[2] + 1) + delay);
        queue1.push([coords[0] - 1, coords[1], coords[2] + 1]);
        visited[coords[0] - 1][coords[1]] = 1;
        if (coords[0] - 1 == destinationX && coords[1] == destinationY) {
          flag = 1;
          delay += 2 * speed * (coords[2] + 1);
          drawPath();
          return;
        }
      }
      if (
        coords[1] &&
        !maze[coords[0]][coords[1] - 1] &&
        !(coords[0] == startX && coords[1] - 1 == startY)
      ) {
        maze[coords[0]][coords[1] - 1] = coords[2] + 1;
        addDelay(coords[0], coords[1] - 1, 2 * speed * (coords[2] + 1) + delay);
        queue1.push([coords[0], coords[1] - 1, coords[2] + 1]);
        visited[coords[0]][coords[1] - 1] = 1;
        if (coords[0] == destinationX && coords[1] - 1 == destinationY) {
          flag = 1;
          delay += 2 * speed * (coords[2] + 1);
          drawPath();
          return;
        }
      }
      if (
        coords[0] != rows - 1 &&
        !maze[coords[0] + 1][coords[1]] &&
        !(coords[0] + 1 == startX && coords[1] == startY)
      ) {
        maze[coords[0] + 1][coords[1]] = coords[2] + 1;
        addDelay(coords[0] + 1, coords[1], 2 * speed * (coords[2] + 1) + delay);
        queue1.push([coords[0] + 1, coords[1], coords[2] + 1]);
        visited[coords[0] + 1][coords[1]] = 1;
        if (coords[0] + 1 == destinationX && coords[1] == destinationY) {
          flag = 1;
          delay += 2 * speed * (coords[2] + 1);
          drawPath();
          return;
        }
      }
      if (
        coords[1] != columns - 1 &&
        !maze[coords[0]][coords[1] + 1] &&
        !(coords[0] == startX && coords[1] + 1 == startY)
      ) {
        maze[coords[0]][coords[1] + 1] = coords[2] + 1;
        addDelay(coords[0], coords[1] + 1, 2 * speed * (coords[2] + 1) + delay);
        queue1.push([coords[0], coords[1] + 1, coords[2] + 1]);
        visited[coords[0]][coords[1] + 1] = 1;
        if (coords[0] == destinationX && coords[1] + 1 == destinationY) {
          flag = 1;
          delay += 2 * speed * (coords[2] + 1);
          drawPath();
          return;
        }
      }
    }
  }

  function mergeFrom(x1, y1, x2, y2) {
    let currentLength = maze[x1][y1];
    let tempX = x1;
    let tempY = y1;
    let maxAdd = (currentLength + 1) * speed;
    addPath(tempX, tempY, delay + (currentLength + 1) * speed);
    while (currentLength) {
      if (
        tempX &&
        maze[tempX - 1][tempY] < maze[tempX][tempY] &&
        maze[tempX - 1][tempY] != 0 &&
        visited[tempX - 1][tempY] == 1
      ) {
        tempX -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY &&
        maze[tempX][tempY - 1] < maze[tempX][tempY] &&
        maze[tempX][tempY - 1] != 0 &&
        visited[tempX][tempY - 1] == 1
      ) {
        tempY -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempX != rows - 1 &&
        maze[tempX + 1][tempY] < maze[tempX][tempY] &&
        maze[tempX + 1][tempY] != 0 &&
        visited[tempX + 1][tempY] == 1
      ) {
        tempX += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY != columns - 1 &&
        maze[tempX][tempY + 1] < maze[tempX][tempY] &&
        maze[tempX][tempY + 1] != 0 &&
        visited[tempX][tempY + 1] == 1
      ) {
        tempY += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      }
      currentLength -= 1;
    }
    // ************************************************************************
    currentLength = maze[x2][y2];
    tempX = x2;
    tempY = y2;
    maxAdd =
      (currentLength + 1) * speed * ((currentLength + 1) * speed > maxAdd) +
      maxAdd * (maxAdd > (currentLength + 1) * speed);
    addPath(tempX, tempY, delay + (currentLength + 1) * speed);
    while (currentLength) {
      if (
        tempX &&
        maze[tempX - 1][tempY] < maze[tempX][tempY] &&
        maze[tempX - 1][tempY] != 0 &&
        visited[tempX - 1][tempY] == 2
      ) {
        tempX -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY &&
        maze[tempX][tempY - 1] < maze[tempX][tempY] &&
        maze[tempX][tempY - 1] != 0 &&
        visited[tempX][tempY - 1] == 2
      ) {
        tempY -= 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempX != rows - 1 &&
        maze[tempX + 1][tempY] < maze[tempX][tempY] &&
        maze[tempX + 1][tempY] != 0 &&
        visited[tempX + 1][tempY] == 2
      ) {
        tempX += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      } else if (
        tempY != columns - 1 &&
        maze[tempX][tempY + 1] < maze[tempX][tempY] &&
        maze[tempX][tempY + 1] != 0 &&
        visited[tempX][tempY + 1] == 2
      ) {
        tempY += 1;
        addPath(tempX, tempY, delay + currentLength * speed);
      }
      currentLength -= 1;
    }
    delay += maxAdd;
  }

  function BSN() {
    queue1.push([startX, startY, 0]);
    queue2.push([destinationX, destinationY, 0]);
    visited[startX][startY] = 1;
    visited[destinationX][destinationY] = 2;
    while (true) {
      if (queue1.length == 0 || queue2.length == 0) {
        return;
      }
      coords1 = queue1.shift();
      coords2 = queue2.shift();
      if (coords1[0] && !(coords1[0] - 1 == startX && coords1[1] == startY)) {
        if (visited[coords1[0] - 1][coords1[1]] == 2) {
          flag = 1;
          delay += speed;
          mergeFrom(coords1[0], coords1[1], coords1[0] - 1, coords1[1]);
          return;
        }
        if (!maze[coords1[0] - 1][coords1[1]]) {
          maze[coords1[0] - 1][coords1[1]] = coords1[2] + 1;
          addDelay(coords1[0] - 1, coords1[1], delay);
          delay += speed;
          queue1.push([coords1[0] - 1, coords1[1], coords1[2] + 1]);
          visited[coords1[0] - 1][coords1[1]] = 1;
        }
      }
      if (coords1[1] && !(coords1[0] == startX && coords1[1] - 1 == startY)) {
        if (visited[coords1[0]][coords1[1] - 1] == 2) {
          flag = 1;
          delay += speed;
          mergeFrom(coords1[0], coords1[1], coords1[0], coords1[1] - 1);
          return;
        }
        if (!maze[coords1[0]][coords1[1] - 1]) {
          maze[coords1[0]][coords1[1] - 1] = coords1[2] + 1;
          addDelay(coords1[0], coords1[1] - 1, delay);
          delay += speed;
          queue1.push([coords1[0], coords1[1] - 1, coords1[2] + 1]);
          visited[coords1[0]][coords1[1] - 1] = 1;
        }
      }
      if (
        coords1[0] != rows - 1 &&
        !(coords1[0] + 1 == startX && coords1[1] == startY)
      ) {
        if (visited[coords1[0] + 1][coords1[1]] == 2) {
          flag = 1;
          delay += speed;
          mergeFrom(coords1[0], coords1[1], coords1[0] + 1, coords1[1]);
          return;
        }
        if (!maze[coords1[0] + 1][coords1[1]]) {
          maze[coords1[0] + 1][coords1[1]] = coords1[2] + 1;
          addDelay(coords1[0] + 1, coords1[1], delay);
          delay += speed;
          queue1.push([coords1[0] + 1, coords1[1], coords1[2] + 1]);
          visited[coords1[0] + 1][coords1[1]] = 1;
        }
      }
      if (
        coords1[1] != columns - 1 &&
        !(coords1[0] == startX && coords1[1] + 1 == startY)
      ) {
        if (visited[coords1[0]][coords1[1] + 1] == 2) {
          flag = 1;
          delay += speed;
          mergeFrom(coords1[0], coords1[1], coords1[0], coords1[1] + 1);
          return;
        }
        if (!maze[coords1[0]][coords1[1] + 1]) {
          maze[coords1[0]][coords1[1] + 1] = coords1[2] + 1;
          addDelay(coords1[0], coords1[1] + 1, delay);
          delay += speed;
          queue1.push([coords1[0], coords1[1] + 1, coords1[2] + 1]);
          visited[coords1[0]][coords1[1] + 1] = 1;
        }
      }
      if (
        coords2[0] &&
        !(coords2[0] - 1 == destinationX && coords2[1] == destinationY)
      ) {
        if (visited[coords2[0] - 1][coords2[1]] == 1) {
          flag = 1;
          delay += speed;
          mergeFrom(coords2[0] - 1, coords2[1], coords2[0], coords2[1]);
          return;
        }
        if (!maze[coords2[0] - 1][coords2[1]]) {
          maze[coords2[0] - 1][coords2[1]] = coords2[2] + 1;
          addDelay(coords2[0] - 1, coords2[1], delay);
          delay += speed;
          queue2.push([coords2[0] - 1, coords2[1], coords2[2] + 1]);
          visited[coords2[0] - 1][coords2[1]] = 2;
        }
      }
      if (
        coords2[1] &&
        !(coords2[0] == destinationX && coords2[1] - 1 == destinationY)
      ) {
        if (visited[coords2[0]][coords2[1] - 1] == 1) {
          flag = 1;
          delay += speed;
          mergeFrom(coords2[0], coords2[1] - 1, coords2[0], coords2[1]);
          return;
        }
        if (!maze[coords2[0]][coords2[1] - 1]) {
          maze[coords2[0]][coords2[1] - 1] = coords2[2] + 1;
          addDelay(coords2[0], coords2[1] - 1, delay);
          delay += speed;
          queue2.push([coords2[0], coords2[1] - 1, coords2[2] + 1]);
          visited[coords2[0]][coords2[1] - 1] = 2;
        }
      }
      if (
        coords2[0] != rows - 1 &&
        !(coords2[0] + 1 == destinationX && coords2[1] == destinationY)
      ) {
        if (visited[coords2[0] + 1][coords2[1]] == 1) {
          flag = 1;
          delay += speed;
          mergeFrom(coords2[0] + 1, coords2[1], coords2[0], coords2[1]);
          return;
        }
        if (!maze[coords2[0] + 1][coords2[1]]) {
          maze[coords2[0] + 1][coords2[1]] = coords2[2] + 1;
          addDelay(coords2[0] + 1, coords2[1], delay);
          delay += speed;
          queue2.push([coords2[0] + 1, coords2[1], coords2[2] + 1]);
          visited[coords2[0] + 1][coords2[1]] = 2;
        }
      }
      if (
        coords2[1] != columns - 1 &&
        !(coords2[0] == destinationX && coords2[1] + 1 == destinationY)
      ) {
        if (visited[coords2[0]][coords2[1] + 1] == 1) {
          flag = 1;
          delay += speed;
          mergeFrom(coords2[0], coords2[1] + 1, coords2[0], coords2[1]);
          return;
        }
        if (!maze[coords2[0]][coords2[1] + 1]) {
          maze[coords2[0]][coords2[1] + 1] = coords2[2] + 1;
          addDelay(coords2[0], coords2[1] + 1, delay);
          delay += speed;
          queue2.push([coords2[0], coords2[1] + 1, coords2[2] + 1]);
          visited[coords2[0]][coords2[1] + 1] = 2;
        }
      }
    }
  }

  function BSD() {
    queue1.push([startX, startY, 0]);
    queue2.push([destinationX, destinationY, 0]);
    currq1 = 0;
    currq2 = 0;
    visited[startX][startY] = 1;
    visited[destinationX][destinationY] = 2;
    while (true) {
      if (queue1.length == 0 || queue2.length == 0) {
        delay += lastSpeed;
        return;
      }
      while (queue1[0][2] == currq1) {
        coords1 = queue1.shift();
        lastSpeed = 2 * speed * coords1[2];
        if (coords1[0] && !(coords1[0] - 1 == startX && coords1[1] == startY)) {
          if (visited[coords1[0] - 1][coords1[1]] == 2) {
            flag = 1;
            delay += 2 * speed * (coords1[2] + 1);
            mergeFrom(coords1[0], coords1[1], coords1[0] - 1, coords1[1]);
            return;
          }
          if (!maze[coords1[0] - 1][coords1[1]]) {
            maze[coords1[0] - 1][coords1[1]] = coords1[2] + 1;
            addDelay(
              coords1[0] - 1,
              coords1[1],
              2 * speed * (coords1[2] + 1) + delay
            );
            queue1.push([coords1[0] - 1, coords1[1], coords1[2] + 1]);
            visited[coords1[0] - 1][coords1[1]] = 1;
          }
        }
        if (coords1[1] && !(coords1[0] == startX && coords1[1] - 1 == startY)) {
          if (visited[coords1[0]][coords1[1] - 1] == 2) {
            flag = 1;
            delay += 2 * speed * (coords1[2] + 1);
            mergeFrom(coords1[0], coords1[1], coords1[0], coords1[1] - 1);
            return;
          }
          if (!maze[coords1[0]][coords1[1] - 1]) {
            maze[coords1[0]][coords1[1] - 1] = coords1[2] + 1;
            addDelay(
              coords1[0],
              coords1[1] - 1,
              2 * speed * (coords1[2] + 1) + delay
            );
            queue1.push([coords1[0], coords1[1] - 1, coords1[2] + 1]);
            visited[coords1[0]][coords1[1] - 1] = 1;
          }
        }
        if (
          coords1[0] != rows - 1 &&
          !(coords1[0] + 1 == startX && coords1[1] == startY)
        ) {
          if (visited[coords1[0] + 1][coords1[1]] == 2) {
            flag = 1;
            delay += 2 * speed * (coords1[2] + 1);
            mergeFrom(coords1[0], coords1[1], coords1[0] + 1, coords1[1]);
            return;
          }
          if (!maze[coords1[0] + 1][coords1[1]]) {
            maze[coords1[0] + 1][coords1[1]] = coords1[2] + 1;
            addDelay(
              coords1[0] + 1,
              coords1[1],
              2 * speed * (coords1[2] + 1) + delay
            );
            queue1.push([coords1[0] + 1, coords1[1], coords1[2] + 1]);
            visited[coords1[0] + 1][coords1[1]] = 1;
          }
        }
        if (
          coords1[1] != columns - 1 &&
          !(coords1[0] == startX && coords1[1] + 1 == startY)
        ) {
          if (visited[coords1[0]][coords1[1] + 1] == 2) {
            flag = 1;
            delay += 2 * speed * (coords1[2] + 1);
            mergeFrom(coords1[0], coords1[1], coords1[0], coords1[1] + 1);
            return;
          }
          if (!maze[coords1[0]][coords1[1] + 1]) {
            maze[coords1[0]][coords1[1] + 1] = coords1[2] + 1;
            addDelay(
              coords1[0],
              coords1[1] + 1,
              2 * speed * (coords1[2] + 1) + delay
            );
            queue1.push([coords1[0], coords1[1] + 1, coords1[2] + 1]);
            visited[coords1[0]][coords1[1] + 1] = 1;
          }
        }
        if (queue1.length == 0) {
          delay += lastSpeed;
          return;
        }
      }
      currq1 = queue1[0][2];
      while (queue2[0][2] == currq2) {
        coords2 = queue2.shift();
        if (
          coords2[0] &&
          !(coords2[0] - 1 == destinationX && coords2[1] == destinationY)
        ) {
          if (visited[coords2[0] - 1][coords2[1]] == 1) {
            flag = 1;
            delay += 2 * speed * (coords2[2] + 1);
            mergeFrom(coords2[0] - 1, coords2[1], coords2[0], coords2[1]);
            return;
          }
          if (!maze[coords2[0] - 1][coords2[1]]) {
            maze[coords2[0] - 1][coords2[1]] = coords2[2] + 1;
            addDelay(
              coords2[0] - 1,
              coords2[1],
              2 * speed * (coords2[2] + 1) + delay
            );
            queue2.push([coords2[0] - 1, coords2[1], coords2[2] + 1]);
            visited[coords2[0] - 1][coords2[1]] = 2;
          }
        }
        if (
          coords2[1] &&
          !(coords2[0] == destinationX && coords2[1] - 1 == destinationY)
        ) {
          if (visited[coords2[0]][coords2[1] - 1] == 1) {
            flag = 1;
            delay += 2 * speed * (coords2[2] + 1);
            mergeFrom(coords2[0], coords2[1] - 1, coords2[0], coords2[1]);
            return;
          }
          if (!maze[coords2[0]][coords2[1] - 1]) {
            maze[coords2[0]][coords2[1] - 1] = coords2[2] + 1;
            addDelay(
              coords2[0],
              coords2[1] - 1,
              2 * speed * (coords2[2] + 1) + delay
            );
            queue2.push([coords2[0], coords2[1] - 1, coords2[2] + 1]);
            visited[coords2[0]][coords2[1] - 1] = 2;
          }
        }
        if (
          coords2[0] != rows - 1 &&
          !(coords2[0] + 1 == destinationX && coords2[1] == destinationY)
        ) {
          if (visited[coords2[0] + 1][coords2[1]] == 1) {
            flag = 1;
            delay += 2 * speed * (coords2[2] + 1);
            mergeFrom(coords2[0] + 1, coords2[1], coords2[0], coords2[1]);
            return;
          }
          if (!maze[coords2[0] + 1][coords2[1]]) {
            maze[coords2[0] + 1][coords2[1]] = coords2[2] + 1;
            addDelay(
              coords2[0] + 1,
              coords2[1],
              2 * speed * (coords2[2] + 1) + delay
            );
            queue2.push([coords2[0] + 1, coords2[1], coords2[2] + 1]);
            visited[coords2[0] + 1][coords2[1]] = 2;
          }
        }
        if (
          coords2[1] != columns - 1 &&
          !(coords2[0] == destinationX && coords2[1] + 1 == destinationY)
        ) {
          if (visited[coords2[0]][coords2[1] + 1] == 1) {
            flag = 1;
            delay += 2 * speed * (coords2[2] + 1);
            mergeFrom(coords2[0], coords2[1] + 1, coords2[0], coords2[1]);
            return;
          }
          if (!maze[coords2[0]][coords2[1] + 1]) {
            maze[coords2[0]][coords2[1] + 1] = coords2[2] + 1;
            addDelay(
              coords2[0],
              coords2[1] + 1,
              2 * speed * (coords2[2] + 1) + delay
            );
            queue2.push([coords2[0], coords2[1] + 1, coords2[2] + 1]);
            visited[coords2[0]][coords2[1] + 1] = 2;
          }
        }
        if (queue2.length == 0) {
          return;
          delay += lastSpeed;
        }
      }
      currq2 = queue2[0][2];
    }
  }

  function enqueue(x, y, p) {
    let f = p + Math.abs(x - destinationX) + Math.abs(y - destinationY);
    if (priorityQueue.length == 0) {
      priorityQueue.push([x, y, p, f]);
    } else {
      let i = 0;
      let check = 0;
      while (i != priorityQueue.length) {
        if (priorityQueue[i][0] == x && priorityQueue[i][1] == y) {
          priorityQueue.splice(i, 1);
          break;
        }
        i += 1;
      }
      i = 0;
      while (i != priorityQueue.length && priorityQueue[i][3] < f) {
        i += 1;
      }
      priorityQueue.splice(i, 0, [x, y, p, f]);
    }
  }

  function aStar() {
    enqueue(startX, startY, 0);
    visited[startX][startY] = 1;
    while (true) {
      if (priorityQueue.length == 0) {
        return;
      }
      coords = priorityQueue.shift();
      visited[coords[0]][coords[1]] = 1;
      addDelay(coords[0], coords[1], delay);
      delay += speed;
      if (
        coords[0] &&
        (!maze[coords[0] - 1][coords[1]] ||
          maze[coords[0] - 1][coords[1]] > coords[2] + 1) &&
        !(coords[0] - 1 == startX && coords[1] == startY)
      ) {
        maze[coords[0] - 1][coords[1]] = coords[2] + 1;
        enqueue(coords[0] - 1, coords[1], coords[2] + 1);
        if (coords[0] - 1 == destinationX && coords[1] == destinationY) {
          flag = 1;
          drawPath();
          return;
        }
      }
      if (
        coords[1] &&
        (!maze[coords[0]][coords[1] - 1] ||
          maze[coords[0]][coords[1] - 1] > coords[2] + 1) &&
        !(coords[0] == startX && coords[1] - 1 == startY)
      ) {
        maze[coords[0]][coords[1] - 1] = coords[2] + 1;
        enqueue(coords[0], coords[1] - 1, coords[2] + 1);
        if (coords[0] == destinationX && coords[1] - 1 == destinationY) {
          flag = 1;
          drawPath();
          return;
        }
      }
      if (
        coords[0] != rows - 1 &&
        (!maze[coords[0] + 1][coords[1]] ||
          maze[coords[0] + 1][coords[1]] > coords[2] + 1) &&
        !(coords[0] + 1 == startX && coords[1] == startY)
      ) {
        maze[coords[0] + 1][coords[1]] = coords[2] + 1;
        enqueue(coords[0] + 1, coords[1], coords[2] + 1);
        if (coords[0] + 1 == destinationX && coords[1] == destinationY) {
          flag = 1;
          drawPath();
          return;
        }
      }
      if (
        coords[1] != columns - 1 &&
        (!maze[coords[0]][coords[1] + 1] ||
          maze[coords[0]][coords[1] + 1] > coords[2] + 1) &&
        !(coords[0] == startX && coords[1] + 1 == startY)
      ) {
        maze[coords[0]][coords[1] + 1] = coords[2] + 1;
        enqueue(coords[0], coords[1] + 1, coords[2] + 1);
        if (coords[0] == destinationX && coords[1] + 1 == destinationY) {
          flag = 1;
          drawPath();
          return;
        }
      }
    }
  }

  $(".find").on("click touchstart", function () {
    if (!solving) {
      $("." + endCoordinates).removeClass("success");
      $(".speed").attr("disabled", true);
      $(".alg").attr("disabled", true);
      $(".find").text("FINDING");
      setTimeout(function () {
        $(".find").text($(".find").text() + ".");
      }, 600);
      setTimeout(function () {
        $(".find").text($(".find").text() + ".");
      }, 1200);
      setTimeout(function () {
        $(".find").text($(".find").text() + ".");
      }, 1800);
      solving = true;
      createArray();
      visitedNodeCount = 0;
      pathLength = 1;
      if (alg == "1") {
        findPathDFS(true);
      } else if (alg == "2") {
        findPathBFS();
      } else if (alg == "3") {
        aStar();
      } else if (alg == "4") {
        BSN();
      } else if (alg == "5") {
        BSD();
      }
      if (!flag) {
        setTimeout(function () {
          $(".find").text("NO SOLUTION");
          $(".find").addClass("error");
          $("#pathLength").text("-");
        }, delay);
      }
      setTimeout(function () {
        solving = false;
        if (flag) {
          $(".find").text("FIND");
          $(".endPoint").addClass("success");
          if (alg == "1") {
            $("#pathLength").text($(".active").toArray().length + 1);
          }
        } else {
          setTimeout(function () {
            $(".find").text("FIND");
            $(".find").removeClass("error");
          }, 1000);
        }
        $(".speed").attr("disabled", false);
        $(".alg").attr("disabled", false);
      }, delay + maze[destinationX][destinationY] * speed);
    }
  });
});
