import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLSL3 } from "three";

const shader = {
  uniforms: {
    r: { value: new THREE.Vector2() },
    m: { value: new THREE.Vector2() },
    t: { value: 0.0 },
    f: { value: 0.0 },
    s: { value: 0.0 },
    b: { value: null },
    z: { value: 0.0 },
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
    uniform float z;
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
      vec2 p=FC.xy,q,l=(p+p-r)/r.x*z,n;float s=5.,h,i,L=dot(l,l),e=129.;for(;i++<e;)l*=R(4.95),n*=R(4.8+sin(t)*.05)+rotate2D(t)*.035,h+=dot(r/r,sin(q=l*s*i+n)/s*3.5),n+=cos(q),s*=1.07;h=.4-h*.3-L;
      
      vec2 uv = FC.xy / r.xy;

      vec3 color = h * vec3(0.15, 0.25, 0.75);
      color = floor(color * 8.0) / 4.0;
      
      float brightness = (color.r + color.g + color.b) / 3.0;
      float alpha = brightness;//smoothstep(0.02, 0.1, brightness);
      
      o.rgb = color;
      o.a = alpha;
    }
  `,
  glslVersion: GLSL3
};

const torusShader = {
  uniforms: {
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2() },
    mouse: { value: new THREE.Vector2() },
    backgroundTexture: { value: null },
    //160, 50, 128, 128
    torusRadius: { value: 160.0 },
    tubeRadius: { value: 50.0 },
    segments: { value: 128 },
    tubeSegments: { value: 128 }
  },
  vertexShader: `
    precision highp float;
    
    in vec3 position;
    in vec2 uv;
    in vec3 normal;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform float time;
    uniform float torusRadius;
    uniform float tubeRadius;
    
    out vec2 vUv;
    out vec3 vNormal;
    out vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      
      vec3 torusPosition = position;
      
      torusPosition += sin(time * 0.2 + uv.x * 10.0) * vec3(0.0, 0.0, 0.5);
      
      vWorldPosition = (modelMatrix * vec4(torusPosition, 1.0)).xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(torusPosition, 1.0);
    }
  `,
      fragmentShader: `
    precision highp float;
    
    in vec2 vUv;
    in vec3 vNormal;
    in vec3 vWorldPosition;
    
    uniform sampler2D backgroundTexture;
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    
    out vec4 fragColor;
    
    void main() {
      vec2 bgUv = vUv;
      
      // bgUv += sin(vUv * 10.0 + time * 0.5) * 0.02;
      // bgUv += cos(vUv * 15.0 + time * 0.3) * 0.01;
      
      vec4 bgSample = texture(backgroundTexture, bgUv);
      vec3 bgColor = bgSample.rgb;
      float bgAlpha = bgSample.a;
      
      vec3 lightDir = normalize(vec3(sin(time * 0.5), cos(time * 0.3), 1.0));
      float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
      float ambient = 0.6;
      
      vec3 color = bgColor * (diffuse + ambient);
      
      float depth = length(vWorldPosition) / 200.0;
      color *= 1.0 - depth * 0.1;
      
      float alpha = bgAlpha * (0.7 + diffuse * 0.3);
      alpha *= 1.0 - depth * 0.1;
      
      fragColor = vec4(color, alpha);
    }
  `,
  glslVersion: GLSL3
};

const Backgroundv2: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const zoomFactor = isMobile ? 0.5 : 0.9;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 200);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const res = 1024*2;
    const backgroundRenderTarget = new THREE.WebGLRenderTarget(res, res);
    const backgroundScene = new THREE.Scene();
    const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
    const backgroundMaterial = new THREE.RawShaderMaterial({
      ...shader,
      uniforms: {
        ...shader.uniforms,
        r: { value: new THREE.Vector2(res, res) },
        m: { value: new THREE.Vector2(0.5, 0.5) },
        t: { value: 0.0 },
        f: { value: 0.0 },
        s: { value: 0.0 },
        b: { value: null },
        z: { value: zoomFactor },
        modelViewMatrix: { value: new THREE.Matrix4() },
        projectionMatrix: { value: new THREE.Matrix4() }
      },
      transparent: true
    });

    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundScene.add(backgroundMesh);

    const torusGeometry = new THREE.TorusGeometry(160, 50, 128, 128);
    const torusMaterial = new THREE.RawShaderMaterial({
      ...torusShader,
      uniforms: {
        ...torusShader.uniforms,
        backgroundTexture: { value: backgroundRenderTarget.texture },
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    torusGeometry.scale(0.8, 0.8, 0.8);
    torusGeometry.rotateX(Math.PI / 1.6);
    torusGeometry.translate(0, 10,0 );

    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torusMesh);


    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.005;
      
      backgroundMaterial.uniforms.t.value = time;
      
      renderer.setRenderTarget(backgroundRenderTarget);
      renderer.render(backgroundScene, backgroundCamera);
      renderer.setRenderTarget(null);
      
      torusMaterial.uniforms.time.value = time;
  
      torusMesh.rotation.y += 0.00005;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
      const zoomFactor = isMobile ? 0.5 : 0.9;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      backgroundMaterial.uniforms.z.value = zoomFactor;
      torusMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      backgroundRenderTarget.dispose();
      backgroundGeometry.dispose();
      backgroundMaterial.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
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

export default Backgroundv2;