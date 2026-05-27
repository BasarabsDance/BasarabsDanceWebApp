---
name: threejs-animation
description: Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. Use when animating objects, playing GLTF animations, creating procedural motion, or blending animations.
---

# Three.js Animation

## Quick Start

```javascript
import * as THREE from "three";

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  mesh.rotation.y += delta;
  mesh.position.y = Math.sin(elapsed) * 0.5;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

## Animation System Overview

Three.js animation system has three main components:

1. **AnimationClip** - Container for keyframe data
2. **AnimationMixer** - Plays animations on a root object
3. **AnimationAction** - Controls playback of a clip

## AnimationClip

```javascript
const times = [0, 1, 2];
const values = [0, 1, 0];

const track = new THREE.NumberKeyframeTrack(".position[y]", times, values);
const clip = new THREE.AnimationClip("bounce", 2, [track]);
```

### KeyframeTrack Types

```javascript
new THREE.NumberKeyframeTrack(".opacity", times, [1, 0]);

new THREE.VectorKeyframeTrack(".position", times, [
  0, 0, 0,
  1, 2, 0,
  0, 0, 0,
]);

const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
new THREE.QuaternionKeyframeTrack(
  ".quaternion",
  [0, 1],
  [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w],
);

new THREE.ColorKeyframeTrack(".material.color", times, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
```

## AnimationMixer

```javascript
const mixer = new THREE.AnimationMixer(model);

const action = mixer.clipAction(clip);
action.play();

function animate() {
  const delta = clock.getDelta();
  mixer.update(delta); // Required!

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

## AnimationAction

```javascript
const action = mixer.clipAction(clip);

action.play();
action.stop();
action.reset();

action.time = 0.5;
action.timeScale = 1;
action.paused = false;
action.weight = 1;

action.loop = THREE.LoopRepeat;    // Default
action.loop = THREE.LoopOnce;     // Play once
action.loop = THREE.LoopPingPong; // Alternate
action.repetitions = 3;
action.clampWhenFinished = true;
```

### Fade In/Out

```javascript
action.reset().fadeIn(0.5).play();
action.fadeOut(0.5);

// Crossfade
action1.play();
action1.crossFadeTo(action2, 0.5, true);
action2.play();
```

## Loading GLTF Animations

```javascript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("model.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  if (clips.length > 0) {
    mixer.clipAction(clips[0]).play();
  }

  const walkClip = THREE.AnimationClip.findByName(clips, "Walk");
  if (walkClip) mixer.clipAction(walkClip).play();

  window.mixer = mixer;
});

function animate() {
  const delta = clock.getDelta();
  if (window.mixer) window.mixer.update(delta);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

## Skeletal Animation

```javascript
const skinnedMesh = model.getObjectByProperty("type", "SkinnedMesh");
const skeleton = skinnedMesh.skeleton;

skeleton.bones.forEach((bone) => console.log(bone.name));

const headBone = skeleton.bones.find((b) => b.name === "Head");
if (headBone) headBone.rotation.y = Math.PI / 4;

// Skeleton helper
const helper = new THREE.SkeletonHelper(model);
scene.add(helper);
```

## Morph Targets

```javascript
// Access morph targets
mesh.morphTargetInfluences[0] = 0.5;

const smileIndex = mesh.morphTargetDictionary["smile"];
mesh.morphTargetInfluences[smileIndex] = 1;

// Keyframe animation
const track = new THREE.NumberKeyframeTrack(
  ".morphTargetInfluences[smile]",
  [0, 0.5, 1],
  [0, 1, 0],
);
const clip = new THREE.AnimationClip("smile", 1, [track]);
mixer.clipAction(clip).play();
```

## Animation Blending

```javascript
const idleAction = mixer.clipAction(idleClip);
const walkAction = mixer.clipAction(walkClip);
const runAction = mixer.clipAction(runClip);

idleAction.play();
walkAction.play();
runAction.play();

idleAction.setEffectiveWeight(1);
walkAction.setEffectiveWeight(0);
runAction.setEffectiveWeight(0);

function updateAnimations(speed) {
  if (speed < 0.1) {
    idleAction.setEffectiveWeight(1);
    walkAction.setEffectiveWeight(0);
    runAction.setEffectiveWeight(0);
  } else if (speed < 5) {
    const t = speed / 5;
    idleAction.setEffectiveWeight(1 - t);
    walkAction.setEffectiveWeight(t);
    runAction.setEffectiveWeight(0);
  } else {
    const t = Math.min((speed - 5) / 5, 1);
    idleAction.setEffectiveWeight(0);
    walkAction.setEffectiveWeight(1 - t);
    runAction.setEffectiveWeight(t);
  }
}
```

## Procedural Animation Patterns

### Spring Physics

```javascript
class Spring {
  constructor(stiffness = 100, damping = 10) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.position = 0;
    this.velocity = 0;
    this.target = 0;
  }

  update(dt) {
    const force = -this.stiffness * (this.position - this.target);
    const dampingForce = -this.damping * this.velocity;
    this.velocity += (force + dampingForce) * dt;
    this.position += this.velocity * dt;
    return this.position;
  }
}

const spring = new Spring(100, 10);
spring.target = 1;
```

### Oscillation

```javascript
function animate() {
  const t = clock.getElapsedTime();
  mesh.position.y = Math.sin(t * 2) * 0.5;
  mesh.position.x = Math.cos(t) * 2;
  mesh.position.z = Math.sin(t) * 2;
}
```

## Performance Tips

1. **Share clips**: Same AnimationClip can be used on multiple mixers
2. **Optimize clips**: Call `clip.optimize()` to remove redundant keyframes
3. **Disable when off-screen**: Stop mixer updates for invisible objects
4. **Use LOD for animations**: Simpler rigs for distant characters
5. **Limit active mixers**: Each mixer.update() has a cost

## See Also

- `threejs-loaders` - Loading animated GLTF models
- `threejs-fundamentals` - Clock and animation loop
- `threejs-shaders` - Vertex animation in shaders
