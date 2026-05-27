---
name: threejs-interaction
description: Three.js interaction - raycasting, controls, mouse/touch input, object selection. Use when handling user input, implementing click detection, adding camera controls, or creating interactive 3D experiences.
---

# Three.js Interaction

## Quick Start

```javascript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    console.log("Clicked:", intersects[0].object);
  }
}

window.addEventListener("click", onClick);
```

## Raycaster

### Basic Raycasting

```javascript
const raycaster = new THREE.Raycaster();

raycaster.setFromCamera(mousePosition, camera);
raycaster.set(origin, direction);

const intersects = raycaster.intersectObjects(objects, recursive);
// intersects[0]: { distance, point, face, faceIndex, object, uv, instanceId }
```

### Mouse Position Conversion

```javascript
const mouse = new THREE.Vector2();

function updateMouse(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function updateMouseCanvas(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}
```

### Touch Support

```javascript
function onTouchStart(event) {
  event.preventDefault();
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);
    if (intersects.length > 0) handleSelection(intersects[0]);
  }
}
renderer.domElement.addEventListener("touchstart", onTouchStart);
```

### Raycaster Options

```javascript
const raycaster = new THREE.Raycaster();
raycaster.near = 0;
raycaster.far = 100;
raycaster.params.Line.threshold = 0.1;
raycaster.params.Points.threshold = 0.1;
raycaster.layers.set(1); // Only intersect objects on layer 1
```

## Camera Controls

### OrbitControls

```javascript
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

controls.minDistance = 2;
controls.maxDistance = 50;

controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

controls.target.set(0, 1, 0);

function animate() {
  controls.update(); // Required for damping and auto-rotate
  renderer.render(scene, camera);
}
```

### PointerLockControls

```javascript
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", () => controls.lock());
controls.addEventListener("lock", () => console.log("Pointer locked"));
controls.addEventListener("unlock", () => console.log("Pointer unlocked"));

const keys = {};
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup", (e) => { keys[e.code] = false; });

function animate() {
  if (controls.isLocked) {
    if (keys["KeyW"]) controls.moveForward(0.1);
    if (keys["KeyS"]) controls.moveForward(-0.1);
  }
}
```

### FlyControls

```javascript
import { FlyControls } from "three/addons/controls/FlyControls.js";

const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 24;
controls.dragToLook = true;

function animate() {
  controls.update(clock.getDelta());
}
```

## TransformControls

```javascript
import { TransformControls } from "three/addons/controls/TransformControls.js";

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

transformControls.attach(selectedMesh);
transformControls.setMode("translate"); // 'translate', 'rotate', 'scale'
transformControls.setSpace("local"); // 'local', 'world'

transformControls.addEventListener("dragging-changed", (event) => {
  orbitControls.enabled = !event.value;
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "g": transformControls.setMode("translate"); break;
    case "r": transformControls.setMode("rotate"); break;
    case "s": transformControls.setMode("scale"); break;
    case "Escape": transformControls.detach(); break;
  }
});
```

## DragControls

```javascript
import { DragControls } from "three/addons/controls/DragControls.js";

const dragControls = new DragControls([mesh1, mesh2], camera, renderer.domElement);

dragControls.addEventListener("dragstart", (event) => {
  orbitControls.enabled = false;
});

dragControls.addEventListener("drag", (event) => {
  event.object.position.y = 0; // Constrain to ground
});

dragControls.addEventListener("dragend", (event) => {
  orbitControls.enabled = true;
});
```

## Selection System

### Click to Select

```javascript
let selectedObject = null;

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(selectableObjects);

  if (selectedObject) {
    selectedObject.material.emissive.set(0x000000);
  }

  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
    selectedObject.material.emissive.set(0x444444);
  } else {
    selectedObject = null;
  }
}
```

### Hover Effects

```javascript
let hoveredObject = null;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hoverableObjects);

  if (hoveredObject) {
    hoveredObject.material.color.set(hoveredObject.userData.originalColor);
    document.body.style.cursor = "default";
  }

  if (intersects.length > 0) {
    hoveredObject = intersects[0].object;
    if (!hoveredObject.userData.originalColor) {
      hoveredObject.userData.originalColor = hoveredObject.material.color.getHex();
    }
    hoveredObject.material.color.set(0xff6600);
    document.body.style.cursor = "pointer";
  } else {
    hoveredObject = null;
  }
}

window.addEventListener("mousemove", onMouseMove);
```

## Keyboard Input

```javascript
const keys = {};

document.addEventListener("keydown", (event) => { keys[event.code] = true; });
document.addEventListener("keyup", (event) => { keys[event.code] = false; });

function update() {
  const speed = 0.1;
  if (keys["KeyW"]) player.position.z -= speed;
  if (keys["KeyS"]) player.position.z += speed;
  if (keys["KeyA"]) player.position.x -= speed;
  if (keys["KeyD"]) player.position.x += speed;
}
```

## World-Screen Coordinate Conversion

### World to Screen

```javascript
function worldToScreen(position, camera) {
  const vector = position.clone();
  vector.project(camera);
  return {
    x: ((vector.x + 1) / 2) * window.innerWidth,
    y: (-(vector.y - 1) / 2) * window.innerHeight,
  };
}
```

### Ray-Plane Intersection

```javascript
function getRayPlaneIntersection(mouse, camera, plane) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersection = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersection);
  return intersection;
}

const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const worldPos = getRayPlaneIntersection(mouse, camera, groundPlane);
```

## Event Handling Best Practices

```javascript
class InteractionManager {
  constructor(camera, renderer, scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickables = [];

    renderer.domElement.addEventListener("click", (e) => this.onClick(e));
    renderer.domElement.addEventListener("mousemove", (e) => this.onMouseMove(e));
  }

  updateMouse(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  getIntersects() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(this.clickables, true);
  }

  onClick(event) {
    this.updateMouse(event);
    const intersects = this.getIntersects();
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData.onClick) object.userData.onClick(intersects[0]);
    }
  }

  addClickable(object, callback) {
    this.clickables.push(object);
    object.userData.onClick = callback;
  }
}
```

## Performance Tips

1. **Limit raycasts**: Throttle mousemove handlers
2. **Use layers**: Filter raycast targets
3. **Simple collision meshes**: Use invisible simpler geometry for raycasting
4. **Disable controls when not needed**: `controls.enabled = false`

```javascript
// Throttle raycast for hover
let lastRaycast = 0;
function onMouseMove(event) {
  const now = Date.now();
  if (now - lastRaycast < 50) return; // 20fps max
  lastRaycast = now;
  // Raycast here
}

// Use simpler collision mesh
const collisionMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ visible: false }),
);
collisionMesh.userData.target = complexMesh;
clickables.push(collisionMesh);
```

## See Also

- `threejs-fundamentals` - Camera and scene setup
- `threejs-animation` - Animating interactions
- `threejs-shaders` - Visual feedback effects
