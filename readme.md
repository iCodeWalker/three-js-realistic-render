# Three.js Realistic Render

1. We are going to use an environment map to illuminate the model but we will need DirectionalLight to have more control and create shadows.

2. Using environment map the color of the environment is applied to the model.
   The lighting will be taken care by the environment map.
   An environment map is like a photo of surrounding and it can be a 360 photo or 6 photos that compose a cube.
   We will use environment map both for the background and to illuminate our model.

3. We can apply the environment map to the materials with 'envMap' and we need to traverse the object to update each material. Create a updateAllMaterials and traverse the whole 'scene.

4. There is an easier way of applying the environment map to all objects with the 'environment' property on the scene

scene.environment = environmentMap
But still we need to apply the envMapIntensity on each material

5. The 'outputEncoding' property controls the output render encoding.
   The default 'outputEncoding' is THREE.LinearEncoding and we should use THREE.sRGBEncoding

renderer.outputEncoding = THREE.sRGBEncoding

THREE.GammaEncoding : the gamma encoding is a way of storing colors while optimizing how bright and dark values are stored according to human eye sensitivity.

When we use the sRGBEncoding, it's like using the GammaEncoding with a default gamma factor of 2.2

6. Tone Mapping

   1. Tone mapping is to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.
   2. We can see lights of image where the color values can go beyond 1.

   We can change the toneMapping property on the WebGLRenderer with the following values.

   1. THREE.NoToneMapping(default).
   2. THREE.LinearToneMapping.
   3. THREE.ReinhardToneMapping.
   4. THREE.CineonToneMapping.
   5. THREE.ACESFilmicToneMapping

   We can also change the tone mapping exposure. The amount of light the algorithm let.
   renderer.toneMappingExposure = 3

7. Antialiasing
   Aliasing appears like a stair-like effect on the edges of the geometies when we zoom it.
   This is due to the renderer having to choose if the geometry is in pixel or not.

   One easy solution is to increase our render's resolution to the double in which 1 pixel color will automatically be divided into 4 px rendered. This is called super sampling (SSAA) or fullscreen sampling (FSAA), it's easy and efficient but not performant.

   Another solution named multi sampling (MSAA) also render multiple values per pixel (usually 4) like for super sampling but only on the geometry edges.

8. Shadows
   To activate the shadow on WebGLRenderer and change the shadow type to THREE.PCFSoftShadowMap

   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;

9. Shadow Acne
   We see lines on the surface of the textures and this is called Shadow acne, and occur on both smooth and flat surfaces for precision reasons when calculating if the surface is in shadow or not.

   The hamburger is casting a shadow on it's own surface.

   We can use shadow's 'bias' and 'normalBias' to fix this.

   1. The 'bias' usually helps for flat surfaces.
   2. The 'normalBias' usually helps for rounded surfaces, which is in burger case. We have to increase it until the shadow acne is barely visible.

   For solving shadow acne we move the surface more inside the real texture along the normal, so our shadow is inside the surface that we saw.

   directionalLight.shadow.normalBias = 0.05;
