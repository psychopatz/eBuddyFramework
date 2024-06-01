import { useRef, useMemo, useEffect } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Plane, useTexture } from '@react-three/drei';
import { shaderMaterial } from '@react-three/drei';

// Define shader material outside of the component for better performance
extend({
    Pseudo3DMaterial: shaderMaterial(
        { uMouse: [0, 0], uImage: null, uDepthMap: null },
        `varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            gl_Position = projectionPosition;
            vUv = uv;
        }`,
        `precision mediump float;
        uniform vec2 uMouse;
        uniform sampler2D uImage;
        uniform sampler2D uDepthMap;
        varying vec2 vUv;

        vec4 linearTosRGB( in vec4 value ) {
            return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
        }

        void main() {
            vec4 depthDistortion = texture2D(uDepthMap, vUv);
            float parallaxMult = depthDistortion.r;
            vec2 parallax = (uMouse) * parallaxMult;
            vec4 original = texture2D(uImage, (vUv + parallax));
            gl_FragColor = linearTosRGB(original);
        }`
    )
});

const Pseudo3dImage = ({ imageUrl, depthMapUrl, imgScale =  1.1,amplitude = 0.02, timeSec = 0.5}) => {
    const depthMaterial = useRef();
    const texture = useTexture(imageUrl);
    const depthMap = useTexture(depthMapUrl);
    const { viewport } = useThree();

    // Calculate the scale to maintain aspect ratio
    const scale = useMemo(() => {
        const imageAspect = texture.image ? texture.image.width / texture.image.height : 1;
        const viewportAspect = viewport.width / viewport.height;
        const baseScale = viewportAspect > imageAspect
            ? [viewport.width, viewport.width / imageAspect, 1]
            : [viewport.height * imageAspect, viewport.height, 1];
        return baseScale.map(x => x * imgScale); // Increase scale by 10%
    }, [viewport, texture]);

    useFrame((state, delta) => {
        // Create a looping parallax movement
        const time = state.clock.getElapsedTime();
        const x = Math.sin(time * timeSec) * amplitude; // Adjust speed and amplitude as necessary
        const y = Math.cos(time * timeSec) * amplitude;
        depthMaterial.current.uMouse = [x, y];
    });

    return (
        <Plane args={[1, 1]} scale={scale}>
            <pseudo3DMaterial ref={depthMaterial} uImage={texture} uDepthMap={depthMap} />
        </Plane>
    );
}

export default Pseudo3dImage;
