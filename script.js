const body = document.body;
const progressBar = document.getElementById("scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const themeButton = document.querySelector(".theme-toggle");
const contactForm = document.querySelector(".contact-form");
const submitButton = document.getElementById("submit-btn");
const statusMessage = document.querySelector("#form-status");
const resumeLinks = document.querySelectorAll("[data-resume-link]");
const API_BASE_URL =
  window.location.hostname === "localhost" && window.location.port === "8000"
    ? "http://localhost:3000"
    : "";

resumeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.open(link.dataset.resumeLink, "_blank", "noopener,noreferrer");
  });
});

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => observer.observe(item));
window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("load", updateScrollProgress);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) =>
      btn.classList.toggle("active", btn === button),
    );
    const selected = button.dataset.filter;

    projectCards.forEach((card) => {
      const shouldShow =
        selected === "all" || card.dataset.tech.includes(selected);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

themeButton.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const icon = themeButton.querySelector("i");
  const isLight = body.classList.contains("light-theme");
  icon.classList.toggle("fa-moon", !isLight);
  icon.classList.toggle("fa-sun", isLight);
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const originalText = submitButton.innerHTML;
  const name = form.querySelector('input[name="name"]').value.trim();
  const email = form.querySelector('input[name="email"]').value.trim();
  const subject = form.querySelector('input[name="subject"]').value.trim();
  const message = form.querySelector('textarea[name="message"]').value.trim();

  if (!name || !email || !message) {
    showStatus("Please fill in your name, email, and message.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = "Sending...";
  showStatus("Sending your message...", "info");

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (!response.ok) {
      let errorMessage = "Failed to send message.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Invalid JSON error response from the API.", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data || data.success !== true) {
      throw new Error(data?.message || "Failed to send message.");
    }

    form.reset();
    showStatus("Message sent successfully.", "success");
  } catch (error) {
    showStatus(
      error.message || "Something went wrong. Please try again later.",
      "error",
    );
    submitButton.innerHTML = "Try again";
  } finally {
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 1800);
  }
});

function showStatus(message, type) {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.className = `form-status ${type}`;
  statusMessage.hidden = false;
}
