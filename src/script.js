import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

console.log(THREE);

let sc = new THREE.Scene()

console.log(sc);

let box = new THREE.DodecahedronGeometry(4,1,100,20)
let material = new THREE.MeshBasicMaterial({color:'red',wireframe:true})
let mesh = new THREE.Mesh(box,material) 

let plane = new THREE.PlaneGeometry(20,20)
let material2 = new THREE.MeshBasicMaterial({color:'gray', side: THREE.DoubleSide ,wireframe:true})
let mesh2 = new THREE.Mesh(plane,material2)

mesh2.rotation.x = Math.PI/2
mesh2.rotation.y = 0.01

sc.add(mesh,mesh2)

let size = {
    width : window.innerWidth,
    height : window.innerHeight
}

window.addEventListener("resize",() => {
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
})

let camera = new THREE.PerspectiveCamera(75,size.width/size.height)
camera.position.set(0,0,4)
sc.add(camera)

mesh.position.set(0,10,0)
mesh.rotation.set(0,0,0)
mesh.scale.set(2,2,1)

let canvas = document.querySelector(".web")

let renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(size.width,size.height)
console.log(box);

const clock = new THREE.Clock()

// Create both controls
let pointerLock = new PointerLockControls(camera, canvas)
let orbitControls = new OrbitControls(camera, canvas)

// Configure OrbitControls
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.05
orbitControls.enablePan = true
orbitControls.enableZoom = true

// Configure PointerLockControls
let keyboard = []

window.addEventListener("keydown",(e) => {
    keyboard[e.key] = true
})

window.addEventListener("keyup",(e) => {
    keyboard[e.key] = false
})

let movement = () => {
    if(keyboard["w"]){
        pointerLock.moveForward(0.2)
    }
    if(keyboard["s"]){
        pointerLock.moveForward(-0.2)
    }
    if(keyboard["a"]){
        pointerLock.moveRight(-0.2)
    }
    if(keyboard["d"]){
        pointerLock.moveRight(0.2)
    }
}

// Toggle between controls
let isPointerLocked = false

window.addEventListener("keydown",(e) => {
    if(e.key === "Enter"){
        if (!isPointerLocked) {
            pointerLock.lock()
            isPointerLocked = true
            orbitControls.enabled = false
        } else {
            pointerLock.unlock()
            isPointerLocked = false
            orbitControls.enabled = true
        }
    }
    
    // Press Escape to exit pointer lock mode
    if(e.key === "Escape" && isPointerLocked) {
        pointerLock.unlock()
        isPointerLocked = false
        orbitControls.enabled = true
    }
})

let animation = () => { 
    const elapsedTime = clock.getElapsedTime()
    
    // Update OrbitControls damping
    orbitControls.update()
    
    // Only handle movement when pointer is locked
    if (isPointerLocked) {
        movement()
    }
    
    renderer.render(sc,camera)
    window.requestAnimationFrame(animation)
}

animation()


