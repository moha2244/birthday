document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector("nav ul");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((navLink) => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll("section");
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  // Package selection
  const packageButtons = document.querySelectorAll(".select-package");
  packageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const packageType = this.getAttribute("data-package");
      const bookingForm = document.getElementById("partyBookingForm");

      // Scroll to booking form
      document.querySelector("#booking").scrollIntoView({
        behavior: "smooth",
      });

      // Set the selected package
      const packageSelect = document.getElementById("bookingPackage");
      packageSelect.value = packageType;

      // Highlight the selected option
      packageSelect.querySelectorAll("option").forEach((option) => {
        if (option.value === packageType) {
          option.selected = true;
        }
      });

      // Add animation to form
      bookingForm.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        bookingForm.classList.remove("animate__animated", "animate__pulse");
      }, 1000);
    });
  });

  // Testimonial slider
  const testimonials = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial) =>
      testimonial.classList.remove("active")
    );
    dots.forEach((dot) => dot.classList.remove("active"));

    testimonials[index].classList.add("active");
    dots[index].classList.add("active");
    currentTestimonial = index;
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showTestimonial(index));
  });

  prevBtn.addEventListener("click", () => {
    let newIndex = currentTestimonial - 1;
    if (newIndex < 0) newIndex = testimonials.length - 1;
    showTestimonial(newIndex);
  });

  nextBtn.addEventListener("click", () => {
    let newIndex = currentTestimonial + 1;
    if (newIndex >= testimonials.length) newIndex = 0;
    showTestimonial(newIndex);
  });

  // Auto-rotate testimonials
  let testimonialInterval = setInterval(() => {
    let newIndex = currentTestimonial + 1;
    if (newIndex >= testimonials.length) newIndex = 0;
    showTestimonial(newIndex);
  }, 5000);

  // Pause auto-rotation on hover
  const sliderContainer = document.querySelector(".testimonials-slider");
  sliderContainer.addEventListener("mouseenter", () => {
    clearInterval(testimonialInterval);
  });

  sliderContainer.addEventListener("mouseleave", () => {
    testimonialInterval = setInterval(() => {
      let newIndex = currentTestimonial + 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      showTestimonial(newIndex);
    }, 5000);
  });

  // Form validation
  const bookingForm = document.getElementById("partyBookingForm");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector(".submit-text");
    const spinner = submitBtn.querySelector(".loading-spinner");

    submitText.style.display = "none";
    spinner.style.display = "inline-block";

    // Validate form
    let isValid = true;
    const requiredFields = this.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      const errorMessage = field.parentElement.querySelector(".error-message");

      if (!field.value.trim()) {
        errorMessage.textContent = "This field is required";
        errorMessage.style.display = "block";
        field.style.borderColor = "#ff4757";
        isValid = false;
      } else {
        errorMessage.style.display = "none";
        field.style.borderColor = "#ddd";

        // Additional validation for specific fields
        if (field.id === "bookingEmail" && !validateEmail(field.value)) {
          errorMessage.textContent = "Please enter a valid email address";
          errorMessage.style.display = "block";
          field.style.borderColor = "#ff4757";
          isValid = false;
        }

        if (field.id === "bookingPhone" && !validatePhone(field.value)) {
          errorMessage.textContent = "Please enter a valid phone number";
          errorMessage.style.display = "block";
          field.style.borderColor = "#ff4757";
          isValid = false;
        }

        if (field.id === "bookingDate") {
          const selectedDate = new Date(field.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            errorMessage.textContent = "Please select a future date";
            errorMessage.style.display = "block";
            field.style.borderColor = "#ff4757";
            isValid = false;
          }
        }
      }
    });

    if (!isValid) {
      submitText.style.display = "inline-block";
      spinner.style.display = "none";
      return;
    }

    // Simulate form submission (in a real app, you would use AJAX here)
    setTimeout(() => {
      submitText.style.display = "inline-block";
      spinner.style.display = "none";

      // Show confirmation modal with booking details
      showConfirmationModal(this);
    }, 1500);
  });

  // Email validation helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Phone validation helper (simple version)
  function validatePhone(phone) {
    const re = /^[\d\s\-\(\)]{7,}$/;
    return re.test(phone);
  }

  // Show confirmation modal
  function showConfirmationModal(form) {
    const modal = document.querySelector(".modal-overlay");
    const bookingSummary = document.querySelector(".booking-summary");

    // Get form values
    const name = form.querySelector("#bookingName").value;
    const email = form.querySelector("#bookingEmail").value;
    const phone = form.querySelector("#bookingPhone").value;
    const date = new Date(
      form.querySelector("#bookingDate").value
    ).toLocaleDateString();
    const guests = form.querySelector("#bookingGuests").value;
    const package =
      form.querySelector("#bookingPackage").options[
        form.querySelector("#bookingPackage").selectedIndex
      ].text;
    const theme = form.querySelector("#bookingTheme").value || "Not specified";
    const requests = form.querySelector("#bookingRequests").value || "None";

    // Populate booking summary
    bookingSummary.innerHTML = `
            <p><span>Name:</span> <span>${name}</span></p>
            <p><span>Email:</span> <span>${email}</span></p>
            <p><span>Phone:</span> <span>${phone}</span></p>
            <p><span>Date:</span> <span>${date}</span></p>
            <p><span>Guests:</span> <span>${guests}</span></p>
            <p><span>Package:</span> <span>${package}</span></p>
            <p><span>Theme:</span> <span>${theme}</span></p>
            <p><span>Special Requests:</span> <span>${requests}</span></p>
        `;

    // Show modal
    modal.classList.add("active");

    // Reset form
    form.reset();
  }

  // Close modal
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".modal-overlay").classList.remove("active");
    });
  });

  // Animate elements when they come into view
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".animate__animated");

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementPosition < windowHeight - 100) {
        const animationClass = element.getAttribute("data-animation");
        element.classList.add(animationClass || "animate__fadeInUp");

        // Remove the animate__animated class after animation completes
        setTimeout(() => {
          element.classList.remove("animate__animated");
        }, 1000);
      }
    });
  };

  // Check on initial load
  animateOnScroll();

  // Check on scroll
  window.addEventListener("scroll", animateOnScroll);

  // Add confetti effect on package selection
  packageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      createConfetti(this);
    });
  });

  // Confetti effect
  function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${x}px`;
      confetti.style.top = `${y}px`;
      confetti.style.backgroundColor = getRandomColor();
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 3;
      const rotation = Math.random() * 360;

      let posX = x;
      let posY = y;
      let opacity = 1;

      const animateConfetti = () => {
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity + 0.5; // Add gravity
        opacity -= 0.02;

        confetti.style.left = `${posX}px`;
        confetti.style.top = `${posY}px`;
        confetti.style.opacity = opacity;
        confetti.style.transform = `rotate(${rotation}deg)`;

        if (opacity > 0) {
          requestAnimationFrame(animateConfetti);
        } else {
          confetti.remove();
        }
      };

      requestAnimationFrame(animateConfetti);
    }
  }

  function getRandomColor() {
    const colors = [
      "#ff6b6b",
      "#6b8cff",
      "#6bff8c",
      "#ffd16b",
      "#ff8e8e",
      "#8e8eff",
      "#8eff8e",
      "#ffe38e",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Add confetti to CSS
  const style = document.createElement("style");
  style.textContent = `
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        }
    `;
  document.head.appendChild(style);

  // Initialize first testimonial
  showTestimonial(0);
});
// In your script.js
async function submitBooking(formData) {
  const bookingData = {
    celebrant_name: formData.get("celebrantName"),
    celebrant_age: formData.get("celebrantAge"),
    event_date: formData.get("date"),
    event_time: formData.get("eventTime"),
    guests: formData.get("guests"),
    package: formData.get("package"),
    theme: formData.get("theme"),
    special_requests: formData.get("requests"),
    customer: {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    },
  };

  try {
    const response = await fetch("/api/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(), // Important for Django CSRF protection
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) throw new Error("Booking failed");

    const data = await response.json();
    showConfirmationModal(data);
  } catch (error) {
    console.error("Error:", error);
    alert("Booking submission failed. Please try again.");
  }
}

function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
  return cookieValue;
}
