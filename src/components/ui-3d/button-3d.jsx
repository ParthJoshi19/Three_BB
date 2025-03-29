import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { GradientTexture, Html, Text } from "@react-three/drei"
import { useSpring, animated } from "@react-spring/three"
import { gsap } from "gsap"
import * as THREE from "three"


export function Button3D({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  width = 1,
  height = 0.3,
  depth = 0.1,
  label,
  color = "#00FFFF",
  hoverColor = "#6366F1",
  textColor = "#FFFFFF",
  onClick,
  lableY
}) {
  const meshRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animation with react-spring
  const { buttonScale } = useSpring({
    buttonScale: clicked ? 0.9 : hovered ? 1.05 : 1,
    config: { mass: 1, tension: 280, friction: 20 },
  })

  // GSAP animation for click effect
  const handleClick = () => {
    if (!meshRef.current) return

    setClicked(true)

    gsap.to(meshRef.current.position, {
      y: position[1] - 0.05,
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(meshRef.current.position, {
          y: position[1],
          duration: 0.2,
          ease: "bounce.out",
          onComplete: () => {
            setClicked(false)
            if (onClick) onClick()
          },
        })
      },
    })
  }

  useFrame((state) => {
    if (!meshRef.current || clicked) return

    const t = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02
  })
  console.log(lableY)
  return (
    <animated.group
      position={position}
      rotation={rotation}
      scale={buttonScale.to((s) => [s * scale[0], s * scale[1], s * scale[2]])}
    >
      <mesh
  ref={meshRef}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
  onPointerDown={handleClick}
  castShadow
>
  <boxGeometry args={[width, height, depth]} />
  
  {/* Apply Gradient Material */}
  <meshStandardMaterial roughness={0.3} metalness={0.2}>
    <GradientTexture
      attach="map"
      stops={[0, 1]} 
      colors={["#e713df", hovered ? "#e713df" : "#0052ff"]} 
      size={1024}
    />
  </meshStandardMaterial>
</mesh>
      
      <Text position={[0, lableY, depth / 2 + 0.01]} fontSize={0.1} color={textColor}>
        {label}
      </Text>
    </animated.group>
  )
}

