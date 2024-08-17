// --------------------------- GSAP DRAGGABLE ---------------------------

// A function to  position items randomly within a container.
function randomizeItemPositions() {
    const container = document.getElementById('logos'); // select all elements with the ID logo,
    // getBoundingClientRect( part checks the container element’s position and size, and I'm storing it into a variable I'll use it below 
    const containerRect = container.getBoundingClientRect(); 

    // An array function that will go through each logo item that is I plan to make draggable 
    document.querySelectorAll('.drag-item').forEach(item => {
        // the size and position of the current draggable item
        const itemRect = item.getBoundingClientRect();
         // This calculates how far the item can move horizontally within the container that I selected above - so it doesn’t go outside of the container
        const maxX = containerRect.width - itemRect.width;
        // This does the same but vertically
        const maxY = containerRect.height - itemRect.height;

        //Sets the horizontal and vertical position of the item to a random place within
        item.style.left = `${Math.random() * maxX}px`;
        item.style.top = `${Math.random() * maxY}px`;
    });
}

// calling the randomizeItemPositions function
function initialize() {
    randomizeItemPositions();

    // registering the GSAP the Draggable plugin
    gsap.registerPlugin(Draggable);
    //This makes all elements with the class .drag-item draggable within the bounds of the logos container I defined in my CSS
    Draggable.create(".drag-item", {
        bounds: "#logos"
    });
    

// --------------------------- ANIMATING DRAGABBLE ELEMENTS ---------------------------

// The below is to make drag items visible with fade-in effect

    //selecting all draggable items and looping through each one of them
    const dragItems = document.querySelectorAll(".drag-item");
    dragItems.forEach(function(item, index) {
        setTimeout(function() { //adding the class visible to each item with a delay. 500 is 0.5 seconds
            item.classList.add("visible");
        }, 500 * index); // calculating a delay that increases with each item so they show up in order
    });
    
// --------------------------- SCROLL REVEAL FOR TEXT ---------------------------

    // Initialize ScrollReveal for the title
    ScrollReveal().reveal('#logos-title', {
        origin: 'top', // start from top 
        distance: '20px', //move up by 20 pixels 
        duration: 2000, // it will last 2 seconds
        delay: 0 // starts immediately as the page loads 
    });

    // Initialize ScrollReveal for the text same as above except it starts with a delay so it is after the title animates
    ScrollReveal().reveal('#logos-text', {
        origin: 'bottom',
        distance: '20px',
        duration: 2000,
        delay: 500
    });


}

// Call the initialize function on page load
window.onload = initialize;

// This is for responsiveness it makes it a bit jumpy, I couldn't figure out a better way. But it happens as you resize the screen
// so in a real life scenario people don't resize their screen and just open it in a smaller screen right away which is why I kept it
// it updates positions on window resize
window.addEventListener('resize', randomizeItemPositions);

    // --------------------------- HAMBURGER MENU  ---------------------------

    // I added hamburger menu script here too because even though my main js was attached it was not working
    // Tried a few debugging but ended up adding this
    

    // Storing hamburger and nav links (The element containing the navigation links) in a variable so I can add an event listener to it
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
        
    // Adding click event
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active'); // Toggles the class active on the navigation links so the menu is shown
        hamburger.classList.toggle('toggle'); 
    });
