<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>pathfinding</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
	  <script type="text/javascript" src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"></script>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div class="container-fluid heading">
      <h1>Sahil's Pathfinding Visualiser</h1>
    </div>
    <!-- <div class="container-fluid instructions">
      <h3>How to</h3>
      <ul>
        <li>This page will help visualise a DFS pathfinding algorithm.</li>
        <li>You can set the start point, end point, and walls below.</li>
        <li>Walls will not allow a path to go through them.</li>
        <li>Click on find to start searching for a path.</li>
      </ul>
    </div> -->
    <div class="container-fluid maze">
      <div class='mazeControl'>
        <button type="button" class="find btn btn-primary btn-md">FIND</button>
        <button type="button" class="clear btn btn-primary btn-md">CLEAR BOARD</button>
        <span class='speedControl'>
          <label>Select the animation speed:</label>
          <select class="speed">
            <option value="1">INSANE</option>
            <option value="10">FAST</option>
            <option value="16" selected>NORMAL</option>
            <option value="23">SLOW</option>
            <option value="30">SNAIL</option>
          </select>
        </span>
      </div>
      <p class='solving'>Solving!</p>
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
