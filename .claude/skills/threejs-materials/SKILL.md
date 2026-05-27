---
name: threejs-materials
description: Three.js materials - PBR, basic, phong, shader materials, material properties. Use when styling meshes, working with textures, creating custom shaders, or optimizing material performance.
---

# Three.js Materials

## Quick Start

```javascript
import * as THREE from "three";

// PBR material (recommended for realistic rendering)
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.5,
  metalness: 0.5,
});

const mesh = new THREE.Mesh(geometry, material);
```

## Material Types Overview

| Material             | Use Case                              | Lighting           |
| -------------------- | ------------------------------------- | ------------------ |
| MeshBasicMaterial    | Unlit, flat colors, wireframes        | No                 |
| MeshLambertMaterial  | Matte surfaces, performance           | Yes (diffuse only) |
| MeshPhongMaterial    | Shiny surfaces, specular highlights   | Yes                |
| MeshStandardMaterial | PBR, realistic materials              | Yes (PBR)          |
| MeshPhysicalMaterial | Advanced PBR, clearcoat, transmission | Yes (PBR+)         |
| MeshToonMaterial     | Cel-shaded, cartoon look              | Yes (toon)         |
| MeshNormalMaterial   | Debug normals                         | No                 |
| MeshDepthMaterial    | Depth visualization                   | No                 |
| ShaderMaterial       | Custom GLSL shaders                   | Custom             |
| RawShaderMaterial    | Full shader control                   | Custom             |

## MeshBasicMaterial

```javascript
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
  wireframe: false,
  map: texture,
  alphaMap: alphaTexture,
  envMap: envTexture,
  reflectivity: 1,
  fog: true,
});
```

## MeshStandardMaterial (PBR)

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.0,

  map: colorTexture,
  roughnessMap: roughTexture,
  metalnessMap: metalTexture,
  normalMap: normalTexture,
  normalScale: new THREE.Vector2(1, 1),
  aoMap: aoTexture,
  aoMapIntensity: 1,
  displacementMap: dispTexture,
  displacementScale: 0.1,

  emissive: 0x000000,
  emissiveIntensity: 1,
  emissiveMap: emissiveTexture,

  envMap: envTexture,
  envMapIntensity: 1,
});

// Note: aoMap requires second UV channel
geometry.setAttribute("uv2", geometry.attributes.uv);
```

## MeshPhysicalMaterial (Advanced PBR)

```javascript
const material = new THREE.MeshPhysicalMaterial({
  // Clearcoat (car paint, lacquer)
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,

  // Transmission (glass, water)
  transmission: 1.0,
  thickness: 0.5,
  ior: 1.5,

  // Sheen (fabric, velvet)
  sheen: 1.0,
  sheenRoughness: 0.5,
  sheenColor: new THREE.Color(0xffffff),

  // Iridescence (soap bubbles, oil slicks)
  iridescence: 1.0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
});
```

### Glass Material Example

```javascript
const glass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  thickness: 0.5,
  ior: 1.5,
  envMapIntensity: 1,
});
```

## MeshToonMaterial

```javascript
const material = new THREE.MeshToonMaterial({
  color: 0x00ff00,
  gradientMap: gradientTexture,
});

// Create step gradient texture
const colors = new Uint8Array([0, 128, 255]);
const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;
gradientMap.needsUpdate = true;
```

## ShaderMaterial

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
    texture1: { value: texture },
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float time;

    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 10.0 + time) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color;
    uniform sampler2D texture1;

    void main() {
      vec4 texColor = texture2D(texture1, vUv);
      gl_FragColor = vec4(color * texColor.rgb, 1.0);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

// Update uniform in animation loop
material.uniforms.time.value = clock.getElapsedTime();
```

## Common Material Properties

```javascript
material.visible = true;
material.transparent = false;
material.opacity = 1.0;
material.alphaTest = 0;
material.side = THREE.FrontSide;
material.depthTest = true;
material.depthWrite = true;
material.blending = THREE.NormalBlending;
material.polygonOffset = false;
material.polygonOffsetFactor = 0;
material.polygonOffsetUnits = 0;
```

## Environment Maps

```javascript
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
const rgbeLoader = new RGBELoader();
rgbeLoader.load("environment.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});
```

## Performance Tips

1. **Reuse materials**: Same material = batched draw calls
2. **Avoid transparent when possible**: Transparent materials require sorting
3. **Use alphaTest instead of transparency**: When applicable, faster
4. **Choose simpler materials**: Basic > Lambert > Phong > Standard > Physical
5. **Limit active lights**: Each light adds shader complexity

```javascript
material.dispose();
```

## See Also

- `threejs-textures` - Texture loading and configuration
- `threejs-shaders` - Custom shader development
- `threejs-lighting` - Light interaction with materials
