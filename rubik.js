function getCubeSvg(cubeString) {
  const colorMap = {
    r: '#ff4d4d',   
    g: '#00cc44',   
    b: '#3399ff',   
    y: '#ffff66',   
    o: '#ff9900',   
    w: '#ffffff'
  };

  let html = '<div style="display: grid; grid-template-columns: repeat(18, 30px); gap: 2px;">';
  for (let i = 0; i < 54; i++) {
    const color = colorMap[cubeString[i]];
    html += `<div style="width:30px;height:30px;background:${color};border:1px solid #000;"></div>`;
  }
  html += '</div>';
  return html;
}

class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('r'),
      B: Array(9).fill('o'),
      L: Array(9).fill('g'),
      R: Array(9).fill('b'),
    };
    this.scrambleSteps = [];
  }

  rotateArray(arr, clockwise) {
    const res = [];
    if (clockwise) {
      res[0] = arr[6]; res[1] = arr[3]; res[2] = arr[0];
      res[3] = arr[7]; res[4] = arr[4]; res[5] = arr[1];
      res[6] = arr[8]; res[7] = arr[5]; res[8] = arr[2];
    } else {
      res[0] = arr[2]; res[1] = arr[5]; res[2] = arr[8];
      res[3] = arr[1]; res[4] = arr[4]; res[5] = arr[7];
      res[6] = arr[0]; res[7] = arr[3]; res[8] = arr[6];
    }
    return res;
  }

  rotateFace(face, clockwise = true, track = true) {
    if (track) this.scrambleSteps.push({ face, clockwise: !clockwise });
    this.faces[face] = this.rotateArray(this.faces[face], clockwise);

    const f = this.faces;

    const rotateEdge = (a, b, c, d) => {
      const values = [...a, ...b, ...c, ...d].map(([face, idx]) => f[face][idx]);
      const rotated = clockwise
        ? [...values.slice(-3), ...values.slice(0, 9)]
        : [...values.slice(3), ...values.slice(0, 3)];
      [...a, ...b, ...c, ...d].forEach(([face, idx], i) => {
        f[face][idx] = rotated[i];
      });
    };

    switch (face) {
      case 'F':
        rotateEdge(
          [['U', 6], ['U', 7], ['U', 8]],
          [['L', 8], ['L', 5], ['L', 2]],
          [['D', 2], ['D', 1], ['D', 0]],
          [['R', 0], ['R', 3], ['R', 6]]
        );
        break;
      case 'B':
        rotateEdge(
          [['U', 2], ['U', 1], ['U', 0]],
          [['R', 2], ['R', 5], ['R', 8]],
          [['D', 6], ['D', 7], ['D', 8]],
          [['L', 6], ['L', 3], ['L', 0]]
        );
        break;
      case 'U':
        rotateEdge(
          [['B', 0], ['B', 1], ['B', 2]],
          [['R', 0], ['R', 1], ['R', 2]],
          [['F', 0], ['F', 1], ['F', 2]],
          [['L', 0], ['L', 1], ['L', 2]]
        );
        break;
      case 'D':
        rotateEdge(
          [['F', 6], ['F', 7], ['F', 8]],
          [['R', 6], ['R', 7], ['R', 8]],
          [['B', 6], ['B', 7], ['B', 8]],
          [['L', 6], ['L', 7], ['L', 8]]
        );
        break;
      case 'L':
        rotateEdge(
          [['U', 0], ['U', 3], ['U', 6]],
          [['F', 0], ['F', 3], ['F', 6]],
          [['D', 0], ['D', 3], ['D', 6]],
          [['B', 8], ['B', 5], ['B', 2]]
        );
        break;
      case 'R':
        rotateEdge(
          [['U', 8], ['U', 5], ['U', 2]],
          [['B', 0], ['B', 3], ['B', 6]],
          [['D', 8], ['D', 5], ['D', 2]],
          [['F', 8], ['F', 5], ['F', 2]]
        );
        break;
    }

    this.display();
  }

  scramble(times = 20) {
    const faces = ['F', 'B', 'U', 'D', 'L', 'R'];
    for (let i = 0; i < times; i++) {
      const face = faces[Math.floor(Math.random() * 6)];
      const dir = Math.random() > 0.5;
      this.rotateFace(face, dir, true);
    }
  }

  solve() {
    while (this.scrambleSteps.length > 0) {
      const { face, clockwise } = this.scrambleSteps.pop();
      this.rotateFace(face, clockwise, false);
    }
  }

  display() {
    const order = ['U', 'R', 'F', 'D', 'L', 'B'];
    let cubeString = '';
    for (const face of order) {
      cubeString += this.faces[face].join('');
    }
    document.getElementById('cubeDisplay').innerHTML = getCubeSvg(cubeString);
  }
}

const cube = new RubiksCube();
cube.display();
