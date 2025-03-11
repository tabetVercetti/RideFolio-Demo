import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Canvas, useFrame} from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';
import './App.css'

function AnimatedBox(){
  const boxRef = useRef();

  const {color, speed} = useControls({
    color: 'gold',
    speed: {
      value: 0.005,
      min: 0.0,
      max: 0.03,
      step: 0.001
    }
  })
  useFrame (()=> {
    boxRef.current.rotation.x += speed;
    boxRef.current.rotation.y += speed;
    boxRef.current.rotation.z += speed;

  });
  return(
    <mesh ref={boxRef}>
      <boxGeometry args={[2,3,2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
function Ground(){
  return(
    <mesh position-y={-2} rotation-x={-Math.PI*0.5}>
      <planeGeometry args={[30,30]}/>
      <meshPhysicalMaterial color='red' />
    </mesh>
  )
}


function App() {
  return (
    <div id="canvas-container">
      <Canvas >
        <OrbitControls/>
        <AnimatedBox/>
        <Ground/>
        <directionalLight position={[2,5,2]} />
      </Canvas>
    </div>
  )
}

export default App
