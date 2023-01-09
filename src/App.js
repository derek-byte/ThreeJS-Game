import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React, {useRef, useEffect} from 'react';
import './App.css';

function App() {
  const ref = useRef(null);

  useEffect(() => {
      const scene = new THREE.Scene();

      var stars=[];

      const camera = new THREE.PerspectiveCamera(75, window?.innerWidth / window?.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({
          canvas: ref.current,
      });

      renderer.setPixelRatio(window?.devicePixelRatio);
      renderer.setSize(window?.innerWidth, window?.innerHeight);
      camera.position.setZ(30);

      renderer.render(scene, camera);
      renderer.shadowMap.enabled = true;//enable shadow 
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const geometry = new THREE.BoxGeometry( 50, 50, 10 );
      const material = new THREE.MeshBasicMaterial( {color: 0xd5e8ed, side: THREE.DoubleSide} );
      const plane = new THREE.Mesh( geometry, material );
      const edges = new THREE.EdgesGeometry( geometry );
      const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
      scene.add( plane, line );

      plane.castShadow=true;
      plane.receiveShadow=false;

      // const pointLight = new THREE.PointLight(0xffffff);
      // pointLight.position.set(5, 5, 5);

      // const ambientLight = new THREE.AmbientLight(0xffffff);
      // scene.add(pointLight, ambientLight);

      const sun = new THREE.DirectionalLight( 0xffffff, 0.8);
      sun.position.set( 5,5,5 );
      sun.castShadow = true;
      scene.add(sun);
      //Set up shadow properties for the sun light 
      sun.shadow.mapSize.width = 256;
      sun.shadow.mapSize.height = 256;
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = 50 ;

      const spaceTexture = new THREE.TextureLoader().load('');
      scene.background = spaceTexture;

      const controls = new OrbitControls(camera, renderer.domElement);

      const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x4c91a8, 
        side: THREE.DoubleSide
      })
      );

      scene.add(moon);

      moon.position.z = -7;
      moon.position.y = -8;
      // moon.position.setX(3);

      const group = new THREE.Group()

      const geometryTree = new THREE.BoxGeometry( 4, 4, 6 );
      const materialTree = new THREE.MeshBasicMaterial( {color: 0x36852e, side: THREE.DoubleSide} );
      const planeTree = new THREE.Mesh( geometryTree, materialTree );
      const edgesTree = new THREE.EdgesGeometry( geometryTree );
      const lineTree = new THREE.LineSegments( edgesTree, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

      const geometryTrunk = new THREE.BoxGeometry( 2, 2, 3 );
      const materialTrunk = new THREE.MeshBasicMaterial( {color: 0x5c5558, side: THREE.DoubleSide} );
      const planeTrunk = new THREE.Mesh( geometryTrunk, materialTrunk );
      scene.add( planeTree, lineTree, planeTrunk );

      planeTree.position.z = -10;
      planeTrunk.position.z = -6;
      // planeTree.position.y = -8;
      // planeTree.position.setX(3);

      function moveCamera() {
      let t = document.body.getBoundingClientRect().top;
      // const t = 1500;
      t += 3500;

      // moon.rotation.x += 0.0001;
      // moon.rotation.y += 0.005;
      // moon.rotation.z += 0.0005;
      
      camera.position.z = t * -0.012;
      camera.position.x = t * -0.000;
      camera.position.y = t * -0.01;

      console.log(camera.position.z, camera.position.x, camera.rotation.y)

      // camera.position.z = t * -0.01;
      // camera.position.x = t * -0.0002;
      camera.rotation.y = t * -2;
      }

      document.body.onscroll = moveCamera;
      moveCamera();

      function addSphere(){
          // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
          for ( var z= -1000; z < 1000; z+=20 ) {
              // Make a sphere (exactly the same as before). 
              var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
              var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
              var sphere = new THREE.Mesh(geometry, material)
              // This time we give the sphere random x and y positions between -500 and 500
              sphere.position.x = Math.random() * 1000 - 500;
              sphere.position.y = Math.random() * 1000 - 500;
              // Then set the z position to where it is in the loop (distance of camera)
              sphere.position.z = z;
              // scale it up a bit
              sphere.scale.x = sphere.scale.y = 3;
              //add the sphere to the scene
              scene.add( sphere );
              //finally push it to the stars array 
              stars.push(sphere); 
          }
      }

      function animateStars() { 
          for(var i=0; i<stars.length; i++) {
              stars[i].position.z +=  i/6;
              // stars[i].position.y -=  i/6;
              // if the particle is too close move it to the back
              if(stars[i].position.z>1000) stars[i].position.z-=2000; 
              // if(stars[i].position.y<-500) stars[i].position.y+=2000; 
              
          }
      }

      let keysPressed = {};
      let iceKeysPressed = {};
      var xSpeed = -0.25;
      var ySpeed = 0.25;
      var friction = 0.98;

      document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     
        if (keysPressed['w']) {
          moon.position.y += ySpeed;
        } else if (keysPressed['s']) {
          moon.position.y -= ySpeed;
        } 
        if (keysPressed['a']) {
          moon.position.x -= xSpeed;
        } else if (keysPressed['d']) {
          moon.position.x += xSpeed;
        } 
      });

      function addIceEffect(key) {
        if (key === 'w') {
          iceKeysPressed[key] = ySpeed;
          delete iceKeysPressed['s'];
        } else if (key === 's') {
          iceKeysPressed[key] = ySpeed;
          delete iceKeysPressed['w'];
        } 
        if (key === 'a') {
          iceKeysPressed[key] = -xSpeed;
          delete iceKeysPressed['d'];
        } else if (key === 'd') {
          iceKeysPressed[key] = -xSpeed;
          delete iceKeysPressed['a'];
        } 
        console.log(key, iceKeysPressed)
      }

      function iceMoves() {
        // console.log(iceKeysPressed)
        if (iceKeysPressed['a'] > 0.1) {
          moon.position.x += iceKeysPressed['a'];
          iceKeysPressed['a'] *= friction;
        } else if (iceKeysPressed['d'] > 0.1) {
          moon.position.x -= iceKeysPressed['d'];
          iceKeysPressed['d'] *= friction; 
        }
        if (iceKeysPressed['w'] > 0.1) {
          moon.position.y += iceKeysPressed['w'];
          iceKeysPressed['w'] *= friction;
        } else if (iceKeysPressed['s'] > 0.1) {
          moon.position.y -= iceKeysPressed['s'];
          iceKeysPressed['s'] *= friction;
        }  
      }
     
      document.addEventListener('keyup', (event) => {
        addIceEffect(event.key)
        delete keysPressed[event.key];
      });

      function animate() {
      requestAnimationFrame(animate);

      moon.rotation.x += 0.0001;
      moon.rotation.y += 0.001;
      moon.rotation.z += 0.01;
      
      controls.update();

      renderer.render(scene, camera);
      animateStars();
      iceMoves();
      }
      
      addSphere();
      animate();
  }, []) 

  return(
    <div className='App'>
      <div className='main'>
        
      </div>
      <canvas ref={ref} id="#bg" className='bg'></canvas>
    </div>
  );
}

export default App;
