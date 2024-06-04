    function main() {
      const canvas = document.querySelector('canvas');
      const renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const fov = 45;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 100;
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.set(0, 10, 20);

      const controls = new OrbitControls(camera, canvas);
      controls.target.set(0, 5, 0);
      controls.update();

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('black');

      // Create the ground plane
      {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
      }

      // Add hemisphere light
      {
        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
      }

      // Add directional light
      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);
        scene.add(light.target);
      }

      // Create the windmill
      const windmill = new THREE.Group();

      // Create the base
      const baseGeo = new THREE.BoxGeometry(5, 1, 5);
      const baseMat = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.5;
      windmill.add(base);

      // Create the tower (make it thinner by reducing the radius)
      const towerGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 32); // Adjusted radii to 0.5
      const towerMat = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = 6;
      windmill.add(tower);

      // Create the blades
      const bladeGeo = new THREE.CylinderGeometry(0, 0.5, 4, 32);
      const bladeMat = new THREE.MeshPhongMaterial({ color: 0x00FFFF });

      function createBlade() {
        const blade = new THREE.Group();

        const cone1 = new THREE.Mesh(bladeGeo, bladeMat);
        const cone2 = new THREE.Mesh(bladeGeo, bladeMat);
        cone1.position.y = 2;
        cone2.position.y = -2;
        cone2.rotation.z = Math.PI;

        blade.add(cone1);
        blade.add(cone2);

        return blade;
      }

      const blade1 = createBlade();
      const blade2 = createBlade();
      const blade3 = createBlade();
      const blade4 = createBlade();

      blade1.rotation.z = 0;
      blade2.rotation.z = Math.PI / 2;
      blade3.rotation.z = Math.PI;
      blade4.rotation.z = 3 * Math.PI / 2;

      const blades = new THREE.Group();
      blades.add(blade1);
      blades.add(blade2);
      blades.add(blade3);
      blades.add(blade4);

      blades.position.y = 10; 
      blades.position.x = 0; 
      base.position.y = -0.3; // Adjusted height for blades
      windmill.add(blades);

      scene.add(windmill);

      let isWindmillRotating = false;
      document.getElementById('rotateCheckbox').addEventListener('change', (event) => {
        isWindmillRotating = event.target.checked;
      });

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      function render(time) {
        time *= 0.001;

        if (isWindmillRotating) {
          blades.rotation.z += 0.01;
        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    }

    main();