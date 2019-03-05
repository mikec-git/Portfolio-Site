import materials from './materials';
import slides from './slides';
import * as gpu from './gpuCompRenderer';
import * as scriptsAndShaders from './scriptsAndShaders';
import water from '../../../Assets/img/water.jpg';

// Shapes
export const createXShape = (THREE) => {
  let xShape = new THREE.Shape();
  let x = 0;
  let y = 0;
  
  let xFoot = 1;
  let xEdge = 3;
  let curve = 0.6;
  
  xShape.moveTo( x, y ); // Start Vertex
  xShape.bezierCurveTo(
    x - curve, y - curve, 
    x + xFoot - curve, y - xFoot - curve, 
    x + xFoot, y - xFoot); // Bottom Left Vertex
  
  xShape.lineTo( x + xFoot + xEdge, y - xFoot + xEdge );
  xShape.lineTo( x + xFoot + 2*xEdge, y - xFoot );
  
  xShape.bezierCurveTo(
    x + xFoot + 2*xEdge + curve, y - xFoot - curve, 
    x + 2*xFoot + 2*xEdge + curve, y - curve, 
    x + 2*xFoot + 2*xEdge, y); // Bottom Right Vertex

  xShape.lineTo( x + 2*xFoot + xEdge, y + xEdge );
  xShape.lineTo( x + 2*xFoot + 2*xEdge, y + 2*xEdge );
  xShape.bezierCurveTo(
    x + 2*xFoot + 2*xEdge + curve, y + 2*xEdge + curve, 
    x + xFoot + 2*xEdge + curve, y + 2*xEdge + xFoot + curve, 
    x + xFoot + 2*xEdge, y + 2*xEdge + xFoot); // Top Right Vertex

  xShape.lineTo( x + xFoot + xEdge, y + xEdge + xFoot );
  xShape.lineTo( x + xFoot, y + 2*xEdge + xFoot );
  xShape.bezierCurveTo(
    x + xFoot - curve, y + 2*xEdge + xFoot + curve, 
    x - curve, y + 2*xEdge + curve, 
    x, y + 2*xEdge); // Top Left Vertex

  xShape.lineTo( x + xEdge, y + xEdge );
  xShape.lineTo( 0, 0 ); // End Vertex

  return new THREE.ShapeGeometry( xShape );
}

export const createHollowSquareShape = (THREE) => {
  let squareShape       = new THREE.Shape();
  let innerSquareShape  = new THREE.Shape();
  let x = 0;
  let y = 0;
  let innerX = 1.15;
  let innerY = 1.15;

  let squareEdge = 7;
  let innerSquareEdge = squareEdge - innerX*2;
  let curveOffset = 0.8;
  let indent = 0.05;
  let curve = 0.45;

  squareShape.moveTo( x, y + curveOffset ); // Start Vertex
  squareShape.bezierCurveTo( 
    x + indent, y + curveOffset - curve, 
    x + curveOffset - curve, y + indent, 
    x + curveOffset, y ); // Bottom Left Curve

  squareShape.lineTo( x + squareEdge - curveOffset, y ); 
  squareShape.bezierCurveTo( 
    x + squareEdge - curveOffset + curve, y + indent, 
    x + squareEdge - indent, y + curveOffset - curve, 
    x + squareEdge, y + curveOffset ); // Bottom Right Curve

  squareShape.lineTo( x + squareEdge, y + squareEdge - curveOffset );
  squareShape.bezierCurveTo( 
    x + squareEdge - indent, y + squareEdge - curveOffset + curve, 
    x + squareEdge - curveOffset + curve, y + squareEdge - indent, 
    x + squareEdge - curveOffset, y + squareEdge ); // Top Right Curve
  
  squareShape.lineTo( x + curveOffset, y + squareEdge );
  squareShape.bezierCurveTo( 
    x + curveOffset - curve, y + squareEdge - indent, 
    x + indent, y + squareEdge - curveOffset + curve,
    x, y + squareEdge - curveOffset ); // Top Left Curve

  squareShape.lineTo( x, y + curveOffset ); // End Vertex
  
  innerSquareShape.moveTo( innerX, innerY );
  innerSquareShape.lineTo( innerX + innerSquareEdge, innerY );
  innerSquareShape.lineTo( innerX + innerSquareEdge, innerY + innerSquareEdge );
  innerSquareShape.lineTo( innerX, innerY + innerSquareEdge );
  innerSquareShape.lineTo( innerX, innerY );

  squareShape.holes.push(innerSquareShape);
  return new THREE.ShapeGeometry(squareShape);
}

