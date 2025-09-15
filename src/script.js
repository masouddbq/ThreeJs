import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

console.log(THREE);

let sc = new THREE.Scene()

// Add lighting for better text visibility
let directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(10, 10, 10)
directionalLight.target.position.set(0, 0, 0)
sc.add(directionalLight)

let ambientLight = new THREE.AmbientLight('#ffffff', 0.6)
sc.add(ambientLight)









let gui = new GUI({
    title : "تغییرات مکعبی",
    width : 300
})





 


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

let camera = new THREE.PerspectiveCamera(35,size.width/size.height)
camera.position.set(0,0,200)
camera.lookAt(0,0,0)
sc.add(camera)

console.log('Camera position:', camera.position)
console.log('Camera looking at:', camera.getWorldDirection(new THREE.Vector3()))





let canvas = document.querySelector(".web")

let renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(size.width,size.height)

const clock = new THREE.Clock()

// Create both controls
let pointerLock = new PointerLockControls(camera, canvas)
let orbitControls = new OrbitControls(camera, canvas)

// Configure OrbitControls
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.05
orbitControls.enablePan = true
orbitControls.enableZoom = true



gui.hide()
gui.close()
window.addEventListener("load",() => {
    setTimeout(() => {
        gui.show()
    }, 1000)
})

let cube = gui.addFolder("مکعب")
cube.close()








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


let fontLoader = new FontLoader()
fontLoader.load("helvetiker_regular.typeface.json",(font) => {
    let textGeometry = new TextGeometry("MasoudJs",{
        font: font,
        size: 50,
        height: 0.05,
        curveSegments: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.01,
        bevelOffset: 0.005,
        bevelSegments: 5,
    })

textGeometry.center()
    
    

    let textMaterial = new THREE.MeshBasicMaterial({wireframe: true,color: 'orange'})
    let textMesh = new THREE.Mesh(textGeometry,textMaterial)
    textMesh.position.set(0,0,0)
    sc.add(textMesh)
})

let Sphere = new THREE.SphereGeometry(0.1,16,16)
let SphereMaterial = new THREE.MeshBasicMaterial({color: 'whitesmoke', transparent: true, opacity: 0.8})
let count = 2000
for(let i = 0; i <= count; i++){
    let SphereMesh = new THREE.Mesh(Sphere,SphereMaterial)
    SphereMesh.scale.set(10,10,10)
    SphereMesh.position.x = Math.random() * 800 - 400;
    SphereMesh.position.y = Math.random() * 800 - 400
    SphereMesh.position.z = Math.random() * 800 - 400
    sc.add(SphereMesh)
}



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


