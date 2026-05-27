---
name: threejs-textures
description: Three.js textures - texture types, UV mapping, environment maps, texture settings. Use when working with images, UV coordinates, cubemaps, HDR environments, or texture optimization.
---

# Three.js Textures

## Quick Start

```javascript
import * as THREE from "three";

const loader = new THREE.TextureLoader();
const texture = loader.load("texture.jpg");

const material = new THREE.MeshStandardMaterial({
  map: texture,
});
```

## Texture Loading

### Basic Loading

```javascript
const loader = new THREE.TextureLoader();

loader.load(
  "texture.jpg",
  (texture) => console.log("Loaded"),
  (progress) => console.log("Progress"),
  (error) => console.error("Error"),
);

const texture = loader.load("texture.jpg");
material.map = texture;
```

### Promise Wrapper

```javascript
function loadTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, reject);
  });
}

const [colorMap, normalMap, roughnessMap] = await Promise.all([
  loadTexture("color.jpg"),
  loadTexture("normal.jpg"),
  loadTexture("roughness.jpg"),
]);
```

## Texture Configuration

### Color Space

```javascript
// Color/albedo textures - use sRGB
colorTexture.colorSpace = THREE.SRGBColorSpace;
// Data textures (normal, roughness, metalness, AO) - leave as default (NoColorSpace)
```

### Wrapping Modes

```javascript
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
// ClampToEdgeWrapping, RepeatWrapping, MirroredRepeatWrapping
```

### Repeat, Offset, Rotation

```javascript
texture.repeat.set(4, 4);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

texture.offset.set(0.5, 0.5);
texture.rotation = Math.PI / 4;
texture.center.set(0.5, 0.5);
```

### Filtering

```javascript
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
```

## Texture Types

### Data Texture

```javascript
const size = 256;
const data = new Uint8Array(size * size * 4);
for (let i = 0; i < size * size; i++) {
  const value = Math.random() * 255;
  data[i * 4] = value;
  data[i * 4 + 1] = value;
  data[i * 4 + 2] = value;
  data[i * 4 + 3] = 255;
}

const texture = new THREE.DataTexture(data, size, size);
texture.needsUpdate = true;
```

### Canvas Texture

```javascript
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 256, 256);

const texture = new THREE.CanvasTexture(canvas);
texture.needsUpdate = true;
```

### Video Texture

```javascript
const video = document.createElement("video");
video.src = "video.mp4";
video.loop = true;
video.muted = true;
video.play();

const texture = new THREE.VideoTexture(video);
texture.colorSpace = THREE.SRGBColorSpace;
```

## Cube Textures

```javascript
const loader = new THREE.CubeTextureLoader();
const cubeTexture = loader.load([
  "px.jpg", "nx.jpg",
  "py.jpg", "ny.jpg",
  "pz.jpg", "nz.jpg",
]);

scene.background = cubeTexture;
scene.environment = cubeTexture;
```

## HDR Textures

```javascript
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load("environment.hdr", (texture) => {
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.environment = envMap;
  scene.background = envMap;
  texture.dispose();
  pmremGenerator.dispose();
});
```

## Render Targets

```javascript
const renderTarget = new THREE.WebGLRenderTarget(512, 512, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

renderer.setRenderTarget(renderTarget);
renderer.render(scene, camera);
renderer.setRenderTarget(null);

material.map = renderTarget.texture;
```

## UV Mapping

```javascript
const uvs = geometry.attributes.uv;
const u = uvs.getX(vertexIndex);
const v = uvs.getY(vertexIndex);
uvs.setXY(vertexIndex, newU, newV);
uvs.needsUpdate = true;

// Second UV channel for AO maps
geometry.setAttribute("uv2", geometry.attributes.uv);
```

## PBR Texture Set

```javascript
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,           // sRGB
  normalMap: normalTexture,    // Linear
  normalScale: new THREE.Vector2(1, 1),
  roughnessMap: roughnessTexture, // Linear, grayscale
  roughness: 1,
  metalnessMap: metalnessTexture, // Linear, grayscale
  metalness: 1,
  aoMap: aoTexture,           // Linear, uses uv2
  aoMapIntensity: 1,
  emissiveMap: emissiveTexture, // sRGB
  emissive: 0xffffff,
  displacementMap: displacementTexture, // Linear
  displacementScale: 0.1,
  alphaMap: alphaTexture,
  transparent: true,
});

geometry.setAttribute("uv2", geometry.attributes.uv);
```

## Texture Memory Management

```javascript
texture.dispose();

function disposeMaterial(material) {
  const maps = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap",
    "emissiveMap", "displacementMap", "alphaMap", "envMap"];
  maps.forEach((mapName) => {
    if (material[mapName]) material[mapName].dispose();
  });
  material.dispose();
}
```

## Performance Tips

1. **Use power-of-2 dimensions**: 256, 512, 1024, 2048
2. **Compress textures**: KTX2/Basis for web delivery
3. **Use texture atlases**: Reduce texture switches
4. **Enable mipmaps**: For distant objects
5. **Limit texture size**: 2048 usually sufficient for web

## See Also

- `threejs-materials` - Applying textures to materials
- `threejs-loaders` - Loading texture files
- `threejs-shaders` - Custom texture sampling
