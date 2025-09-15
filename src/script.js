import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let btn = document.querySelector(".btn")

console.log(THREE);

btn

let sc = new THREE.Scene()

let directionalLight = new THREE.DirectionalLight('#FFFF12',1)
directionalLight.position.set(10,10,10)
directionalLight.target.position.set(0,0,0)

let ambientLight = new THREE.AmbientLight('#FFFFFF',0.5)

let texture = new THREE.TextureLoader()

let stone = texture.load("texture/stone/asli.jpg")
stone.minFilter = THREE.NearestFilter
stone.magFilter = THREE.NearestFilter
let stoneAo = texture.load("texture/stone/ao.jpg")
let stoneDisp = texture.load("texture/stone/disp.jpg")
let stoneNormal = texture.load("texture/stone/normal.jpg")

let brick = texture.load("texture/brick/asli.jpg")
brick.minFilter = THREE.NearestFilter
brick.magFilter = THREE.NearestFilter
let brickAo = texture.load("texture/stone/ao.jpg")
let brickDisp = texture.load("texture/brick/disp.jpg")
let brickNormal = texture.load("texture/brick/normal.jpg")


let Sphere = new THREE.SphereGeometry(2,32,32)
let material1 = new THREE.MeshStandardMaterial({
    color:'whitesmoke',
    side: THREE.DoubleSide,
    map: stone,
    aoMap: stoneAo,
    aoMapIntensity: 1,
    displacementMap: stoneDisp,
    displacementScale: 0.3,
    normalMap: stoneNormal,
    normalScale: new THREE.Vector2(1,1),
    roughness: 0.5,
    metalness: 0.5,
})
let mesh1 = new THREE.Mesh(Sphere,material1)
sc.add(mesh1,ambientLight,directionalLight)

console.log('Sphere created:', mesh1)
console.log('Sphere position:', mesh1.position)
console.log('Sphere visible:', mesh1.visible)

let vaziat = false

btn.addEventListener("click",() => {
    if(vaziat){
        mesh1.material.color.set('transparent')
        vaziat = false
        btn.innerHTML = "Earth"
        material1.map = stone
        material1.aoMap = stoneAo
        material1.displacementMap = stoneDisp
        material1.normalMap = stoneNormal
    }else{
        mesh1.material.color.set('transparent')
        vaziat = true
        btn.innerHTML = "Moon"
        material1.map = brick
        material1.aoMap = brickAo
        material1.displacementMap = brickDisp
        material1.normalMap = brickNormal
    }
})




// let material = new THREE.MeshStandardMaterial({
//       side: THREE.DoubleSide,
//       map: nama,
//       aoMap: namaAO,
//       aoMapIntensity: 0.1,
//       displacementMap: namadis,
//       displacementScale: 0.3,
//       normalMap: namaNormal,
//       normalScale: new THREE.Vector2(1,1),
//       metalnessMap: namaMetal,
//       roughnessMap: namaROUGH,
//       roughness: 0.5,
//       metalness: 0.5,
//     })

// let material = new THREE.MeshBasicMaterial({color:'whitesmoke',side: THREE.DoubleSide,map:checkerboard})
// let mesh = new THREE.Mesh(box,material) 
// let box3 = new THREE.SphereGeometry(7.9,50,100)
// let material3 = new THREE.MeshBasicMaterial({color:'navy',side: THREE.DoubleSide})
// let mesh3 = new THREE.Mesh(box3,material3) 

// sc.add(mesh1,mesh2,mesh3,directionalLight)

console.log('Scene objects:', sc.children)
console.log('Mesh1 (Sphere):', mesh1)

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
camera.position.set(0,0,5)
camera.lookAt(0,0,0)
sc.add(camera)

console.log('Camera position:', camera.position)
console.log('Camera looking at:', camera.getWorldDirection(new THREE.Vector3()))

// mesh3.position.set(0,5,0)

// Position the mesh properly
mesh1.position.set(0,0,0)

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


