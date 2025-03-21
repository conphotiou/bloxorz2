let scene, camera, renderer, cube;
let gridSize = 12;
let grid = [];
let cubePos = { x: 1, y: 1 };
let endPos = { x: gridSize - 2, y: gridSize - 2 };

function init() {
  scene = new THREE.Scene();
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  let distance = gridSize * 1.2;
  camera.position.set(distance, distance, distance);
  camera.lookAt(gridSize / 2, 0, gridSize / 2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.getElementById("gameContainer").appendChild(renderer.domElement);
  onWindowResize();
  window.addEventListener("resize", onWindowResize);

  generateGrid();
  addLights();
  animate();
}

function generateGrid() {
  const geometry = new THREE.BoxGeometry(1, 0.2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const endMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
      let tileMaterial = (x === endPos.x && y === endPos.y) ? endMaterial : material;
      if (Math.random() < 0.8 || (x === 1 && y === 1) || (x === endPos.x && y === endPos.y)) {
        let tile = new THREE.Mesh(geometry, tileMaterial);
        tile.position.set(x, 0, y);
        scene.add(tile);
        grid[x][y] = true;
      } else {
        grid[x][y] = false;
      }
    }
  }

  const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(cubePos.x, 0.5, cubePos.y);
  scene.add(cube);
}

function addLights() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));
}

function move(dir) {
  let dx = 0, dy = 0;
  if (dir === "up") dy = -1;
  else if (dir === "down") dy = 1;
  else if (dir === "left") dx = -1;
  else if (dir === "right") dx = 1;

  let newX = cubePos.x + dx;
  let newY = cubePos.y + dy;

  if (grid[newX] && grid[newX][newY]) {
    cubePos = { x: newX, y: newY };
    cube.position.set(newX, 0.5, newY);

    if (newX === endPos.x && newY === endPos.y) {
      nextLevel();
    }
  }
}

function nextLevel() {
  gridSize += 2;
  grid = [];
  endPos = { x: gridSize - 2, y: gridSize - 2 };
  cubePos = { x: 1, y: 1 };
  scene.clear();
  init();
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height * 0.6);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
