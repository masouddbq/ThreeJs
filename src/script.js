import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { checker } from 'three/tsl';

console.log(THREE);

let sc = new THREE.Scene()

console.log(sc);

let materialChange = {
    color : 'whitesmoke',
    subdivisions : 2,
}

let texture = new THREE.TextureLoader()

// let basicTexture = texture.load("texture/door/door.jpg")
// basicTexture.colorSpace = THREE.SRGBColorSpace 

// basicTexture.repeat.x = 2
// basicTexture.repeat.y = 2

// basicTexture.wrapS = THREE.RepeatWrapping
// basicTexture.wrapT = THREE.RepeatWrapping

// basicTexture.offset.x = 0.5
// basicTexture.offset.y = 0.5

// basicTexture.rotation = Math.PI/4
// basicTexture.center.x = 0.5
// basicTexture.center.y = 0.5

// basicTexture.minFilter = THREE.NearestFilter

let checkerboard = texture.load("texture/checkerboard-8x8.png")
checkerboard.minFilter = THREE.NearestFilter
checkerboard.magFilter = THREE.NearestFilter

checkerboard.repeat.x = 2
checkerboard.repeat.y = 2

checkerboard.wrapS = THREE.RepeatWrapping
checkerboard.wrapT = THREE.RepeatWrapping


 

let box = new THREE.BoxGeometry(2,2,2)
let material = new THREE.MeshBasicMaterial({color:'',side: THREE.DoubleSide,map:checkerboard})
let mesh = new THREE.Mesh(box,material) 
// let box3 = new THREE.SphereGeometry(7.9,50,100)
// let material3 = new THREE.MeshBasicMaterial({color:'navy',side: THREE.DoubleSide})
// let mesh3 = new THREE.Mesh(box3,material3) 

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
camera.position.set(0,2,5)
sc.add(camera)

// mesh3.position.set(0,5,0)

mesh.position.set(0,1,0)
mesh.rotation.set(0,0,0)

// mesh3.scale.set(0.5,0.5,0.5)
mesh.scale.set(1,1,1)

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




let gui = new GUI({
    title : "تغییرات مکعبی",
    width : 300
})

gui.hide()
gui.close()
window.addEventListener("load",() => {
    setTimeout(() => {
        gui.show()
    }, 1000)
})

let cube = gui.addFolder("مکعب")
cube.close()



cube.add(mesh.position,"x",-1,1,0.1).name("x")
cube.add(mesh.position,"y",-1,5,0.1).name("y")
cube.add(mesh.position,"z",-1,1,0.1).name("z")
cube.add(mesh,'visible')
cube.add(mesh.rotation,'x',-1,1,0.1).name("x rotation")
cube.add(mesh.rotation,'y',-1,1,0.1).name("y rotation")
cube.add(mesh.rotation,'z',-1,1,0.1).name("z rotation")
cube.add(mesh.scale,'x',0,2,0.1).name("x scale")
cube.add(mesh.scale,'y',0,2,0.1).name("y scale")
cube.add(mesh.scale,'z',0,2,0.1).name("z scale")
cube.add(mesh.material,'wireframe')
cube.addColor(materialChange,'color').onChange(() => {
    mesh.material.color.set(materialChange.color)
})
cube.add(materialChange,'subdivisions',2,25,1).onFinishChange(() => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
        2,2,2,
        materialChange.subdivisions,
        materialChange.subdivisions,
        materialChange.subdivisions
    )
})
cube.add(materialChange,'spin')

materialChange.spin = () => {
    gsap.to(mesh.rotation,{duration:1,delay:0,y:mesh.rotation.y + 2})
}

cube.add(materialChange,'spin')




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


