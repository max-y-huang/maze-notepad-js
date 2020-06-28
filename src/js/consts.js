class Consts {

  CREATE = 0;
  SOLVE = 1;

  SHAPE = 0;
  PATHS = 1;
  MARKERS = 2;

  TEST = 0;
  SOLUTIONS = 1;

  COLOURS = [
    '#db1729',  // Red
    '#f36b26',  // Orange
    //[ 252, 184, 46 ],  // Old Yellow
    '#daa520', // New Yellow
    //[ 183, 201, 54 ],  // Olive
    '#2ab950',  // Green
    //[ 0, 182, 173 ],  // Teal
    '#138acd',  // Blue
    '#6042c5',  // Violet
    //[ 161, 62, 196 ],  // Purple
    //[ 223, 55, 148 ],  // Old Pink
    '#df37ca' // New Pink
    //[ 165, 100, 66 ]  // Brown
  ];
  COLOUR_NAMES = [
    'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'
  ];
}

let consts = new Consts();
export default consts;
