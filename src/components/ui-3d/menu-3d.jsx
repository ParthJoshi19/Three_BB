import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { gsap } from "gsap"
// import { useTheme } from "../../hooks/use-theme"
import * as THREE from "three"
import { useNavigate } from "react-router-dom"

export function Menu3D({


  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  items,
  onSelect,
  spacing = 0.3,
  itemWidth = 0.8,
  itemHeight = 0.2,
  itemDepth = 0.05,
}) {
  const groupRef = useRef(null)
  const [activeItem, setActiveItem] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
 
  const navigate = useNavigate();


  const handleSelect = (value) => {
    setActiveItem(value)
    if (onSelect) onSelect(value)

    if (!groupRef.current) return

    gsap.to(groupRef.current.position, {
      y: position[1] + 0.1,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(groupRef.current.position, {
          y: position[1],
          duration: 0.3,
          ease: "bounce.out",
        })
      },
    })
  }

  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.03
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.03
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {items.map((item, index) => {
        const isActive = activeItem === item.value
        const isHovered = hoveredItem === item.value
        const itemPosition = [0, -index * spacing, 0]

        return (
          <group key={item.value} position={itemPosition} onClick={() => navigate(`/${item.value==="home"?"home":item.value==="model"?"3dmodels":item.value==="3D shapes"?"shapes3d":item.value==="3D Models"?"3dmodels":item.value}`)}>
            <mesh
              onPointerOver={() => setHoveredItem(item.value)}
              onPointerOut={() => setHoveredItem(null)}
              onPointerDown={() => handleSelect(item.value)}
              castShadow
            >
              <boxGeometry args={[itemWidth, itemHeight, itemDepth]} />
              <meshStandardMaterial
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>

            <Text
              position={[0, 0, itemDepth / 2 + 0.01]}
              fontSize={0.08}
              anchorX="center"
              color={"#fff "}
              anchorY="middle"
            >
              {item.label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

