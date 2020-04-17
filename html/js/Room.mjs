//THREE.js libraries and helpers
import * as THREE from './libraries/THREEJS/build/three.module.js';

import Stats from './libraries/THREEJS/jsm/libs/stats.module.js';
import { GUI } from './libraries/THREEJS/jsm/libs/dat.gui.module.js';

import { PointerLockControls } from './libraries/THREEJS/jsm/controls/PointerLockControls.js';
import {VRButton} from './libraries/THREEJS/jsm/webxr/VRButton.js'


import Game from  './game.mjs';

//import socket from './clientSocket.mjs'

//import {setSyncedSocket,syncedRegisterHandler,synced} from './syncedObject.mjs';
//setSyncedSocket(socket);
//syncedRegisterHandler(socket);
//window.synced = synced;


var params = {
	enableWind: true,
	showBall: false
};



let game = new Game();
window.g = game;
//socket.game = game;

var container, stats;
var controls, camera, scene, renderer;

//adds lights and background
function addEnvironment(scene){
    scene.background = new THREE.Color( 0xcce0ff );
	//scene.fog = new THREE.Fog( 0xcce0ff, 70, 200 );
	//window.s = scene;

	// camera

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, .01, 1000 );
	camera.position.set( 2, 1.8, 2 );
	scene.add(camera);
	//let a = new THREE.Mesh(new THREE.CubeGeometry(.1,.1,.1,1,1,1), new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide}));
	//a.position.z -= 1;
	//camera.add(new THREE.AxesHelper(5));
	//camera.add(a);


	// lights

	scene.add( new THREE.AmbientLight( 0x666666 ) );

	var light = new THREE.DirectionalLight( 0xdfebff, 1 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );

	//light.castShadow = true;

	//light.shadow.mapSize.width = 1024;
	//light.shadow.mapSize.height = 1024;

	var d = 300;

	//light.shadow.camera.left = - d;
	//light.shadow.camera.right = d;
	//light.shadow.camera.top = d;
	//light.shadow.camera.bottom = - d;

	//light.shadow.camera.far = 1000;

	scene.add( light );


	//objects 
	var loader = new THREE.TextureLoader();


	var groundTexture = loader.load( 'js/textures/terrain/grasslight-big.jpg' );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 25, 25 );
	groundTexture.anisotropy = 16;
	groundTexture.encoding = THREE.sRGBEncoding;

	var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 20 ), groundMaterial );
	//mesh.position.y = - 250;
	mesh.rotation.x = - Math.PI / 2;
	//mesh.receiveShadow = true;
	scene.add( mesh );
}

function addControls(camera){
    controls = new PointerLockControls( camera, document.body );
    let obj = controls.getObject();
    obj.userData.moveForward = 0;
    obj.userData.moveRight = 0;
    obj.userData.moveUp = 0;

    document.body.addEventListener( 'click', function () {

        controls.lock();

    }, false );

    let speed = 0.0001; // m/s
    let onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                obj.userData.moveForward = speed;
                break;

            case 37: // left
            case 65: // a
                obj.userData.moveRight = -speed;
                break;

            case 40: // down
            case 83: // s
                obj.userData.moveForward = -speed;
                break;

            case 39: // right
            case 68: // d
                obj.userData.moveRight = speed;
                break;

            case 32: // space
                obj.userData.moveUp = speed;
                //if ( canJump === true ) velocity.y += 350;
                //canJump = false;
                break;
            case 16: // left shift
                obj.userData.moveUp = -speed;
                break;

        }

    };

    let onKeyUp = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                if(obj.userData.moveForward > 0){
                    obj.userData.moveForward = 0;
                }
                break;

            case 37: // left
            case 65: // a
                if(obj.userData.moveRight < 0){
                    obj.userData.moveRight = 0;
                }
                break;

            case 40: // down
            case 83: // s
                if(obj.userData.moveForward < 0){
                    obj.userData.moveForward = 0;
                }
                break;

            case 39: // right
            case 68: // d
                if(obj.userData.moveRight > 0){
                    obj.userData.moveRight = 0;
                }
                break;
            case 32: // space
                if(obj.userData.moveUp > 0){
                    obj.userData.moveUp = 0;
                }
                break;
            case 16: // left shift
                if(obj.userData.moveUp < 0){
                    obj.userData.moveUp = 0;
                }
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    //return controls.getObject();
}


function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// scene

	scene = new THREE.Scene();
	addEnvironment(scene);

	
	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.shadowMap.enabled = true;

    
    // controls //TODO change to first persion controls
	/*var controls = new OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI ;//* 0.5;
	controls.minDistance = .1;
	controls.maxDistance = 50;
    controls.target.y=.1;*/

    addControls(camera);
    console.log(scene);

    //START GUI
    // performance monitor
	stats = new Stats();
	container.appendChild( stats.dom );

	//
	params.ConnectVRController = function(){
		if(game.myObj.controllers.length == 0){
			game.myObj.addController();
		}
		game.myObj.controllers[0].connect();
	};
	var gui = new GUI();
	//gui.add( params, 'enableWind' );
	//gui.add( params, 'showBall' );
	gui.add( params, 'ConnectVRController');
	

	//VR stuff
	renderer.xr.enabled = true;
	document.body.appendChild(VRButton.createButton(renderer));
    renderer.setAnimationLoop(animate)
    
    window.addEventListener( 'resize', onWindowResize, false );


    //END GUI

	game.init(undefined, scene, camera);
	//console.log(scene);
	//console.log(game);
}

//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {
	var time = Date.now();

	render();
	stats.update();

}


var prevTime = performance.now();
function render() {

    if(controls.isLocked === true){
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        //velocity.x -= velocity.x * 10.0 * delta;
        //velocity.z -= velocity.z * 10.0 * delta;
        controls.moveForward(controls.getObject().userData.moveForward*delta);
        controls.moveRight(controls.getObject().userData.moveRight*delta);
        controls.getObject().position.y += controls.getObject().userData.moveUp*delta;
        
    }

	game.myObj.position.copy(camera.position);
    game.myObj.setRotationFromEuler(camera.rotation);

	renderer.render( scene, camera );

}

function start(){
    init();
    animate();
}

export default {start};