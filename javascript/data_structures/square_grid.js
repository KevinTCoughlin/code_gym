// support object for A* star path finder
//
// based on http://www.redblobgames.com/pathfinding/a-star/implementation.html#python
//  http://www.redblobgames.com/pathfinding/a-star/_introduction.js
//
// NOTE: the code for redblobgames python SquareGrid make extensive use of tuples which javascript aint got right now
var dsalgo = require('../utilities.js').dsalgo;

function SquareGrid(width, height) {
  this.width = width;
  this.height = height;
  this.walls = dsalgo.utils.simpleSet();

  // useful for enumerating all the locations around a location
  this.DIRS = [[1,0], [0,1], [-1,0], [0,-1]];

  if (!this.width || !this.height) {
    // without these we cant to proper bounds checking
    throw new Error("need to set Grid height and width");
  }
}

// http://stackoverflow.com/questions/4512405/javascript-variable-assignments-from-tuples
SquareGrid.prototype.in_bounds = function(x,y) {
  return x >= 0 && x < this.width && y >= 0 && y < this.height;
}

SquareGrid.prototype.passable = function(x,y) {
  var pass = true;
  if(dsalgo.utils.isDefined(this.walls[this.locationID(x,y)])){
     if(this.walls[this.locationID(x,y)]){
       pass = false;
     }
  }
  return pass; 
}

SquareGrid.prototype.locationID = function(x,y) {
  return [x,y].join(",");
}

SquareGrid.prototype.neighbors = function(x,y) {
  var neighbors = [];
  var ctx = this;

  this.DIRS.forEach(function(dir){
    var x2 = x + dir[0], y2 = y + dir[1];
    
    if(ctx.in_bounds(x2,y2) && ctx.passable(x2,y2)){
      neighbors.push([x2,y2]); 
    }
  }, this);

  // reverse the return order sometimes so the walk takes a cooler path
  if(dsalgo.utils.mod(x + y, 2) == 0){
    neighbors.reverse();
  }
  return neighbors;
}

SquareGrid.prototype.add_wall = function(x,y) {
  this.walls[this.locationID(x,y)] = true;
}

SquareGrid.prototype.add_rect = function(x1,y1,x2,y2) {

  for(var x = x1; x < x2; ++x){
    for(var y = y1; y < y2; ++y){
      this.add_wall(x,y);
    }
  }

  return this;
}

SquareGrid.prototype.tileToString = function(x,y, styleOpts) {
  
  var id = this.locationID(x,y);

  // default to period
  var string = ".";

  if(!this.passable(x,y)) { // its a wall
    string = dsalgo.utils.stringRepeat("#", styleOpts["width"]); 
  } else if (styleOpts["distances"] && styleOpts["distances"][id]){
    string = styleOpts["distances"][id];
  } else if (styleOpts["point_to"] && styleOpts["point_to"][id]){
    var pt = styleOpts["point_to"][id];
    var x2 = x + pt[0], y2 = y + pt[1];

    if(x2 === x + 1){
      string = "\u2192";
    } else if (x2 === x - 1){
      string = "\u2190";
    } else if (y2 === y + 1){
      string = "\u2193";
    } else if (y2 === y - 1){
      string = "\u2191";
    }
  } else if (styleOpts["start"] && styleOpts["start"][id]){
    if(styleOpts["start"] == id){
      string = "A";
    }
  } else if (styleOpts["goal"] && styleOpts["goal"][id]){
    if(styleOpts["goal"] == id){
      string = "Z";
    }
  } else if (styleOpts["path"] && styleOpts["path"][id]){
      string = "@";
  }

  if(this.passable(x,y)) { // its not a wall
    // why subtract one?
    //
    // w are padding to the width. and we already added the character itself
    string = string + dsalgo.utils.stringRepeat(" ", styleOpts["width"] - 1) ;
  }
  return string;
}

SquareGrid.prototype.grid_iterator = function(fn) {

  for(var y = 0; y !== this.height; ++y){
    for(var x = 0; x !== this.width; ++x){
      fn(x,y);
    }
  }

  return this;
}

SquareGrid.prototype.toString = function(opts) {

  var conf = opts || {width: 2};
  if (conf && !dsalgo.utils.isDefined(conf.width)) conf.width = 2;

  var text = "\n";
  var ctx = this;

  this.grid_iterator(function(x,y){
    text += ctx.tileToString(x,y, conf);
    if(x === ctx.width - 1) text += "\n";  
  });

  return text;
}

SquareGrid.prototype.locationToNumber = function(x,y) {
  // because y is enumerated before x in this implementation
  return dsalgo.utils.oneDindex(y,x, this.width);
}

SquareGrid.prototype.numberToLocation = function(id) {
  // because y is enumerated before x in this implementation
  var row = Math.floor(id / this.width);
  var col = dsalgo.utils.mod(id, this.width);
  return [col,row];
}

SquareGrid.prototype.neighborsToAdjacencyList = function() {

  var ctx = this;
  var adjList = [];

  this.grid_iterator(function(x,y){
    var loc = ctx.locationToNumber(x,y); 
    ctx.neighbors(x,y).forEach(function (locationIDArr){
      var x2 = locationIDArr[0]; 
      var y2 = locationIDArr[1]; 
      var neighborNumber = ctx.locationToNumber(x2,y2); 

      if (!dsalgo.utils.isDefined(adjList[loc])){
        adjList[loc] = []; 
      }

      var testX3 = ctx.numberToLocation(neighborNumber)[0];
      var testY3 = ctx.numberToLocation(neighborNumber)[1];
      
      adjList[loc].push(neighborNumber);
    })
  }, this);

  return adjList;
}

module.exports = SquareGrid;