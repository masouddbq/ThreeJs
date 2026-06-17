import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'




let sc = new THREE.Scene()

let gui = new GUI({title:'color controls'})

let parametr = {
    distance : 5,
    cnt : 5000,
    color:'#FFFFFF'
}

let textureloader = new THREE.TextureLoader()
let tx_gradient = textureloader.load('gradients/3.jpg')
tx_gradient.magFilter = THREE.NearestFilter

let dots_tx = textureloader.load('textures/particles/1.png')

let material = new THREE.MeshToonMaterial({
    gradientMap:tx_gradient
})

let box = new THREE.Mesh(
    new THREE.CapsuleGeometry(1,1,1),
    material
)
let cone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2,1,1),
    material
)
let trous = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.7,12,70),
    material
)

sc.add(box,cone,trous)

box.position.y = parametr.distance * 0.1
cone.position.y = - parametr.distance * 0.9
trous.position.y = - parametr.distance * 2.1

box.position.x = 1.5
cone.position.x = -2
trous.position.x = 1.5

let models = [box,cone,trous]


//particles

let dots = new THREE.BufferGeometry()
let dotspositions = new Float32Array(parametr.cnt * 3)
for(let i = 0 ; i < parametr.cnt ; ++i){

    let i3 = i * 3

    dotspositions[i3 + 0] = ( Math.random() - 0.5 ) * 20
    dotspositions[i3 + 1] = ( Math.random() - 0.5 ) * 40
    dotspositions[i3 + 2] = ( Math.random() - 0.5 ) * 20

}
let dotsattr = new THREE.BufferAttribute(dotspositions,3)
dots.setAttribute('position',dotsattr)

let dots_material = new THREE.PointsMaterial({
    size:0.2,
    color:parametr.color,
    transparent:true,
    alphaMap:dots_tx,
    sizeAttenuation:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending
})

let dotspoints = new THREE.Points(dots,dots_material)
sc.add(dotspoints)


//light

let direct = new THREE.DirectionalLight('#FFFFFF',1)
direct.position.set(1,1,1)
sc.add(direct) 

let size = {
    width : window.innerWidth,
    height : window.innerHeight
}

window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
})

let camera_gp = new THREE.Group()
sc.add(camera_gp)


let camera = new THREE.PerspectiveCamera(35,size.width/size.height)
camera.position.z = 8
camera_gp.add(camera)


let canvas = document.querySelector('.web')
let renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
    alpha:true
})

renderer.setSize(size.width,size.height)



//scroll

let scrolly = window.scrollY
let start_section = 0
window.addEventListener('scroll',()=>{
    scrolly = window.scrollY
    let new_section = Math.round(scrolly / size.height)
    if(new_section!=start_section){
        start_section = new_section
        gsap.to(
            models[start_section].rotation,{
                duration:1.8,
                x:'+=3',
                y:'+=3'
            }
        )
    }

})

//cursor

let cursor = {
    x:0,
    y:0
}
window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX / size.width - 0.5
    cursor.y = event.clientY / size.height - 0.5
})


//gui

gui
    .addColor(parametr,'color')
    .onChange(()=>{
        dots_material.color.set(parametr.color)
    })

let clock = new THREE.Clock()
let start_time = 0
let animation = ()=>{
    
    let elaps = clock.getElapsedTime()
    let delta_time = elaps - start_time
    start_time = elaps

    for(let i in models){
        models[i].rotation.x += delta_time * 0.1
        models[i].rotation.y += delta_time * 0.1
        models[i].rotation.z += delta_time * 0.1
    }

    
    camera.position.y = -scrolly / size.height * parametr.distance

    camera_gp.position.x += (cursor.x - camera_gp.position.x) * 5 * delta_time
    camera_gp.position.y += (- cursor.y - camera_gp.position.y) * 5 * delta_time
    
    renderer.render(sc,camera)
    window.requestAnimationFrame(animation)
}
animation()