export const createHollowTriangleShape = (THREE) => {
  let triangleShape       = new THREE.Shape();
  let innerTriangleShape  = new THREE.Shape();
  let x = 0;
  let y = 0;
  let innerX = 1.75;
  let innerY = 0.95;

  let triEdge = 7;
  let innerTriEdge = triEdge - innerX*1.75;
  let curveOffset = 0.3;
  let indent = 0.05;
  let curve = 0.4;
  let btmEdgeFactor = 1.15;
  let offsetFactor = 0.1;

  triangleShape.moveTo( x + curveOffset, y ); // Start Vertex
  triangleShape.lineTo( x + triEdge*btmEdgeFactor - curveOffset, y ); 
  triangleShape.bezierCurveTo( 
      x + triEdge*btmEdgeFactor - curveOffset + curve, y, 
      x + triEdge*btmEdgeFactor + curveOffset*offsetFactor + indent/2, y + curveOffset/1.2 - indent*2,
      x + triEdge*btmEdgeFactor + curveOffset*offsetFactor, y + curveOffset/1.2 ); // Bottom Right Curve
    
  triangleShape.lineTo(x + triEdge*btmEdgeFactor/2 + curveOffset, y + triEdge - curveOffset);
  triangleShape.bezierCurveTo(
    x + triEdge*btmEdgeFactor/2 + curveOffset - curve/1.75, y + triEdge - curveOffset + curve, 
    x + triEdge*btmEdgeFactor/2 - curveOffset + curve/1.75, y + triEdge - curveOffset + curve, 
    x + triEdge*btmEdgeFactor/2 - curveOffset, y + triEdge - curveOffset); // Top Curve

  triangleShape.lineTo( x - curveOffset*offsetFactor, y + curveOffset/1.2 );
  triangleShape.bezierCurveTo( 
    x - curveOffset*offsetFactor - indent/2, y + curveOffset/1.2 - indent*2, 
    x + curveOffset - curve, y, 
    x + curveOffset, y ); // Bottom Left Curve + End Vertex

  // Inner
  innerTriangleShape.moveTo( innerX + curveOffset, innerY ); // Start Vertex
  innerTriangleShape.lineTo( innerX + innerTriEdge*btmEdgeFactor - curveOffset, innerY ); 
  innerTriangleShape.bezierCurveTo( 
      innerX + innerTriEdge*btmEdgeFactor - curveOffset + curve, innerY, 
      innerX + innerTriEdge*btmEdgeFactor + curveOffset*offsetFactor + indent/2, innerY + curveOffset/1.2 - indent*2,
      innerX + innerTriEdge*btmEdgeFactor + curveOffset*offsetFactor, innerY + curveOffset/1.2 ); // Bottom Right Curve
    
  innerTriangleShape.lineTo(innerX + innerTriEdge*btmEdgeFactor/2 + curveOffset, innerY + innerTriEdge - curveOffset);
  innerTriangleShape.bezierCurveTo(
    innerX + innerTriEdge*btmEdgeFactor/2 + curveOffset - curve/1.75, innerY + innerTriEdge - curveOffset + curve, 
    innerX + innerTriEdge*btmEdgeFactor/2 - curveOffset + curve/1.75, innerY + innerTriEdge - curveOffset + curve, 
    innerX + innerTriEdge*btmEdgeFactor/2 - curveOffset, innerY + innerTriEdge - curveOffset); // Top Curve

  innerTriangleShape.lineTo( innerX - curveOffset*offsetFactor, innerY + curveOffset/1.2 );
  innerTriangleShape.bezierCurveTo( 
    innerX - curveOffset*offsetFactor - indent/2, innerY + curveOffset/1.2 - indent*2, 
    innerX + curveOffset - curve, innerY, 
    innerX + curveOffset, innerY ); // Bottom Left Curve + End Vertex

  triangleShape.holes.push(innerTriangleShape);
  return new THREE.ShapeGeometry(triangleShape);
}

