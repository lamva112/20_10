# Build an Interactive 3D Vietnamese Women's Day Gift Website (20/10)

Act as a senior creative frontend engineer specializing in Three.js, WebGL, interactive 3D experiences, and cinematic web animations.

Your task is to build a beautiful, romantic, interactive 3D website as a personalized Vietnamese Women's Day gift for October 20 (20/10).

Do not just create a static landing page. Build an immersive 3D experience that tells a small romantic story featuring:
1. A beautiful young woman walking in a romantic garden.
2. A cute Chihuahua walking beside her on a leash.
3. A gorgeous bouquet of pink roses and tulips that she carries.
4. A personalized Vietnamese 20/10 greeting.

The three main elements must feel like parts of the same animated scene.

## 1. Start by inspecting the project

- Inspect the existing repository, package.json, source files, and framework.
- Reuse the existing framework and project structure whenever possible.
- If the repository is empty, initialize a minimal Vite + TypeScript + Three.js project.
- Use TypeScript where appropriate.
- Do not replace existing working code unnecessarily.
- Implement the actual application, not just a plan or mockup.
- Install only the dependencies that are genuinely needed.

## 2. Visual direction

Create a premium, dreamy, cinematic 3D scene inspired by romantic animated films.

Visual characteristics:
- Warm sunset lighting with soft golden highlights.
- Pastel pink, cream, peach, and lavender colors.
- A beautiful garden path surrounded by flowers and greenery.
- Soft depth, atmospheric lighting, subtle bloom, and floating flower petals.
- Elegant typography and delicate heart-shaped accents.
- A polished, emotional, premium aesthetic rather than a generic corporate website.

The initial scene should feel magical and emotionally engaging within the first few seconds.

Avoid excessive UI panels, distracting animations, and visual clutter.

## 3. Main 3D scene

Use Three.js to build a real 3D scene.

Create:
- A garden environment with a stone pathway.
- Grass, flowers, plants, and a few decorative trees.
- Warm directional sunlight and ambient lighting.
- A perspective camera with a carefully composed view.
- A ground plane with appropriate shadows.
- Subtle atmospheric particles and falling flower petals.

Use realistic proportions and visual depth.

Prefer optimized GLB/GLTF character assets with skeletal animation when available.

Do not invent local asset paths or assume external models exist. If suitable assets are unavailable, create graceful procedural placeholders and document how to replace them with proper models.

### Character A: The girl

The girl should:
- Wear a beautiful cream or pastel floral dress.
- Have long, flowing hair.
- Hold a bouquet of pink roses and tulips.
- Hold a leash connected to the Chihuahua.
- Walk naturally along the garden path.

Animation requirements:
- Use a real walk cycle from the character model when available.
- Animate the character's position along a path.
- Add subtle secondary motion to hair, dress, arms, and the bouquet where practical.
- Ensure her movement does not look like a rigid object sliding across the ground.

If full character animation is not available, use a visually coherent placeholder and clearly separate the character controller from the rendering code so a proper animated model can be integrated later.

### Character B: The Chihuahua

The dog should:
- Be a small, adorable Chihuahua with large expressive ears.
- Wear a cute pink harness.
- Walk beside the girl on the garden path.
- Be attached to the girl's hand through a visible leash.

Animation requirements:
- Use a proper dog walk cycle if available.
- Move its legs naturally.
- Add subtle head, ear, tail, and body movement.
- Make it occasionally look around or look up at the girl.
- Keep the leash visually connected to both the girl's hand and the harness.
- Avoid having the dog drift away from the girl or slide unnaturally.

The girl and dog must move together with coordinated timing.

### Character C: The bouquet

Create a detailed bouquet with:
- Pink roses.
- Pink tulips.
- Small white filler flowers.
- Green leaves and stems.
- Elegant pink wrapping paper.
- A satin ribbon.
- A small gift tag containing the text "20/10".

The bouquet must be a real 3D object, not a flat image.

If practical, generate the flowers procedurally using custom meshes, curves, and instanced geometry. Alternatively, use optimized flower models.

Animation:
- Subtle movement as the girl walks.
- Gentle swaying of stems and leaves.
- Slight petal movement.
- Optional floating petals around the bouquet.

Keep the bouquet visually recognizable even on mobile screens.

## 4. Storytelling and animation sequence

Create a coordinated timeline using GSAP or a well-structured Three.js animation controller.

### Scene 1: Introduction
Duration: approximately 2–3 seconds.

- Fade in from a warm, darkened background.
- Reveal the sunset garden.
- Introduce softly floating particles and flower petals.
- Display a small elegant label: "20/10".

### Scene 2: The walk
Duration: approximately 4–7 seconds, then continue in a gentle loop.

- The girl walks slowly along the garden path.
- The Chihuahua walks beside her with a coordinated gait.
- The leash follows their relative positions.
- The bouquet sways naturally.
- Flower petals drift across the foreground.

The camera should gently track the characters to maintain a cinematic composition.

Avoid sudden camera movements.

### Scene 3: The gift moment

When the user clicks or taps the "Dành tặng em" button:

- Gently slow the scene.
- Let the girl and Chihuahua pause.
- Animate a few petals swirling around the bouquet.
- Reveal a personalized Vietnamese greeting.
- Add a soft glow and a subtle heart animation.

Greeting text:

"Chúc em 20/10 thật hạnh phúc ❤️"

"Chúc em luôn xinh đẹp, mạnh mẽ, bình an và luôn được yêu thương theo cách em xứng đáng."

Use elegant Vietnamese typography with correct diacritics.

