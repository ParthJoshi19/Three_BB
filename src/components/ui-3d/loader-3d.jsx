
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/three"
import * as THREE from "three"



export function Loader3D({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  size = 1,
  color = "#3B82F6",
  speed = 1,
  type = "spinner",
}) {
  const groupRef = useRef(null)

  // Rotation animation
  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.getElapsedTime() * speed

    if (type === "spinner") {
      groupRef.current.rotation.y = t
      groupRef.current.rotation.z = t * 0.5
    } else if (type === "ring") {
      groupRef.current.rotation.z = t
    }
  })

  // Dots animation with react-spring
  const { dotScale1, dotScale2, dotScale3 } = useSpring({
    from: { dotScale1: 0.5, dotScale2: 0.5, dotScale3: 0.5 },
    to: async (next) => {
      while (true) {
        await next({ dotScale1: 1, dotScale2: 0.5, dotScale3: 0.5 })
        await next({ dotScale1: 0.5, dotScale2: 1, dotScale3: 0.5 })
        await next({ dotScale1: 0.5, dotScale2: 0.5, dotScale3: 1 })
      }
    },
    config: { mass: 1, tension: 180, friction: 12 },
    reset: true,
    loop: true,
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {type === "spinner" && (
        <group ref={groupRef}>
          <mesh castShadow>
            <torusGeometry args={[size * 0.3, size * 0.05, 16, 32]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[size * 0.3, size * 0.05, 16, 32]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}

      {type === "dots" && (
        <group>
          <animated.mesh position={[-size * 0.25, 0, 0]} scale={dotScale1.to((s) => s * size * 0.15)}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
          </animated.mesh>

          <animated.mesh scale={dotScale2.to((s) => s * size * 0.15)}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
          </animated.mesh>

          <animated.mesh position={[size * 0.25, 0, 0]} scale={dotScale3.to((s) => s * size * 0.15)}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
          </animated.mesh>
        </group>
      )}

      {type === "ring" && (
        <group ref={groupRef}>
          <mesh castShadow>
            <torusGeometry args={[size * 0.3, size * 0.05, 16, 32]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[size * 0.08, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  )
}

