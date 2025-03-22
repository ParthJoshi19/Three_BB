import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text,GradientTexture, Wireframe } from "@react-three/drei"
import { gsap } from "gsap"
import * as THREE from "three"



export function Card3D({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 1,
  height = 1.5,
  depth = 0.05,
  textColor = "#111111",
  title,
  content,
}) {
  const meshRef = useRef(null)
  const groupRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const handleHover = (hovering) => {
    setHovered(hovering)

    if (!groupRef.current) return

    gsap.to(groupRef.current.rotation, {
      y: hovering ? rotation[1] + 0.2 : rotation[1],
      z: hovering ? rotation[2] + 0.05 : rotation[2],
      duration: 0.5,
      ease: "power2.out",
    })

    gsap.to(groupRef.current.position, {
      y: hovering ? position[1] + 0.1 : position[1],
      duration: 0.5,
      ease: "power2.out",
    })
  }

  useFrame((state) => {
    if (!groupRef.current || hovered) return

    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.03
    groupRef.current.rotation.z = rotation[2] + Math.sin(t * 1) * 0.02
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={() => handleHover(true)}
      onPointerOut={() => handleHover(false)}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <ambientLight intensity={2} />
        <meshStandardMaterial>
          <GradientTexture attach="map" stops={[0, 1]} colors={['#FFFFFF']} />
        </meshStandardMaterial>
      </mesh>

      <Text
        position={[0, height / 3, depth / 2 + 0.01]}
        fontSize={0.12}
        color={textColor}
        anchorX="center"
        anchorY="middle"
  
      >
        {title}
      </Text>

      <Text
        position={[0, 0, depth / 2 + 0.01]}
        fontSize={0.08}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.8}
        textAlign="center"
      >
        {content}
      </Text>
    </group>
  )
}

