'use client';
import {
  Box,
  MeshWobbleMaterial,
  OrbitControls,
  Text,
  useScroll,
  useTexture,
} from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import React, { Fragment, useRef, useState } from 'react';
import {
  Euler,
  type Group,
  type Object3DEventMap,
  Vector3,
  type Mesh,
  type BufferGeometry,
  type NormalBufferAttributes,
  type Material,
} from 'three';
import { motion } from 'framer-motion-3d';

const SCALE = 3;
const NUMBER_OF_CARDS = 23;
const HALFOF_NUMBER_OF_CARDS = Math.floor(NUMBER_OF_CARDS / 2);
const CARD_OFFSET = 0.15 * 2 * SCALE;
const CARD_WIDTH = 1 * SCALE;
const CARD_HEIGHT = 1.1 * SCALE;

const colors2 = [
  'white',
  'black',
  'purple',
  'red',
  'blue',
  'green',
  'gold',
  'yellow',
  'orange',
  'grey',
  'indigo',
  'tomato',
  'dodgerblue',
];

const cardPositions = Array.from({ length: NUMBER_OF_CARDS }, (_, i) => ({
  position: new Vector3(
    // i * (1 + CARD_OFFSET),
    // 0,
    (i - HALFOF_NUMBER_OF_CARDS) * (CARD_OFFSET * 1),
    // i - HALFOF_NUMBER_OF_CARDS + CARD_OFFSET * CARD_WIDTH,
    (i - HALFOF_NUMBER_OF_CARDS) * (CARD_OFFSET * 1),
    0
  ),
  rotation: new Euler(0, -Math.PI / 12, 0),
  // rotation: new Euler(0, 0, 0),
  color: colors2[i % colors2.length],
  // rotation: new Euler(0, 0, 0),
}));

interface ICard {
  onPointerOver: (_index: number) => void;
  onPointerOut: (_index: number) => void;
  onClick: () => void;
  index: number;
  item: {
    position: Vector3;
    rotation: Euler;
    color: string;
  };
  hover: number;
}

const Card = (props: ICard) => {
  const { onClick, onPointerOut, onPointerOver, index } = props;

  const boxRef =
    useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(
      null
    );

  const [hovered, setHovered] = useState(false);

  const texture = useTexture('./media/images/loader.png');

  const texture2 = useTexture('./media/images/loader2.png');

  const texture3 = useTexture('./media/images/loader3.png');

  const textures = [texture, texture2, texture3];

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerOver(index);
    // meshRef.current.position.x += 1;
    setHovered(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPointerOut(-1);
    setHovered(false);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  useFrame(() => {});

  return (
    <Fragment>
      <motion.mesh
        animate={[hovered ? 'hover' : 'unhover']}
        variants={{
          hover: {
            scale: 1.08,
            x: CARD_OFFSET * 2,
            transition: {
              bounce: 0.1,
            },
          },
          unhover: {
            scale: 1,
            x: 0,
            transition: {
              bounce: 0.1,
            },
          },
        }}
      >
        <Box
          ref={boxRef}
          args={[CARD_WIDTH, CARD_HEIGHT, 0.0001]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <MeshWobbleMaterial
            // ref={wobbleRef}
            factor={0}
            map={textures[index % textures.length]}
            transparent
            opacity={1}
            polygonOffset
            polygonOffsetFactor={-0.1}
          />
        </Box>
      </motion.mesh>
      <mesh>
        <Box
          args={[CARD_WIDTH, CARD_HEIGHT, 0.00001]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Box>
      </mesh>
    </Fragment>
  );
};

export function Experience() {
  const scroll = useScroll();
  // const scrollPos = { offset: 0.4 };
  const { height, width } = useThree((state) => state.viewport);

  const [hover, setHover] = useState(-1);

  const groupRef = useRef<Group<Object3DEventMap> | null>(null);

  const fontProps = {
    font: '/fonts/abc-diatype/ABC_Diatype_Bold.woff',
    fontSize: 0.2,
    letterSpacing: -0.06,
    lineHeight: 1,
    'material-toneMapped': false,
  };

  const _angle = Math.atan(height / width);

  const scrollPreviousPos = useRef(0);

  const totalContentLength = useRef(
    NUMBER_OF_CARDS * CARD_OFFSET // Length considering spaces between boxes
  );

  useFrame((_, delta) => {
    if (!groupRef?.current) return;

    groupRef.current.children.forEach((child, i) => {
      if (scroll.offset > scrollPreviousPos.current) {
        // Scrolling down
        child.position.x += scroll.delta * 800 * delta;
        child.position.y += scroll.delta * 800 * delta;

        // easing.damp3(child.position, [child.position.x + 500 * scroll.delta, 0, 0], 0.3, delta);
      } else if (scroll.offset < scrollPreviousPos.current) {
        // Scrolling up

        child.position.x -= scroll.delta * 800 * delta;
        child.position.y -= scroll.delta * 800 * delta;
      }

      if (child.position.x > width / Math.cos(_angle) + 0.5) {
        child.position.x -= totalContentLength.current;
        child.position.y -= totalContentLength.current; // Move to the left end
      }

      if (child.position.x < -(width / Math.cos(_angle) + 0.5)) {
        child.position.x += totalContentLength.current; // Move to the right end
        child.position.y += totalContentLength.current;
      }

      child.position.z = 0.001 * i;
    });

    scrollPreviousPos.current = scroll.offset;
  });

  return (
    <Fragment>
      <OrbitControls enabled={false} />
      <ambientLight intensity={1} />

      <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {cardPositions.map((item, i) => (
          <group
            key={i}
            position={item?.position}
            rotation={item?.rotation}
            renderOrder={cardPositions.length - i}
          >
            <Card
              item={item}
              onClick={() => {}}
              onPointerOut={() => {
                setHover(-1);
              }}
              onPointerOver={() => {
                setHover(i);
              }}
              index={i}
              hover={hover}
            />
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
