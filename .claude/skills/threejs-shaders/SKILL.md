---
name: threejs-shaders
description: Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials.
---

# Three.js Shaders

## Quick Start

```javascript
import * as THREE from "three";

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

material.uniforms.time.value = clock.getElapsedTime();
```

## ShaderMaterial vs RawShaderMaterial

### ShaderMaterial

Three.js provides built-in uniforms and attributes automatically.

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    // Built-in: projectionMatrix, modelViewMatrix, modelMatrix, viewMatrix
    // normalMatrix, cameraPosition
    // Attributes: position, normal, uv

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

### RawShaderMaterial

Full control - you define everything.

```javascript
const material = new THREE.RawShaderMaterial({
  uniforms: {
    projectionMatrix: { value: camera.projectionMatrix },
    modelViewMatrix: { value: new THREE.Matrix4() },
  },
  vertexShader: `
    precision highp float;
    attribute vec3 position;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `,
});
```

## Uniforms

### Uniform Types

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    floatValue: { value: 1.5 },
    vec2Value: { value: new THREE.Vector2(1, 2) },
    vec3Value: { value: new THREE.Vector3(1, 2, 3) },
    colorValue: { value: new THREE.Color(0xff0000) },
    mat4Value: { value: new THREE.Matrix4() },
    textureValue: { value: texture },
    cubeTextureValue: { value: cubeTexture },
    floatArray: { value: [1.0, 2.0, 3.0] },
  },
});
```

### Updating Uniforms

```javascript
material.uniforms.time.value = clock.getElapsedTime();
material.uniforms.position.value.set(x, y, z);
material.uniforms.color.value.setHSL(hue, 1, 0.5);
material.uniforms.matrix.value.copy(mesh.matrixWorld);
```

## Common Shader Patterns

### Texture Sampling

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: { map: { value: texture } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(map, vUv);
    }
  `,
});
```

### Vertex Displacement

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    amplitude: { value: 0.5 },
  },
  vertexShader: `
    uniform float time;
    uniform float amplitude;

    void main() {
      vec3 pos = position;
      pos.z += sin(pos.x * 5.0 + time) * amplitude;
      pos.z += sin(pos.y * 5.0 + time) * amplitude;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    }
  `,
});
```

### Fresnel Effect

```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

      vec3 baseColor = vec3(0.0, 0.0, 0.5);
      vec3 fresnelColor = vec3(0.5, 0.8, 1.0);
      gl_FragColor = vec4(mix(baseColor, fresnelColor, fresnel), 1.0);
    }
  `,
});
```

### Noise Function

```glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
```

### Dissolve Effect

```glsl
uniform float progress;
uniform sampler2D noiseMap;

void main() {
  float noise = texture2D(noiseMap, vUv).r;

  if (noise < progress) discard;

  float edge = smoothstep(progress, progress + 0.1, noise);
  vec3 edgeColor = vec3(1.0, 0.5, 0.0);
  vec3 baseColor = vec3(0.5);
  gl_FragColor = vec4(mix(edgeColor, baseColor, edge), 1.0);
}
```

## Extending Built-in Materials

### onBeforeCompile

```javascript
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

material.onBeforeCompile = (shader) => {
  shader.uniforms.time = { value: 0 };
  material.userData.shader = shader;

  shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    transformed.y += sin(position.x * 10.0 + time) * 0.1;
    `,
  );
};

if (material.userData.shader) {
  material.userData.shader.uniforms.time.value = clock.getElapsedTime();
}
```

## GLSL Built-in Functions

```glsl
// Math
abs(x), sign(x), floor(x), ceil(x), fract(x)
mod(x, y), min(x, y), max(x, y), clamp(x, min, max)
mix(a, b, t), step(edge, x), smoothstep(edge0, edge1, x)

// Trigonometry
sin(x), cos(x), tan(x), asin(x), acos(x), atan(y, x)
radians(degrees), degrees(radians)

// Vector
length(v), distance(p0, p1), dot(x, y), cross(x, y)
normalize(v), reflect(I, N), refract(I, N, eta)

// Texture
texture2D(sampler, coord)   // GLSL 1.0
textureCube(sampler, coord) // GLSL 1.0
// Use texture() in GLSL 3.0 (glslVersion: THREE.GLSL3)
```

## ShaderMaterial Properties

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: { /* ... */ },
  vertexShader: "/* ... */",
  fragmentShader: "/* ... */",
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide,
  depthTest: true,
  depthWrite: true,
  blending: THREE.NormalBlending,
  wireframe: false,
  extensions: {
    derivatives: true,    // For fwidth, dFdx, dFdy
    fragDepth: true,      // gl_FragDepth
    drawBuffers: true,    // Multiple render targets
    shaderTextureLOD: true,
  },
  glslVersion: THREE.GLSL3,
});
```

## Instanced Shaders

```javascript
const offsets = new Float32Array(instanceCount * 3);
geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));

const material = new THREE.ShaderMaterial({
  vertexShader: `
    attribute vec3 offset;
    void main() {
      vec3 pos = position + offset;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }
  `,
});
```

## Performance Tips

1. **Minimize uniforms**: Group related values into vectors
2. **Avoid conditionals**: Use mix/step instead of if/else
3. **Precalculate**: Move calculations to JS when possible
4. **Use textures**: For complex functions, use lookup tables

```glsl
// Instead of if/else, use:
color = mix(colorB, colorA, step(0.5, value));
```

## See Also

- `threejs-materials` - Built-in material types
- `threejs-postprocessing` - Full-screen shader effects
- `threejs-textures` - Texture sampling in shaders
