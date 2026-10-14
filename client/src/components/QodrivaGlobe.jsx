
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Globe from "r3f-globe";
import "./QodrivaGlobe.css";

function RotatingGlobe() {
  const rotationRef = useRef();

  useFrame((_, delta) => {
    if (rotationRef.current) {
      rotationRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={rotationRef} scale={0.85}>
      <Globe
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere
        atmosphereColor="#35dcff"
        atmosphereAltitude={0.16}
      />
    </group>
  );
}

export default function QodrivaGlobe() {
  return (
    <div className="qodriva-globe">
      <Canvas
        camera={{ position: [0, 0, 260], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[5, 3, 5]}
          intensity={2}
          color="#71eaff"
        />
        <Suspense fallback={null}>
          <RotatingGlobe />
        </Suspense>
      </Canvas>
    </div>
  );
}
