import { Box, Environment, OrbitControls, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { Fragment, useRef } from 'react';
import { type Group, type Object3DEventMap } from 'three';

const BOX_WIDTH = 0.5;
const BOX_GAP = 0.2;

const colors = ['red', 'blue', 'green'];

const colors2 = [
  'white',
  'black',
  'purple',
  'red',
  'blue',
  // 'green',
  // 'gold',
  // 'yellow',
  // 'orange',
  // 'grey',
  // 'indigo',
  // 'tomato',
  // 'dodgerblue',
];

// const GROUP_WIDTH = colors2.length * (BOX_WIDTH + BOX_GAP);

interface IItem {
  color: string;
  index: number;
}

function getBarPosition(x: number, theta: number) {
  // Ensure x is within [0, 1]
  x = x % 1;
  if (x < 0) {
    x += 1;
  }

  // Calculate the coordinates and scale them
  const u = x * Math.cos(theta);
  const v = x * Math.sin(theta);

  return { u, v };
}

const Item = (props: IItem) => {
  const { index } = props;
  const { width, height } = useThree((state) => state.viewport);
  const scroll = useScroll();

  const lastScrollPosition = useRef(0);

  const groupRef = useRef<Group<Object3DEventMap> | null>(null);

  const diagonal = Math.sqrt(width * width + height * height);

  const angle = Math.atan(height / width);

  // const boxes = (diagonal + BOX_GAP) / (BOX_GAP + BOX_WIDTH);

  useFrame(() => {
    if (!groupRef.current) return;
    // if (height * 2 < groupRef?.current?.position?.y) {
    //   groupRef.current.position.y = -height;
    //   groupRef.current.position.x = -width;
    // }
    const pos = getBarPosition(scroll.offset, angle);
    groupRef.current.position.x = -width * index + pos.u * diagonal;
    groupRef.current.position.y = -height * index + pos.v * diagonal;

    // if (-height * 2 > groupRef?.current?.position?.y) {
    //   groupRef.current.position.y = height;
    //   groupRef.current.position.x = width;
    // }

    // if (scroll.offset > lastScrollPosition.current) {
    //   groupRef.current.position.y =
    //     Math.sin(angle) * diagonal * scroll.delta * 2 + groupRef.current.position.y;
    //   groupRef.current.position.x =
    //     Math.cos(angle) * diagonal * scroll.delta * 2 + groupRef.current.position.x;
    // }
    // if (scroll.offset < lastScrollPosition.current) {
    //   groupRef.current.position.y =
    //     groupRef.current.position.y - Math.sin(angle) * diagonal * scroll.delta * 2;
    //   groupRef.current.position.x =
    //     groupRef.current.position.x - Math.cos(angle) * diagonal * scroll.delta * 2;
    // }
    // groupRef.current.rotation.z = -(Math.PI * 2) * scroll.offset;

    lastScrollPosition.current = scroll.offset;
  });

  return (
    <group ref={groupRef} position={[-width * index, -height * index, 0]} rotation={[0, 0, angle]}>
      {colors2.map((item, i) => (
        <Box
          key={i}
          args={[0.5, 1, 0.5]}
          position={[(i - Math.floor(colors2.length / 2)) * (BOX_GAP + BOX_WIDTH), 0, 0]}
        >
          <meshStandardMaterial color={item} />
        </Box>
      ))}
      {/* <Box args={[colors2.length * (BOX_WIDTH + BOX_GAP) - BOX_GAP, 0.1, 0.1]}>
        <meshStandardMaterial color={color} />
      </Box> */}

      {/* <Box args={[diagonal, 0.1, 0.1]}>
        <meshStandardMaterial color={color} />
      </Box> */}
    </group>
  );
};

export default function Test() {
  return (
    <Fragment>
      <OrbitControls enabled={false} />
      <ambientLight intensity={0.1} />
      <Environment preset="sunset" />

      {colors.map((item, i) => {
        return <Item key={i} color={item} index={i} />;
      })}
    </Fragment>
  );
}
