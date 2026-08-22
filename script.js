const body = document.body;
const progressBar = document.getElementById('scroll-progress');
const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const themeButton = document.querySelector('.theme-toggle');

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    const selected = button.dataset.filter;

    projectCards.forEach((card) => {
      const shouldShow = selected === 'all' || card.dataset.tech.includes(selected);
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

themeButton.addEventListener('click', () => {
  body.classList.toggle('light-theme');
  const icon = themeButton.querySelector('i');
  const isLight = body.classList.contains('light-theme');
  icon.classList.toggle('fa-moon', !isLight);
  icon.classList.toggle('fa-sun', isLight);
});

document.querySelector('.contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const originalText = button.innerHTML;
  button.innerHTML = 'Message sent <i class="fas fa-check"></i>';
  button.disabled = true;
  setTimeout(() => {
    button.innerHTML = originalText;
    button.disabled = false;
    event.currentTarget.reset();
  }, 1800);
});
