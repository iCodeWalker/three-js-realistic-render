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
