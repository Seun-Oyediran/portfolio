'use client';
import React, { Fragment } from 'react';
import { SocialMedia } from '@/components/ui';
import { HeaderLoader } from '@/components/ui/loaders';
import { Canvas } from '@react-three/fiber';
import { Experience } from '@/components/3d/experience';
import { OrthographicCamera, ScrollControls } from '@react-three/drei';
import useWindowDimensions from '@/hooks/useWindowDimensions';

export default function Home() {
  const { height: _h, width: _w } = useWindowDimensions();

  const ratio = _h / _w;

  const frustum = 800;
  const horizonal = ratio < 1 ? frustum / ratio : frustum;
  const vertical = ratio < 1 ? frustum : frustum * ratio;

  return (
    <Fragment>
      <main className="">
        <div className="app_header_left">
          <HeaderLoader />
        </div>

        <div className="app_header_right">
          <HeaderLoader type="right" />
        </div>

        <div className="app_footer_left">
          <SocialMedia />
        </div>

        <div className="app_footer_right"></div>
      </main>
      <div className="app_canvas_container">
        <Canvas shadows gl={{ logarithmicDepthBuffer: true }}>
          <OrthographicCamera
            makeDefault
            zoom={200}
            position={[0, 10, 10]}
            // position={[0, 0, 0]}
            top={vertical}
            bottom={-vertical}
            left={-horizonal}
            right={horizonal}
            manual
          />

          <color attach="background" args={['#eee']} />

          <ScrollControls pages={4} infinite={!false}>
            <Experience />
          </ScrollControls>
        </Canvas>
      </div>
    </Fragment>
  );
}
