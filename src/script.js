import GUI from 'lil-gui'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


let sc = new THREE.Scene()

let texture = new THREE.TextureLoader()
let tx = texture.load('textures/particles/1.png')

let gui = new GUI({width:350})


let blackHole = new THREE.SphereGeometry(2.8,32,32)
let blackHolematerial = new THREE.MeshBasicMaterial({
    color:'black'
})
let blackHolemesh = new THREE.Mesh(blackHole,blackHolematerial)
sc.add(blackHolemesh)

let stars = null;
let starsmaterial = null;
let starspoints = null;


let parametr = {}
parametr.cnt = 1000
parametr.size = 0.02
parametr.radius = 25
parametr.branches = 3
parametr.spin = 1
parametr.randomness = 0.2
parametr.randomnesspower = 1
parametr.insideColor = '#FFFFFF'
parametr.outsideColor = '#FF5588'




let galaxy =()=>{


    if(starspoints!==null){
        stars.dispose()
        starsmaterial.dispose()
        sc.remove(starspoints)
    }


    stars = new THREE.BufferGeometry()
    let starspositions = new Float32Array(parametr.cnt * 3)
    let color = new Float32Array(parametr.cnt * 3)

    let insideColor = new THREE.Color(parametr.insideColor)
    let outsideColor = new THREE.Color(parametr.outsideColor)

    for(let i = 0;i<parametr.cnt;++i){
        
        let i3 = i * 3
    
        let radius = Math.random() * parametr.radius
        let spin = radius * parametr.spin
        let branchesangle = (i % parametr.branches) / parametr.branches * Math.PI * 2


        let x = Math.pow(Math.random(),parametr.randomnesspower) * (Math.random() < 0.5 ? 1 : -1) * parametr.randomness * radius
        let y = Math.pow(Math.random(),parametr.randomnesspower) * (Math.random() < 0.5 ? 1 : -1) * parametr.randomness * radius
        let z = Math.pow(Math.random(),parametr.randomnesspower) * (Math.random() < 0.5 ? 1 : -1) * parametr.randomness * radius


        starspositions[i3 + 0] = radius * Math.cos(branchesangle + spin) + x
        starspositions[i3 + 1] = y
        starspositions[i3 + 2] = radius * Math.sin(branchesangle + spin) + z

        //color

        let mixer = insideColor.clone()
        mixer.lerp(outsideColor,radius / parametr.radius)

        color[i3 + 0] = mixer.r
        color[i3 + 1] = mixer.g
        color[i3 + 2] = mixer.b
    }



    stars.setAttribute('position',new THREE.BufferAttribute(starspositions,3))
    stars.setAttribute('color',new THREE.BufferAttribute(color,3))

    starsmaterial = new THREE.PointsMaterial({
        size:parametr.size,
        sizeAttenuation:true,
        //transparent:true,
        //alphaMap:tx,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        vertexColors:true
    })

    starspoints = new THREE.Points(stars,starsmaterial)
    sc.add(starspoints)
}
galaxy()



gui.add(parametr,'cnt',1000,5000,200).name('stars count').onFinishChange(galaxy)
gui.add(parametr,'size',0.01,0.2,0.01).name('stars size').onFinishChange(galaxy)
gui.add(parametr,'radius',1,25,1).name('galaxy radius').onFinishChange(galaxy)
gui.add(parametr,'branches',3,7,1).name('galaxy branches').onFinishChange(galaxy)
gui.add(parametr,'spin',-5,5,1).name('branches spin').onFinishChange(galaxy)
gui.add(parametr,'randomness',0.2,2,0.1).name('branches randomness').onFinishChange(galaxy)
gui.add(parametr,'randomnesspower',1,5,0.1).name('branches randomnesspower').onFinishChange(galaxy)
gui.addColor(parametr,'insideColor').name('insideColor').onFinishChange(galaxy)
gui.addColor(parametr,'outsideColor').name('outsideColor').onFinishChange(galaxy)













let size = {
    width : window.innerWidth,
    height : window.innerHeight
}


let camera = new THREE.PerspectiveCamera(75,size.width/size.height)
sc.add(camera)
camera.position.z = 7

window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
})

let canvas = document.querySelector('.web')
let renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true,
})

renderer.setSize(size.width,size.height)

let orbit = new OrbitControls(camera,canvas)
orbit.enableDamping = true

let clock = new THREE.Clock()
let animation = ()=>{
    let elaps = clock.getElapsedTime()

    starspoints.rotation.y = elaps
    
    orbit.update()
    renderer.render(sc,camera)
    window.requestAnimationFrame(animation)
}
animation()