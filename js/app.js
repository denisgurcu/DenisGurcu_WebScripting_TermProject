// this ensures that the code only runs after the HTML structure is completely loaded
// nested all my code in this to make is everything works smoothly, used it for multiple debugging as well 
document.addEventListener('DOMContentLoaded', () => {

   // --------------------------- GALLERY VISIBILITY ---------------------------

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(function(item, index) { //selecting all items in the gallery and looping through each one of them
        setTimeout(function() { //adding the class visible to each item with a delay. 500 is 0.5 seconds
            item.classList.add('visible');
        }, 400 * index); //  calculates a delay that increases with each item so each item becomes visible in order
    });
    

    // --------------------------- SCROLL REVEAL ---------------------------


    // Initialize ScrollReveal, I got all the directions from https://scrollrevealjs.org
    ScrollReveal ({
        reset: true, // this ensures that the animations are triggered every time the element is viewed, not just the first time. So it will replay with each scroll.
        distance: '60px', // this defines how far it will move from it's original position, I will define these positions for each item below
        duration: 2000, // the animation will last 2.5 seconds
    })

    ScrollReveal().reveal('.hero-hello, .about-title', { delay: 200, origin: 'top' }); // I am saying: "hero-hello should move after 200 miliseconds and should come from top"
    ScrollReveal().reveal('.hero-line, .about-text', { delay: 300, origin: 'bottom' }); // same as above, it is 300 now so this comes into scene after the first item
    ScrollReveal().reveal('.about-image', { delay: 400, origin: 'left' }); // same as above, it is 400 now so this comes into scene after the first item
    ScrollReveal().reveal('.gallery-title', { distance: '50px', origin: 'top'}); // same as above but this is of photography page's title 


    // --------------------------- HAMBURGER MENU ---------------------------
    
    // Storing hamburger and nav links (The element containing the navigation links) in a variable so I can add an event listener to it
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Adding click event
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggles the class active on the navigation links so the menu is shown
        hamburger.classList.toggle('toggle'); 
    });


   // --------------------------- THREE.JS ---------------------------

    // Check if Three.js is loaded - I added this during my multiple errors trying to figure out
    // it ensures that the Three.js library is properly loaded before running any code that depends on it. I am afraid to remove lol.  
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    // Create a new Three.js scene, I'll ad this sene later on.
    const scene = new THREE.Scene();
    
    // Set up a perspective camera, the aspect ratio is based on the window dimensions
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create a WebGL renderer with alpha transparency because I want to overlay it on top of my header content
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    // Sets the size of the rendering canvas to match the full width and height of the browser window - so basically, providing a full-screen 
    renderer.setSize(window.innerWidth, window.innerHeight); 
    // Adding the renderer to the HTML 
    document.querySelector('.canvas-container').appendChild(renderer.domElement);

    // After this part, it became tricky for me, still not sure how to create the exact look I want, but I am learning. 
    
    //Add lighting -  - it is to illuminate all objects in the scene equally 
    const ambientLight = new THREE.AmbientLight(0x404040); 
    scene.add(ambientLight); // add light to the scene

    // Added a point light in the hope of getting the look/shape I wanted. 
    const pointLight = new THREE.PointLight(0xffffff, 5, 100); // white color, intensity of 5, and a maximum distance of 100 units
    pointLight.position.set(50, 50, 50);//these are x y z coordinates
    scene.add(pointLight);

    // "THREE.MeshStandardMaterial" makes the surface of a 3D object look a certain way
    const material = new THREE.MeshStandardMaterial({
        color: 0xfbcce7, // it's color
        metalness: 1.0,  // metalness makes it look more or less like metal
        roughness: 1.0   // how smooth or bumpy it seems.
    });

    // This is how you actually create the shapes, the numbers represents circumference, radius, horizontal division etc.
    // Three.js has recommended version on their site but lightning, camera angle and everything else effects each other. 
    // brain is melted
    const sphereGeometry = new THREE.SphereGeometry(6, 64, 64); // SphereGeometry
    const torusGeometry = new THREE.TorusGeometry(7, 2, 50, 100);
    const coneGeometry = new THREE.ConeGeometry(5, 10, 32);

    // Now I am adding the meshes I created above to each shape.
    const sphere = new THREE.Mesh(sphereGeometry, material); 
    const torus = new THREE.Mesh(torusGeometry, material);
    const cone = new THREE.Mesh(coneGeometry, material);

    // This sets the position of each element, when changes, their entire appearance changes
    sphere.position.set(20, -20, -5); // number represent x, y, z coordinates
    torus.position.set(60, 30, -30); 
    cone.position.set(-5, 10, -10); 

    // Adding the shapes to the scene
    scene.add(sphere);
    scene.add(torus);
    scene.add(cone);

    // Setting the camera's position
    // Moving the camera along this axis changes how close or far it is from the scene.
    camera.position.z = 50;


    // --------------------------- GSAP YOYO ---------------------------

    // I LOVE GSAP!!

    // Initialize GSAP animation with slow yoyo effect
    gsap.fromTo(
        sphere.position, 
        { y: -20 }, // Start position
        {
            y: -10, // End position (moves up)
            duration: 10, // Slow down animation by increasing duration
            repeat: -1, // Infinite repeat
            yoyo: true, // Animate back and forth
            ease: "power1.inOut" // Smooth easing
        }
    );

    // Defining an animation loop for the shapes, 
    // this will be initialized later on 
    // I wasn't fully happy with the this that is why I also included the yoyo to create variety
    const animate = () => {
        requestAnimationFrame(animate);

        // Storing the rotation speed in a variable, this will be added to shapes's coordinates.
        const rotationSpeed = 0.004; // I wanted a slow speed

        // Rotate the sphere around its axis
        // this means: add rotationSpeed to sphere.rotation.x and update sphere.rotation.x with the new value
        sphere.rotation.x += rotationSpeed; 
        sphere.rotation.y += rotationSpeed;

        // Doing the same 
        torus.rotation.x += rotationSpeed;
        torus.rotation.y += rotationSpeed;
        cone.rotation.x += rotationSpeed;
        cone.rotation.y += rotationSpeed;

        // Rendering the scene so we can see everything 
        // Scene, camera, light, render, I realized these are all crucial and uses the same logic of creating a scene on Adobe After Effects/Premier Pro
        renderer.render(scene, camera);
    };

    // Start the animation loop 
    animate();

    // I believe (!) this is the way to make the 3D scene responsive and I think it is somewhat working! 
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // I added a very subtle fade-in effect to the canvas so it looks more cohesive with the scroll reveals.
    // Adding the visible class to canvas container. 
    document.querySelector('.canvas-container').classList.add('visible');


    // --------------------------- GSAP SPLIT TEXT ---------------------------


    // This is for registering the gsap plugins, SplitText splitting the text into each word/character - in my case I went with word.
    // ScrollTrigger initiates the animation as I scroll
    gsap.registerPlugin(SplitText, ScrollTrigger);


    //Getting "about-details-text" section and putting it in a variable
    // this will take the "words" parameter so it split it in to words
    const split = new SplitText(".about-details-text", {
    type: "words" // Split the text into words
    });

    // I needed to create a timeline for gsap, so I can first make it yellow and then blue.
    // I want to try this with opacity later on and play with the pin, start end position
    // THIS IS SUPER FUN
    const tl = gsap
    .timeline({
        // configuring scrolltrigger to link it to the timeline
        scrollTrigger: {
        trigger: "#about-details", // it starts when the user reaches to about details section
        start: "top top", // Animation starts when the top of the trigger element (which is about details section) hits the top of the viewport
        end: "+=150%", // Animation ends when the end of the scroll-trigger element is 150% of the viewport height
        pin: true, // pins the trigger element in place during the scroll so it gives an effect of as if the page stops and you need to scroll to continue
        scrub: 0.75, // this is the scroll smoothing factor
        markers: false // this normally shows markers "start" and "end" to visualize where it starts and ends, I made it false after I understand what is going on
        }
    })
    .set(
        split.words, // Target the splited words
        {
        color: "#ffcc66", // Set text color to yellow first
        stagger: 0.1 // change the appearance of each word by 0.1 seconds
        },
        0.1 // Apply this setting starting at 0.1 seconds in the timeline
    )
    .set(
        split.words, 
        {
        color: "#8dc6ff", // Change text color to blue
        stagger: 0.1 // Maintain the stagger appearance
        },
        0.3 // Apply this setting starting at 0.3 seconds in the timeline so it is first yellow, and then blue
    );

    

    // --------------------------- SLICK SLIDER ---------------------------

    $(document).ready(function() {
        // Initialize the slick slider
        $('.works-slider').slick({
            slidesToShow: 2, // number of slides to show at once
            slidesToScroll: 1, // number of slides to scroll at a time
            autoplay: true, // Enable autoplay
            autoplaySpeed: 3000, // time between slides in milliseconds
            arrows: true, // show next/prev arrows
            dots: true, // show navigation dots
            infinite: true, // infinite loop mode
            centerMode: false, // center the slides
            draggable: true, // enable mouse dragging
            swipe: true, // enable swipe gestures
            touchMove: true, // enable touch movement
            responsive: [
                {
                    breakpoint: 1024, // show 2 slides when the screen is 1024px or less
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,  // show 1 slide when the screen is 768px or less
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    });

});



