import * as THREE from "three";
import { Box } from "./Box";
import { colors } from "../constants";

export class Board extends THREE.Group {
    constructor(fbx: THREE.Group<THREE.Object3DEventMap>) {
        super();
        console.log(fbx);
        const meshes = calcAsset(fbx);
        console.log(Object.keys(meshes));

        const boxes = [];

        const nameToIndex = ["pawn", "rook", "knight", "bishop", "queen", "king"];
        const pawns = [
            2, 3, 4, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 6, 5, 4, 3, 2,
        ];

        for (let index = 0; index < 64; index++) {
            const boxIndex = boxes.length;
            const row = Math.floor(boxIndex / 8);
            const col = boxIndex % 8;
            const box: Box = new Box((boxIndex + row) % 2 == 0);

            box.position.x = col * (Box.size + 0.2);
            box.position.z = row * (Box.size + 0.2);

            boxes.push(box);

            const spawnIndex = pawns[index];
            if (spawnIndex) {
                const name = nameToIndex[spawnIndex - 1];

                const group = meshes[name].clone();
                if (index > 32) {
                    group.children.forEach((c) => {
                        const mesh = c as THREE.Mesh;
                        mesh.material = new THREE.MeshStandardMaterial({ color: colors.black });
                    });
                    group.rotation.y = Math.PI / 2;
                }
                box.setGroup(group);
            }

            super.add(box);
        }

        var box = new THREE.Box3().setFromObject(this);
        const size = new THREE.Vector3();
        box.getSize(size);
        this.position.x -= size.x / 2 - Box.size / 2;
        this.position.z -= size.z / 2 - Box.size / 2;
    }
}
function calcAsset(scene: THREE.Group<THREE.Object3DEventMap>) {
    const obj: Record<string, THREE.Group> = {};

    scene.children.forEach((object) => {
        const group = object as THREE.Group;
        obj[object.name] = group;

        object.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            if (!!mesh) {
                mesh.material = new THREE.MeshStandardMaterial({ color: colors.white });
            }
        });

        group.scale.multiplyScalar(0.006);
        group.rotation.y = -Math.PI / 2;
    });

    return obj;
}