Allow the recipient's name and greeting to be configured in one easy-to-edit configuration file.

## 5. Interactive features

Implement the following interactions:

1. **Camera interaction**
   - Allow gentle orbiting or horizontal rotation around the scene.
   - Support mouse dragging and touch gestures.
   - Limit camera angles to preserve the intended composition.
   - Prevent the camera from passing through the ground or objects.

2. **Bouquet interaction**
   - Make the bouquet respond subtly when clicked or tapped.
   - Trigger a small burst of flower petals.
   - Optionally show a short affectionate message.

3. **Zoom**
   - Provide a simple zoom interaction or use appropriately limited OrbitControls zoom.
   - Keep the scene comfortable to view on mobile.

4. **Music**
   - Provide an optional background music toggle.
   - Do not autoplay audio before user interaction.
   - Handle missing audio assets gracefully.

5. **Greeting**
   - The "Dành tặng em" button should reveal the main greeting with a smooth animation.
   - Include a replay button to replay the gift reveal.
   - Include a mute or pause control where appropriate.

6. **Reduced motion**
   - Respect the user's prefers-reduced-motion setting.
   - Provide a calmer animation mode.

## 6. UI and layout

Create a minimal, elegant interface layered over the 3D canvas.

Top-left:
- A small heart icon and "20/10".

Top-right:
- A discreet hint such as "Kéo để xoay".

Bottom-left:
- Optional compact controls for zoom, music, and replay.

Center or right side:
- A greeting that appears only at the appropriate moment.

Primary button:
- "Dành tặng em →"

Design requirements:
- Use a readable, elegant font.
- Use subtle translucent backgrounds where necessary.
- Avoid large opaque cards that hide the 3D scene.
- Use smooth fade and slide transitions.
- Ensure Vietnamese characters render correctly.
- Avoid text overlapping the girl or the dog.

## 7. Technical architecture

Use a clean, maintainable structure. Adapt this structure to the existing repository rather than forcing it if a better structure already exists.

Suggested modules:

- `src/main.ts` — application entry point.
- `src/scene/createScene.ts` — scene, camera, renderer, and lighting.
- `src/scene/createEnvironment.ts` — garden and pathway.
- `src/characters/GirlController.ts` — girl model, movement, and animation.
- `src/characters/ChihuahuaController.ts` — dog model, gait, and leash.
- `src/objects/createBouquet.ts` — procedural bouquet and flower animations.
- `src/animation/TimelineController.ts` — coordinated story and reveal timeline.
- `src/ui/` — greeting, buttons, and controls.
- `src/config.ts` — greeting, character settings, and scene configuration.
- `public/models/` — documented location for character GLB/GLTF assets.
- `public/audio/` — optional background music.

Use `GLTFLoader` and `AnimationMixer` for animated GLB/GLTF assets when applicable.

Use `OrbitControls` with sensible limits if it fits the desired camera experience.

Use `Raycaster` for selecting the bouquet or other interactive objects.

Use `requestAnimationFrame` or Three.js's animation loop appropriately. Ensure animation updates use delta time and handle tab visibility changes sensibly.

Separate animation logic from rendering logic.

Clean up event listeners, geometries, materials, and textures when disposing of resources.

## 8. Asset and dependency strategy

Character models are the most important dependency.

Do not rely on an unavailable model URL or pretend that a missing asset exists.

If external assets cannot be obtained:
- Build the environment and bouquet procedurally.
- Create a clean asset-loading abstraction.
- Provide clear placeholders for the girl and dog.
- Document exactly which animated GLB/GLTF models are required and where to put them.
- Make the scene run even when models are missing.

Prefer properly licensed assets. Document asset sources and license requirements when applicable.

Do not use a static image as a substitute for the entire interactive 3D scene.

## 9. Performance and responsive behavior

Target a smooth experience on modern desktop browsers and reasonably capable mobile devices.

Requirements:
- Use device pixel ratio limits.
- Avoid unnecessarily high polygon counts.
- Use instancing for repeated flowers and particles when useful.
- Avoid creating new geometries or materials every frame.
- Handle window resizing.
- Provide a loading screen with progress where possible.
- Show a graceful fallback if WebGL is unavailable.
- Pause or reduce nonessential animation when the page is hidden.
- Optimize mobile camera composition and UI placement.
- Avoid excessive post-processing.

The page must remain usable on narrow screens.

## 10. Quality requirements

- No broken imports.
- No fake controls that do nothing.
- No placeholder buttons without implemented behavior.
- No missing asset errors that crash the application.
- No TypeScript errors.
- No console errors caused by the application.
- No text clipping or broken Vietnamese characters.
- No uncontrolled animation loops.
- No obvious intersection between the dog, the girl, and the ground.
- No broken leash connections during movement.

If a full animated character cannot be implemented because a model is unavailable, make the rest of the experience functional and clearly explain what remains dependent on external assets.

## 11. Execution instructions

Work directly in the repository.

Follow this sequence:
1. Inspect the project.
2. Briefly identify the existing stack and implementation approach.
3. Implement the working application.
4. Install any required dependencies.
5. Run the available build, type-check, and lint commands.
6. Fix errors introduced by your changes.
7. Verify that the page runs and that interactive controls work.
8. Document how to run the project and how to add or replace character models.
9. Provide a concise summary of completed features and remaining limitations.

Do not stop after describing the solution. Implement as much of the actual working application as possible.

The final result should feel like a small interactive romantic 3D film created as a personalized 20/10 gift, with the girl, Chihuahua, bouquet, environment, and greeting working together as one coherent experience.