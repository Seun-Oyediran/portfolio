'use client';
import {
  Box,
  MeshWobbleMaterial,
  OrbitControls,
  Text,
  useScroll,
  useTexture,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import React, { Fragment, useRef } from 'react';
import { Euler, type Group, type Object3DEventMap, Vector3, Box3 } from 'three';
const SCALE = 3;
const NUMBER_OF_CARDS = 23;
const HALFOF_NUMBER_OF_CARDS = Math.floor(NUMBER_OF_CARDS / 2);
const CARD_OFFSET = 0.15 * 2 * SCALE;
const CARD_WIDTH = 1 * SCALE;
const CARD_HEIGHT = 1.1 * SCALE;
// const HALFOF_NUMBER_OF_CARDS = 0;

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

const cardPositions = Array.from({ length: NUMBER_OF_CARDS }, (_, i) => ({
  position: new Vector3(
    // i * (1 + CARD_OFFSET),
    // 0,
    (i - HALFOF_NUMBER_OF_CARDS) * (CARD_WIDTH + CARD_OFFSET),
    // i - HALFOF_NUMBER_OF_CARDS + CARD_OFFSET * CARD_WIDTH,

    (i - HALFOF_NUMBER_OF_CARDS) * CARD_OFFSET * CARD_HEIGHT,
    0
  ),
  rotation: new Euler(0, -Math.PI / 12, 0),
  // rotation: new Euler(0, 0, 0),
  color: colors[i % colors.length],
  // rotation: new Euler(0, 0, 0),
}));

export function Experience() {
  const scrollPos = useScroll();
  // const scrollPos = { offset: 0.4 };
  const { height } = useThree((state) => state.viewport);

  const groupRef = useRef<Group<Object3DEventMap> | null>(null);
  const wobbleRef = useRef<any>(null);

  const texture = useTexture('./media/images/loader.png');

  const texture2 = useTexture('./media/images/loader2.png');

  const texture3 = useTexture('./media/images/loader3.png');

  const textures = [texture, texture2, texture3];

  const fontProps = {
    font: '/fonts/abc-diatype/ABC_Diatype_Bold.woff',
    fontSize: 0.2,
    letterSpacing: -0.06,
    lineHeight: 1,
    'material-toneMapped': false,
  };

  useFrame((_, delta) => {
    if (!groupRef?.current) return;
    // console.log(groupRef.current?.children);

    // groupRef.current.rotation.x = -scrollPos.offset * (Math.PI * 2);
    // groupRef.current.position.x = -scrollPos.offset * (Math.PI * 2);
    // groupRef.current.position.y = -scrollPos.offset * (Math.PI * 2);
    // groupRef.current.position.y = height * scrollPos.offset;
    // groupRef.current.position.x = height * scrollPos.offset;
    groupRef.current?.children?.forEach((child, i) => {
      const newPosition =
        (i - HALFOF_NUMBER_OF_CARDS) * CARD_OFFSET * 1 + height * scrollPos.offset;
      // child.position.set(newPosition, newPosition, 0);

      easing.damp3(child.position, [newPosition, newPosition, 0], 0.3, delta);
    });

    const box3 = new Box3().setFromObject(groupRef.current);
    const size = new Vector3();
    box3.getSize(size);

    // console.log(size);

    // console.log(groupRef.current);
  });

  // console.log(scrollPos?.offset);

  return (
    <Fragment>
      <OrbitControls enabled={false} />
      <ambientLight intensity={1} />
      {/* <Environment preset="city" /> */}
      {/* <Box args={[1, 1, 1]}>
        <meshBasicMaterial color="red" />
      </Box> */}

      {/* <mesh>
        <extrudeGeometry />
        <meshStandardMaterial
          attach="material"
          color="#080808"
          transparent
          opacity={0.7}
          side={DoubleSide}
        />
      </mesh> */}

      <group ref={groupRef} position={[0, 0, 0]}>
        {cardPositions.map((item, i) => (
          <group
            key={i}
            position={item?.position}
            rotation={item?.rotation}
            renderOrder={cardPositions.length - i}
          >
            <mesh>
              <Box args={[CARD_WIDTH, CARD_HEIGHT, 0.0001]}>
                <MeshWobbleMaterial
                  ref={wobbleRef}
                  factor={0}
                  speed={10}
                  // color={item?.color}
                  map={textures[i % textures.length]}
                  transparent
                  opacity={1}
                />
                {/* <meshStandardMaterial
                  // color={'#e2e0df'}
                  // color={item?.color}
                  transparent={true}
                  opacity={1} // Adjust the opacity as needed
                  depthWrite={false} // Disable depth writing for transparency issues
                  depthTest={false} // Disable depth testing for correct rendering order
                  blending={NormalBlending} // Set the correct blending mode
                  // map={i % 2 === 0 ? texture : texture2}
                  map={textures[i % textures.length]}
                  // toneMapped={false}
                /> */}
              </Box>
            </mesh>
          </group>
        ))}
      </group>

      <group>
        {Array(30)
          .fill(0)
          .map((_, i) => {
            return (
              <mesh key={i} position={[0, 0, -1]}>
                <Text
                  color="#dcdcdc"
                  position={[0, -i * 0.15, -1]}
                  fillOpacity={0.5}
                  {...fontProps}
                >
                  Jason Udi
                </Text>
              </mesh>
            );
          })}

        {Array(30)
          .fill(0)
          .map((_, i) => {
            return (
              <mesh key={i} position={[1, 0, -1]}>
                <Text
                  color="#dcdcdc"
                  position={[0, -i * 0.15, -1]}
                  fillOpacity={0.5}
                  {...fontProps}
                >
                  Jason Udi
                </Text>
              </mesh>
            );
          })}
      </group>
    </Fragment>
  );
}
