import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

console.log(THREE);

let sc = new THREE.Scene()

let rgbe = new RGBELoader()
rgbe.load('texture/environmentMap/2k2.hdr',(texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    sc.background = texture
    sc.environment = texture
})


let matcapTexture = new THREE.TextureLoader().load('texture/matcaps/3.png')

// let aml = new THREE.AmbientLight('#FFFFFF',1)
let directionalLight = new THREE.DirectionalLight('#FFFF12',1)
directionalLight.position.set(1,1,1)

let texture = new THREE.TextureLoader()
let nama = texture.load('texture/nama/ASLI.jpg')
nama.minFilter = THREE.NearestFilter
nama.magFilter = THREE.NearestFilter
nama.colorSpace = THREE.SRGBColorSpace

let namaAO = texture.load('texture/nama/AO.jpg')
let namadis = texture.load('texture/nama/DISPLACEMENT.jpg')
let namaNormal = texture.load('texture/nama/NORMAL.jpg')
let namaMetal = texture.load('texture/nama/METAL.jpg')
let namaROUGH = texture.load('texture/nama/ROUGH.jpg')

let material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: nama,
      aoMap: namaAO,
      aoMapIntensity: 0.1,
      displacementMap: namadis,
      displacementScale: 0.3,
      normalMap: namaNormal,
      normalScale: new THREE.Vector2(1,1),
      metalnessMap: namaMetal,
      roughnessMap: namaROUGH,
      roughness: 0.5,
      metalness: 0.5,
    })

// material.sheenColor.set(1,1,1)    
// material.roughness = 0.5
// material.metalness = 0.5

let gui = new GUI({
    title : "تغییرات مکعبی",
    width : 300
})

// gui.addColor(material,'sheenColor').name('Sheen Color')


// Fallback material in case texture doesn't load
let fallbackMaterial = new THREE.MeshPhysicalMaterial({
    side: THREE.DoubleSide,
    flatShading:true,
    
})

let mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    material,
    fallbackMaterial,
)
let mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,35,35),
    material
)
let mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(0.4,0.2,16,32),
    material
)

mesh1.position.x = -2
mesh2.position.x = 0
mesh3.position.x = 2



// let rgbe = new RGBELoader()


let materialChange = {
    color : 'whitesmoke',
    subdivisions : 2,
}


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
// let material = new THREE.MeshBasicMaterial({color:'whitesmoke',side: THREE.DoubleSide,map:checkerboard})
let mesh = new THREE.Mesh(box,material) 
// let box3 = new THREE.SphereGeometry(7.9,50,100)
// let material3 = new THREE.MeshBasicMaterial({color:'navy',side: THREE.DoubleSide})
// let mesh3 = new THREE.Mesh(box3,material3) 

sc.add(mesh1,mesh2,mesh3,directionalLight)

console.log('Scene objects:', sc.children)
console.log('Mesh1 (Plane):', mesh1)
console.log('Mesh2 (Sphere):', mesh2)
console.log('Mesh3 (Torus):', mesh3)

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

// Position the meshes properly
mesh1.position.set(-2,0,0)
mesh2.position.set(0,0,0)
mesh3.position.set(2,0,0)

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



gui.hide()
gui.close()
window.addEventListener("load",() => {
    setTimeout(() => {
        gui.show()
    }, 1000)
})

let cube = gui.addFolder("مکعب")
cube.close()



// Controls for mesh1 (Plane)
cube.add(mesh1.position,"x",-5,5,0.1).name("Plane X")
cube.add(mesh1.position,"y",-5,5,0.1).name("Plane Y")
cube.add(mesh1.position,"z",-5,5,0.1).name("Plane Z")
cube.add(mesh1,'visible').name("Plane Visible")
cube.add(mesh1.rotation,'x',-Math.PI,Math.PI,0.1).name("Plane X rotation")
cube.add(mesh1.rotation,'y',-Math.PI,Math.PI,0.1).name("Plane Y rotation")
cube.add(mesh1.rotation,'z',-Math.PI,Math.PI,0.1).name("Plane Z rotation")

// Controls for mesh2 (Sphere)
cube.add(mesh2.position,"x",-5,5,0.1).name("Sphere X")
cube.add(mesh2.position,"y",-5,5,0.1).name("Sphere Y")
cube.add(mesh2.position,"z",-5,5,0.1).name("Sphere Z")
cube.add(mesh2,'visible').name("Sphere Visible")
cube.add(mesh2.rotation,'x',-Math.PI,Math.PI,0.1).name("Sphere X rotation")
cube.add(mesh2.rotation,'y',-Math.PI,Math.PI,0.1).name("Sphere Y rotation")
cube.add(mesh2.rotation,'z',-Math.PI,Math.PI,0.1).name("Sphere Z rotation")

// Controls for mesh3 (Torus)
cube.add(mesh3.position,"x",-5,5,0.1).name("Torus X")
cube.add(mesh3.position,"y",-5,5,0.1).name("Torus Y")
cube.add(mesh3.position,"z",-5,5,0.1).name("Torus Z")
cube.add(mesh3,'visible').name("Torus Visible")
cube.add(mesh3.rotation,'x',-Math.PI,Math.PI,0.1).name("Torus X rotation")
cube.add(mesh3.rotation,'y',-Math.PI,Math.PI,0.1).name("Torus Y rotation")
cube.add(mesh3.rotation,'z',-Math.PI,Math.PI,0.1).name("Torus Z rotation")

materialChange.spin = () => {
    gsap.to(mesh1.rotation,{duration:1,delay:0,y:mesh1.rotation.y + 2})
    gsap.to(mesh2.rotation,{duration:1,delay:0,y:mesh2.rotation.y + 2})
    gsap.to(mesh3.rotation,{duration:1,delay:0,y:mesh3.rotation.y + 2})
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