export const createShapeTexture = (materialInfo) => {
  let size = 512;
  
  // Create canvas
  let canvas    = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  
  // Get context
  let context = canvas.getContext('2d');

  // Draw gradient
  context.rect(0, 0, size, size);
  let gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, materialInfo.color); 
  // Can add another color but need to modify materials.js...
  gradient.addColorStop(1, materialInfo.color); 
  context.fillStyle = gradient;
  context.fill();
  
  return canvas;
}

// CREATE BACKGROUND OBJECTS
export const createShapes = (THREE, memoizedShapes) => {    
  // Iterate over each slide page
  for(const pageNum in slides) {
    // Iterate over each page's subpage (if any)
    for(const subPageNum in slides[pageNum]) {
      let subPage = slides[pageNum][subPageNum];
      let shapes  = subPage.shapes;

      if(shapes) {
        const group = new THREE.Group();    
        // For each subpage's shapes...
        for (let i = 0; i < shapes.length; i++) {
          const shape   = shapes[i];
          const materialInfo = materials[shape.materialId];
          // Gets texture info from local function...
          const texture = new THREE.Texture(createShapeTexture(materialInfo));
          texture.needsUpdate = true;
          // Maps texture to variable
          const material = new THREE.MeshBasicMaterial({
            map: texture, 
            transparent: true
          });
          
          // Create corresponding shape geometry
          let geometry = null;
          if(shape.id === 0) {
            geometry = new THREE.RingGeometry( 5, 7, 35 );
          } else if(shape.id === 1) {
            geometry = createHollowSquareShape(THREE);
          } else if(shape.id === 2) {
            geometry = createXShape(THREE);
          } else if(shape.id === 3) {
            geometry = createHollowTriangleShape(THREE);
          } else {
            geometry = new THREE.RingGeometry( 5, 7, 4 );
          }
          
          let object = new THREE.Mesh(geometry, material);
          
          // Used for identifying which scene objects to animate
          if(shape.name) {
            object.name = shape.name
          };
    
          // Clones each object and sets scale + position (reference type)
          for(let j = 0; j < shape.pos.length; j++) {
            const objectClone = object.clone();
            objectClone.position.set(...shape.pos[j]);
            shape.scale && objectClone.scale.set(shape.scale[j], shape.scale[j], shape.scale[j]);
            group.add(objectClone);
          }
        }      
        
        // Keeps shapes saved in object
        memoizedShapes[subPage.name + subPageNum] = group;
      }
    }
  }

  const shapesInit = true;
  return shapesInit;
}  

