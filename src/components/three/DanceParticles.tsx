'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpriteData {
  sprite: THREE.Sprite;
  vx: number;
  vy: number;
  floatAmp: number;
  floatSpeed: number;
  floatOffset: number;
  rotSpeed: number;
}

interface SourceConfig {
  url: string;
  count: number;
  minS: number;
  maxS: number;
  minO: number;
  maxO: number;
}

const SOURCES: SourceConfig[] = [
  { url: '/logo/Detalii%20basarabs4.png', count: 16, minS: 0.35, maxS: 0.75, minO: 0.28, maxO: 0.58 },
  { url: '/logo/Detalii%20basarabs2.png', count: 14, minS: 0.4,  maxS: 0.85, minO: 0.22, maxO: 0.5  },
  { url: '/logo/Detalii%20basarabs5.png', count: 14, minS: 0.28, maxS: 0.58, minO: 0.28, maxO: 0.58 },
  { url: '/logo/Detalii%20basarabs6.png', count: 14, minS: 0.35, maxS: 0.65, minO: 0.22, maxO: 0.5  },
  { url: '/logo/Detalii%20basarabs7.png', count: 12, minS: 0.42, maxS: 0.88, minO: 0.2,  maxO: 0.46 },
];

const BOUNDS_X = 13;
const BOUNDS_Y = 8;

/* Re-use downloads across mounts (Cache backs ImageLoader) */
THREE.Cache.enabled = true;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function loadTransparentTexture(loader: THREE.ImageLoader, url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (img) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('no 2d context')); return; }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 230 && d[i + 1] > 230 && d[i + 2] > 230) d[i + 3] = 0;
        }
        ctx.putImageData(imageData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

export default function DanceParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const sprites: SpriteData[] = [];
    const textures: THREE.Texture[] = [];
    let rafId = 0;
    let destroyed = false;

    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    function spawnSprites(texture: THREE.Texture, cfg: SourceConfig) {
      const img = texture.image as HTMLCanvasElement;
      const aspect = img.height / img.width;
      for (let i = 0; i < cfg.count; i++) {
        const mat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: rand(cfg.minO, cfg.maxO),
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(mat);
        const s = rand(cfg.minS, cfg.maxS);
        sprite.scale.set(s, s * aspect, 1);
        sprite.position.set(rand(-BOUNDS_X, BOUNDS_X), rand(-BOUNDS_Y, BOUNDS_Y), rand(-3, 1));
        mat.rotation = rand(0, Math.PI * 2);
        scene.add(sprite);

        sprites.push({
          sprite,
          vx: rand(-0.003, 0.003),
          vy: rand(0.004, 0.009),
          floatAmp: rand(0.003, 0.009),
          floatSpeed: rand(0.3, 0.7),
          floatOffset: rand(0, Math.PI * 2),
          rotSpeed: rand(-0.005, 0.005),
        });
      }
    }

    async function loadAll() {
      const manager = new THREE.LoadingManager();
      manager.onError = (url) => console.warn(`DanceParticles: failed to load ${url}`);
      const loader = new THREE.ImageLoader(manager);

      const results = await Promise.allSettled(
        SOURCES.map((src) => loadTransparentTexture(loader, src.url)),
      );
      results.forEach((result, i) => {
        if (result.status !== 'fulfilled') return;
        if (destroyed) {
          result.value.dispose();
          return;
        }
        textures.push(result.value);
        spawnSprites(result.value, SOURCES[i]);
      });
    }

    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

      // Gentle camera parallax
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, smoothMouse.x * 1.2, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, smoothMouse.y * 0.7, 0.03);

      for (const d of sprites) {
        d.sprite.position.x += d.vx + Math.sin(elapsed * d.floatSpeed + d.floatOffset) * d.floatAmp;
        d.sprite.position.y += d.vy;
        (d.sprite.material as THREE.SpriteMaterial).rotation += d.rotSpeed;

        if (d.sprite.position.y > BOUNDS_Y + 1.5) {
          d.sprite.position.y = -BOUNDS_Y - 1.5;
          d.sprite.position.x = rand(-BOUNDS_X, BOUNDS_X);
          (d.sprite.material as THREE.SpriteMaterial).rotation = rand(0, Math.PI * 2);
        }
        if (d.sprite.position.x > BOUNDS_X + 1.5) d.sprite.position.x = -BOUNDS_X - 1.5;
        if (d.sprite.position.x < -BOUNDS_X - 1.5) d.sprite.position.x = BOUNDS_X + 1.5;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    loadAll();

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      for (const d of sprites) (d.sprite.material as THREE.SpriteMaterial).dispose();
      for (const t of textures) t.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
