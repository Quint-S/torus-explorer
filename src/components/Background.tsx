import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {GLSL3} from "three";

const shader = {
  uniforms: {
    r: { value: new THREE.Vector2() }, // resolution
    m: { value: new THREE.Vector2() }, // mouse
    t: { value: 0.0 },
    f: { value: 0.0 },
    s: { value: 0.0 },
    b: { value: null },
  },
  vertexShader: `precision highp float;
    in vec3 position;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `#define FC gl_FragCoord
    precision highp float;
    uniform vec2 r;
    uniform vec2 m;
    uniform float t;
    uniform float f;
    uniform float s;
    uniform sampler2D b;
    out vec4 o;
    
    mat2 rotate2D(float angle) {
      return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
    }
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.5 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.5, 1.6)), f.x), f.y);
    }
    
    void main() {
      #define R rotate2D
      vec2 p=FC.xy,q,l=(p+p-r)/r.x*.9,n;float s=5.,h,i,L=dot(l,l),e=129.;for(;i++<e;)l*=R(4.95),n*=R(4.8+sin(t)*.05)+rotate2D(t)*.035,h+=dot(r/r,sin(q=l*s*i+n)/s*3.5),n+=cos(q),s*=1.07;h=.4-h*.3-L;
      
      vec2 uv = FC.xy / r.xy;
      float grain = noise(uv * 900.0 + t * 0.5) * 0.15;
      float scanlines = sin(uv.y * r.y * 0.25) * 0.01;
      
      vec3 color = h * vec3(0.15, 0.25, 0.75);
      color = floor(color * 4.0) / 4.0;
      
      color += grain;
      color += scanlines;
      
      float vignette = 1.0 - length(uv - 0.9) * 0.8;
      color *= vignette;
      
      o.rgb += color;
    }
  `,
  glslVersion: GLSL3
};

const Background: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.0, 0.0));

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      ...shader,
      uniforms: {
        ...shader.uniforms,
        r: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        m: { value: mouseRef.current },
        t: { value: 0.0 },
        f: { value: 0.0 },
        s: { value: 0.0 },
        b: { value: null },
        modelViewMatrix: { value: new THREE.Matrix4() },
        projectionMatrix: { value: new THREE.Matrix4() }
      }
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = (event.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (event.clientY - rect.top) / rect.height; // Flip Y
    };

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.006; // ~60fps
      material.uniforms.t.value = time;
      material.uniforms.r.value.set(window.innerWidth, window.innerHeight);

      mesh.updateMatrixWorld();
      material.uniforms.modelViewMatrix.value.multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld);
      material.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
      
      renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.r.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1
  }} />;
};

export default Background;