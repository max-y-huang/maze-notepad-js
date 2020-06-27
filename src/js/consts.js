class Consts {

  CREATE = 0;
  SOLVE = 1;

  SHAPE = 0;
  PATHS = 1;
  MARKERS = 2;

  COLOURS = [
    [ 219, 23, 41 ],  // Red
    [ 243, 107, 38 ],  // Orange
    //[ 252, 184, 46 ],  // Old Yellow
    [ 218, 165, 32 ], // New Yellow
    //[ 183, 201, 54 ],  // Olive
    [ 42, 185, 80 ],  // Green
    //[ 0, 182, 173 ],  // Teal
    [ 19, 138, 205 ],  // Blue
    [ 96, 66, 197 ],  // Violet
    //[ 161, 62, 196 ],  // Purple
    //[ 223, 55, 148 ],  // Old Pink
    [ 223, 55, 202 ] // New Pink
    //[ 165, 100, 66 ]  // Brown
  ];
  COLOUR_NAMES = [
    'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'
  ];
}

let consts = new Consts();
export default consts;
