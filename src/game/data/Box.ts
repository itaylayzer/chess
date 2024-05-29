import * as THREE from "three";
import { colors } from "../constants";

export class Box extends THREE.Group {
    private group: THREE.Group | null;
    setGroup(group: THREE.Group) {
        if (this.group) super.remove(this.group);
        super.add((this.group = group));

        this.group.position.y -= 0.5 / 2;
    }
    public static size = 4;
    constructor(black: boolean) {
        super();
        this.group = null;

        const ground = new THREE.Mesh(
            new THREE.BoxGeometry(Box.size, 0.3 * 2, Box.size),
            new THREE.MeshStandardMaterial({ color: black ? colors.black : colors.boardWhite })
        );

        super.add(ground);
    }
}