// Creating noise particle backround
export const createNoiseBgParticles = (THREE, renderer) => {
  const noiseParticlesShaders = scriptsAndShaders.noiseParticles(THREE);

  const textureSize   = 512 / 2;
  const textureHeight = textureSize;
  const textureWidth  = textureSize * 1;
  const points        = textureHeight * textureSize;

  const vertices    = new Float32Array(points*3).fill(0),
        references  = new Float32Array(points*2);
  
  for(let i = 0; i < references.length; i+=2) {
    const indexVertex = i / 2;
    references[i]   = (indexVertex%textureWidth) / textureWidth;
    references[i+1] = Math.floor(indexVertex/textureWidth) / textureHeight;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.addAttribute('reference', new THREE.BufferAttribute(references, 2));

  // Sets variables for shader code
  const uniformsNoiseBg = {
    texturePosition: { value: null },
    hue1:   { value: 1 },
    hue2:   { value: 1 },
    hue3:   { value: 1 },
    alpha:  { value: 0.5 }
  };
  
  // Create new shader material with fragment + vertex shaders
  const material = new THREE.ShaderMaterial({
    uniforms: uniformsNoiseBg,
    fragmentShader: noiseParticlesShaders.shaderPointFragment,
    vertexShader: noiseParticlesShaders.shaderPointVertex,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  
  const particles = new THREE.Points(geometry, material);

  // Position of particle origin
  particles.position.z = 11;
  particles.position.y = 0.25;
  const memoizedNoiseBg = particles.clone();

  // Set up gpu renderer
  const gpuComputationRenderer = new gpu.GPUComputationRenderer(textureWidth, textureHeight, renderer);

  const dataPosition = gpuComputationRenderer.createTexture();
  const dataVelocity = gpuComputationRenderer.createTexture();
  const textureArraySize = textureWidth * textureHeight * 4;

  for (let i = 0; i < textureArraySize; i += 4) {
    const radius      = (1 - Math.pow(Math.random(), 3)) * 0.95;
    const azimuth     = Math.random() * Math.PI * 1;
    const inclination = Math.random() * Math.PI * 2;

    dataPosition.image.data[i]    = radius * Math.sin(azimuth) * Math.cos(inclination);
    dataPosition.image.data[i+1]  = radius * Math.cos(azimuth);
    dataPosition.image.data[i+2]  = radius * Math.sin(azimuth) * Math.sin(inclination);
    
    dataVelocity.image.data[i]    = 0;
    dataVelocity.image.data[i+1]  = 0;
    dataVelocity.image.data[i+2]  = 0;
    dataVelocity.image.data[i+3]  = 1;
  }
  
  const variableVelocity = gpuComputationRenderer
    .addVariable('textureVelocity', noiseParticlesShaders.shaderSimulationVelocity, dataVelocity);
  const variablePosition = gpuComputationRenderer
    .addVariable('texturePosition', noiseParticlesShaders.shaderSimulationPosition, dataPosition);

  variablePosition.material.uniforms.delta = { value: 0 };

  gpuComputationRenderer
    .setVariableDependencies(variableVelocity, [variableVelocity, variablePosition]);
  gpuComputationRenderer
    .setVariableDependencies(variablePosition, [variableVelocity, variablePosition]);

  variablePosition.wrapS = THREE.RepeatWrapping;
  variablePosition.wrapT = THREE.RepeatWrapping;
  variableVelocity.wrapS = THREE.RepeatWrapping;
  variableVelocity.wrapT = THREE.RepeatWrapping;

  gpuComputationRenderer.init();

  const noiseBgRandFactor = Math.random()*Date.now();
  const random = [noiseBgRandFactor, 0.5*noiseBgRandFactor, 0.25*noiseBgRandFactor];

  return {
    uniformsNoiseBg,
    particles,
    gpuComputationRenderer,
    variablePosition,
    random,
    memoizedNoiseBg
  }
}

// Creates the spiky noise ball sphere 
export const createNoiseSphere = (THREE) => {
  const noiseSphereShaders = scriptsAndShaders.noiseSphere();

  const curTime = Date.now();
  const uniformsNoiseSphere = {
    amplitude:  { value: 1 },
    alpha:      { value: 1.0 },
    color:      { value: new THREE.Color( 0xff2200 ) },
    texture:    { value: new THREE.TextureLoader().load(water) }
  };

  // Wrap the texture horizontally/vertically and map to UV for shaders
  uniformsNoiseSphere.texture.value.wrapS = THREE.RepeatWrapping;
  uniformsNoiseSphere.texture.value.wrapT = THREE.RepeatWrapping;

  // Create shader materials
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniformsNoiseSphere,
    vertexShader: noiseSphereShaders.vertexShaderNoise,
    fragmentShader: noiseSphereShaders.fragmentShaderNoise,
    transparent: true
  });

  // Init raw geometry shape
  const radius    = 9;
  const segments  = 128;
  const rings     = 64;
  const geometry  = new THREE.SphereBufferGeometry(radius, segments, rings);  

  const displacementNoiseSphere = new Float32Array(geometry.attributes.position.count);
  const noise = new Float32Array(geometry.attributes.position.count);
  
  for(let i = 0; i < displacementNoiseSphere.length; i++) {
    noise[i] = Math.random() * 5;
  }

  geometry.addAttribute('displacement', new THREE.BufferAttribute(displacementNoiseSphere, 1));
  const sphere = new THREE.Mesh( geometry, shaderMaterial );

  const memoizedNoiseSphere = sphere.clone();

  return {
    curTime,
    uniformsNoiseSphere,
    displacementNoiseSphere,
    noise,
    sphere,
    memoizedNoiseSphere
  }
}

// Init lights for scene
export const createLights = (THREE) => {
  const ambientLight = new THREE.AmbientLight(0xcccccc, 1.0);
  const pointLight   = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(35, 25, 20);
  
  return [ambientLight, pointLight];
}