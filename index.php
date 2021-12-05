<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>pathfinding</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div class="container-fluid heading">
      <h1>Pathfinding Visualiser</h1>
    </div>
    <div class="container-fluid maze">
      <div class='mazeControl'>
        <button type="button" class="find btn button btn-md">FIND</button>
        <button type="button" class="clear btn button btn-md">CLEAR BOARD</button>
        <br>
        <div>
          <label>Select the algorithm:</label>
          <select class="alg">
            <option value="1" selected>DFS</option>
            <option value="2">BFS</option>
            <option value="3">A*</option>
            <option value="4">Bidirectional SN</option>
            <option value="5">Bidirectional SD</option>
          </select>
          <label>Select the animation speed:</label>
          <select class="speed">
            <!-- <option value="10">INSANE</option> -->
            <option value="35">FAST</option>
            <option value="40" selected>NORMAL</option>
            <option value="50">SLOW</option>
            <option value="60">SNAIL</option>
          </select>
          <span>Nodes Visited:</span>
          <span id="visitedCount">0</span>
          <span>Path Length:</span>
          <span id="pathLength">-</span>
          </div>
      </div>
      <table class='mazeTable'>
        <?php
          for ($i=0; $i < 22; $i++) {
            echo "<tr>";
              for ($j=0; $j < 50; $j++) {
                echo "<td class='mazeData ".$i."-".$j."'></td>";
              }
            echo "</tr>";
          }
        ?>
      </table>
    </div>
    <script src="index.js" charset="utf-8"></script>
  </body>
</html>
