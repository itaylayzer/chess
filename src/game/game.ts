import * as THREE from "three";

import { createLight } from "./lib/createLights";
import { loadedAssets } from "../viewmodels/useAssetLoader";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { colors } from "./constants";
import { Board } from "./data/Board";

export default (assets: loadedAssets) => {
    const container = document.querySelector("div.gameContainer") as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    // @ts-ignore
    // const cannonDebugger = CannonDebugger(scene, world, {});

    const camera = new THREE.OrthographicCamera(
        window.innerWidth / -30,
        window.innerWidth / 30,
        window.innerHeight / 30,
        window.innerHeight / -30,
        -150,
        150
    );
    camera.position.set(0, 10, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //#region LIGHTS
    createLight(
        [
            {
                color: 0xffffff,
                intensity: 2,
                type: "directional",
                rot: new THREE.Euler(0.1, 0.1, 0),
            },
            {
                color: 0xffffff,
                intensity: 0.7,
                type: "ambient",
                rot: new THREE.Euler(0.9, 0.5, 0),
            },
        ],
        scene
    );
    //#endregion
    const updates: (() => void)[] = [];

    const map = new Board(assets.fbx.chess);
    scene.add(map);
    const updateInterval = setInterval(() => {
        [...updates].map((fn) => fn());

        controls.update();
        // cannonDebugger.update();
        renderer.render(scene, camera);
    }, 17);

    return {
        destroyer: () => {
            clearInterval(updateInterval);
            while (container.firstChild) container.removeChild(container.firstChild);
        },
    };
};
