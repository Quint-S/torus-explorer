import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';


const grainShader = {
    uniforms: {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      baseColor: { value: new THREE.Vector3(0.0, 0.9, 1.0) } // Add color control (purple-ish)
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 baseColor; // Add color uniform
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv * resolution;
        
        // More intense grain effect
        float grain = random(uv + time) * 0.8; 
        grain += random(uv * 2.0 + time) * 0.4; 
        
        // Base color with grain effect
        vec3 color = baseColor;
        color -= grain * 0.6; 
        
        // More pronounced blur effect
        float blur = 0.005;
        color += random(uv + vec2(blur, 0.0)) * 0.2;
        color += random(uv + vec2(0.0, blur)) * 0.2;
        color += random(uv - vec2(blur, 0.0)) * 0.2;
        color += random(uv - vec2(0.0, blur)) * 0.2;
        color *= 1.5;
        
        gl_FragColor = vec4(color, 0.15);
      }
    `
  };

const ThreeJsTorus: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true // Make background transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

        
    // Torus geometry
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   wireframe: true,
    //   transparent: true,
    //   opacity: 0.3
    // });
    const material = new THREE.ShaderMaterial({
        ...grainShader,
        wireframe: true,
        transparent: true,
        uniforms: {
            ...grainShader.uniforms,
            baseColor: { value: new THREE.Vector3(0.9,0.1,1)}
        }
      });
    const torus = new THREE.Mesh(geometry, material);
    const nn = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
        ...grainShader,
        wireframe: true,
        transparent: true,
        uniforms: {
            ...grainShader.uniforms,
            baseColor: { value: new THREE.Vector3(0.0,0.5,0.9)},
            // baseColor: { value: new THREE.Vector3(108/255,1,185/255)}

        }
    }));

    scene.add(torus);
    scene.add(nn);
    nn.translateZ(0.01)
    // // Lighting
    // const ambientLight = new THREE.AmbientLight(0x00ff00);
    // scene.add(ambientLight);
    // const pointLight = new THREE.PointLight(0xffffff, 1, 0);
    // pointLight.position.set(25, 25, 25);
    // pointLight.lookAt(torus.position);
    // scene.add(pointLight);

    // Camera position
    // camera.position.z = 3;
    camera.rotateX(90);
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      camera.rotateY(0.001);
            // Update shader time uniform
            time += 0.01;
            material.uniforms.time.value = time;
            material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
            
            renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1 // Place behind other content
  }} />;
};
// function getIntermediatePoint(
//   pointA: THREE.Vector3,
//   pointB: THREE.Vector3,
//   percentage: number
// ): THREE.Vector3 {
//   // Create a new vector to store the result
//   const pointC = new THREE.Vector3();
  
//   // Calculate the difference between points
//   const difference = new THREE.Vector3().subVectors(pointB, pointA);
  
//   // Multiply the difference by the percentage
//   difference.multiplyScalar(percentage);
  
//   // Add the scaled difference to pointA
//   pointC.addVectors(pointA, difference);
  
//   return pointC;
// }

export default ThreeJsTorus;