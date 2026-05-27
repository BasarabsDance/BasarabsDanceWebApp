---
name: threejs-loaders
description: Three.js asset loading - GLTF, textures, images, models, async patterns. Use when loading 3D models, textures, HDR environments, or managing loading progress.
---

# Three.js Loaders

## Quick Start

```javascript
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("model.glb", (gltf) => {
  scene.add(gltf.scene);
});

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("texture.jpg");
```

## LoadingManager

```javascript
const manager = new THREE.LoadingManager();

manager.onStart = (url, loaded, total) => console.log(`Started: ${url}`);
manager.onLoad = () => console.log("All loaded!");
manager.onProgress = (url, loaded, total) => {
  const progress = (loaded / total) * 100;
  updateProgressBar(progress);
};
manager.onError = (url) => console.error(`Error: ${url}`);

const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);
```

## Texture Loading

```javascript
const loader = new THREE.TextureLoader();

loader.load("texture.jpg", (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
});
```

## HDR/EXR Loading

```javascript
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

const rgbeLoader = new RGBELoader();
rgbeLoader.load("environment.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});
```

## GLTF/GLB Loading

```javascript
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

loader.load("model.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const animations = gltf.animations;
  if (animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    animations.forEach((clip) => mixer.clipAction(clip).play());
  }
});
```

### GLTF with Draco Compression

```javascript
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
dracoLoader.preload();

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("compressed-model.glb", (gltf) => scene.add(gltf.scene));
```

### Process GLTF Content

```javascript
loader.load("model.glb", (gltf) => {
  const model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Center and scale
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  model.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  model.scale.setScalar(1 / maxDim);

  scene.add(model);
});
```

## Other Model Formats

### OBJ + MTL

```javascript
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

const mtlLoader = new MTLLoader();
mtlLoader.load("model.mtl", (materials) => {
  materials.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("model.obj", (object) => scene.add(object));
});
```

### FBX

```javascript
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

const loader = new FBXLoader();
loader.load("model.fbx", (object) => {
  object.scale.setScalar(0.01);
  const mixer = new THREE.AnimationMixer(object);
  object.animations.forEach((clip) => mixer.clipAction(clip).play());
  scene.add(object);
});
```

## Async/Promise Loading

```javascript
function loadModel(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });
}

async function loadAssets() {
  const [modelGltf, envTexture, colorTexture] = await Promise.all([
    loadGLTF("model.glb"),
    loadRGBE("environment.hdr"),
    loadTexture("color.jpg"),
  ]);

  scene.add(modelGltf.scene);
  scene.environment = envTexture;
  material.map = colorTexture;
}
```

## Loading from ArrayBuffer

```javascript
const response = await fetch("model.glb");
const buffer = await response.arrayBuffer();

const loader = new GLTFLoader();
loader.parse(buffer, "", (gltf) => {
  scene.add(gltf.scene);
});
```

## Error Handling

```javascript
async function loadWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadModel(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## Caching

```javascript
THREE.Cache.enabled = true;
THREE.Cache.clear();
```

## Performance Tips

1. **Use compressed formats**: DRACO for geometry, KTX2/Basis for textures
2. **Load progressively**: Show placeholders while loading
3. **Lazy load**: Only load what's needed
4. **Use CDN**: Faster asset delivery
5. **Enable cache**: `THREE.Cache.enabled = true`

## See Also

- `threejs-textures` - Texture configuration
- `threejs-animation` - Playing loaded animations
- `threejs-materials` - Material from loaded models
