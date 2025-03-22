import { useState, useRef, useEffect } from "react"
import { useGLTF, TransformControls, useCursor } from "@react-three/drei"
import { Physics, useBox, usePlane } from "@react-three/cannon"
import GUI from 'lil-gui'

export function ModelViewer() {
    const [modelUrl, setModelUrl] = useState("/airbus.glb")
    const [transformMode, setTransformMode] = useState(null)
    const [showPhysics, setShowPhysics] = useState(false)
    const gui = useRef(null)

    useEffect(() => {
        if (!gui.current) {
            gui.current = new GUI()
            const transformFolder = gui.current.addFolder('Transform Mode')
            transformFolder.add({ mode: 'translate' }, 'mode', ['translate', 'rotate', 'scale']).onChange(setTransformMode)
            transformFolder.open()

            const physicsFolder = gui.current.addFolder('Physics Simulation')
            physicsFolder.add({ physics: false }, 'physics').onChange(setShowPhysics)
            physicsFolder.open()

            const modelFolder = gui.current.addFolder('Select Model')
            modelFolder.add({ model: 'airbus' }, 'model', ['airbus', 'duck']).onChange((value) => {
                setModelUrl(value === 'airbus' ? '/airbus.glb' : '/assets/3d/duck.glb')
            })
            modelFolder.open()
        }

        return () => {
            gui.current?.destroy()
        }
    }, [])

    return (
        <group>
            {showPhysics ? (
                <Physics gravity={[0, -9.8, 0]}>
                    <PhysicsScene modelUrl={modelUrl} />
                </Physics>
            ) : (
                <EditableModel modelUrl={modelUrl} transformMode={transformMode} />
            )}
        </group>
    )
}

function EditableModel({ modelUrl, transformMode }) {
    const modelRef = useRef()
    const { scene } = useGLTF(modelUrl)
    const clonedScene = scene.clone()

    return (
        <group>
            {transformMode ? (
    <TransformControls object={modelRef} mode={transformMode}>
        <primitive ref={modelRef} object={clonedScene} position={[0, 0, 0]} scale={0.5} />
    </TransformControls>
) : (
    <primitive ref={modelRef} object={clonedScene} position={[0, 0, 0]} scale={0.5} />
)}

        </group>
    )
}

function PhysicsScene({ modelUrl }) {
    const { scene } = useGLTF(modelUrl)
    const clonedScene = scene.clone()

    return (
        <group>
            <PhysicsModel position={[0, 3, 0]} modelScene={clonedScene} />
            <PhysicsFloor position={[0, -0.5, 0]} />
            <PhysicsBox position={[1, 2, 0]} />
            <PhysicsBox position={[-1, 4, 0]} />
        </group>
    )
}

function PhysicsModel({ position, modelScene }) {
    const [ref, api] = useBox(() => ({
        mass: 1,
        position,
        args: [0.5, 0.5, 0.5],
    }))

    const [hover, setHover] = useState(false)
    useCursor(hover)

    const handleClick = () => {
        api.applyImpulse([Math.random() * 5 - 2.5, 5, Math.random() * 5 - 2.5], [0, 0, 0])
    }

    return (
        <mesh ref={ref} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={handleClick}>
            <primitive object={modelScene} scale={0.5} />
        </mesh>
    )
}

function PhysicsBox({ position }) {
    const [ref, api] = useBox(() => ({
        mass: 1,
        position,
        args: [0.5, 0.5, 0.5],
    }))

    const [hover, setHover] = useState(false)
    useCursor(hover)

    const handleClick = () => {
        api.applyImpulse([Math.random() * 5 - 2.5, 5, Math.random() * 5 - 2.5], [0, 0, 0])
    }

    return (
        <mesh ref={ref} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)} onClick={handleClick}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={hover ? "#ff9500" : "#ff0000"} />
        </mesh>
    )
}

function PhysicsFloor({ position }) {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position,
    }))

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>
    )
}
