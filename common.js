document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.querySelector(".burger-menu");
    const sidebar = document.querySelector(".sidebar"); // Burger menu sidebar
    const bars = document.querySelectorAll('.bar'); // Select all elements with the class '.bar'

    const logoB = document.getElementById("logoB");
    const ourStaffBtn = document.getElementById("ourStaff");

    // Disable the respective buttons based on the page
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html")) {
        // If on index.html, disable logoB button
        logoB.disabled = true;
    }

    if (currentPage.includes("ourStaff.html")) {
        // If on ourStaff.html, disable the ourStaff button
        ourStaffBtn.disabled = true;
    }

    // Function to toggle burger menu
    function toggleBurgerMenu() {
        sidebar.classList.toggle("active");
        burgerMenu.classList.toggle("active"); // This triggers the animation

        // Change the background color of the bars when the sidebar is toggled
        if (sidebar.classList.contains("active")) {
            bars.forEach(bar => bar.style.backgroundColor = 'white');
        } else {
            // Reset the background color based on scroll position when sidebar is not active
            const scrollPosition = window.scrollY;
            bars.forEach(bar => {
                bar.style.backgroundColor = scrollPosition > 10 ? 'rgb(41, 20, 0)' : 'white';
            });
        }
    }

    // Event listener for burger menu
    burgerMenu.addEventListener("click", toggleBurgerMenu);

    // Scroll event listener
    window.addEventListener('scroll', function () {
        // If sidebar is active, skip scroll-related color change
        if (!sidebar.classList.contains("active")) {
            const scrollPosition = window.scrollY;
            bars.forEach(bar => {
                bar.style.backgroundColor = scrollPosition > 70 ? 'rgb(41, 20, 0)' : 'white';
            });
        }
    });
});

// Function to toggle search sidebar separately
function toggleSidebar() {
    const asideCont = document.querySelector('.asideCont');
    asideCont.classList.toggle('open');
    asideCont.classList.toggle('closed');
}


// Function to redirect to index.html
function goBackToHome() {
  window.location.href = 'index.html'; // Redirect to index.html
}
// Function to redirect to ourStaff.html
function GoToOurStaff() {
  window.location.href = 'ourStaff.html'; // Redirect to ourStaff.html
}
// Add event listener for the "Go Back" and home button
if (document.getElementById("goBackBtn")) {
  document.getElementById("goBackBtn").addEventListener("click", goBackToHome);
}
document.getElementById("logoB").addEventListener("click", goBackToHome);

// Add event listener for the "Our Staff" button
document.getElementById("ourStaff").addEventListener("click", GoToOurStaff);


