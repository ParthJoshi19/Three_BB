import { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function ParticleSystem({ count = 5000, color = "#ffffff", size = 0.02, speed = 0.01 }) {
  const mesh = useRef(null)
  const light = useRef(null)

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.xFactor
      positions[i * 3 + 1] = particle.yFactor
      positions[i * 3 + 2] = particle.zFactor
    })
    return positions
  }, [count, particles])

  useEffect(() => {
    if (light.current) {
      light.current.position.set(0, -2, 10);
      // light.current
    }
  }, [])

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (state.mouse.x * 1000 - particle.mx) * 0.01
      particle.my += (state.mouse.y * 1000 - 1 - particle.my) * 0.01
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10,
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <pointLight ref={light} distance={40} intensity={10} color="#FFFFFF" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhongMaterial color={"#FFFFFF"} />
      </instancedMesh>
    </group>
  )
}
