// Create floating bubbles
function createBubbles() {
  const bubblesContainer = document.querySelector(".floating-bubbles");
  const bubbleCount = 50;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.cssText = `
            position: absolute;
            background: radial-gradient(circle at center, rgba(0, 255, 242, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
            opacity: ${Math.random() * 0.5};
        `;
    bubblesContainer.appendChild(bubble);
  }
}

// Track page states
let currentPage = "landing";
let previousPage = "landing";

// Function to show dashboard
const showDashboard = () => {
  window.location.href = "dashboard.html";
};

// Function to show calendar
const showCalendar = () => {
  previousPage = currentPage;
  currentPage = "calendar";
  document.getElementById("landing-page").style.display = "none";
  document.getElementById("dashboard-page").style.display = "none";
  document.getElementById("calendar-page").style.display = "block";
};

// Function to handle back button
const handleBack = () => {
  // Store current page before changing
  const tempPage = currentPage;
  currentPage = previousPage;
  previousPage = tempPage;

  // Handle page display based on previous page
  if (previousPage === "calendar") {
    if (currentPage === "dashboard") {
      document.getElementById("dashboard-page").style.display = "block";
      document.getElementById("landing-page").style.display = "none";
      document.getElementById("calendar-page").style.display = "none";
    } else {
      document.getElementById("landing-page").style.display = "block";
      document.getElementById("dashboard-page").style.display = "none";
      document.getElementById("calendar-page").style.display = "none";
    }
  }
};

// Update current time
const updateTime = () => {
  const timeElement = document.getElementById("current-time");
  if (timeElement) {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    timeElement.textContent = timeString;
  }
};

// Initialize time update
setInterval(updateTime, 1000);
updateTime();

// Calendar page time update (with seconds)
function updateCalendarTime() {
  const timeElement = document.getElementById("current-time");
  if (window.location.pathname.includes("tasks.html")) {
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }
}

// Add console logs for debugging
console.log("JavaScript loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  console.log("Initial currentPage:", currentPage);
  console.log("Initial previousPage:", previousPage);
  createBubbles();

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Initialize time updates
  updateTime();
  setInterval(() => {
    updateTime();
    updateCalendarTime();
  }, 1000);
});

// Add floating animation keyframes
const style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-100px) translateX(20px);
        }
        100% {
            transform: translateY(-200px) translateX(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Calendar and Task Management
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  const calendar = document.querySelector(".calendar-grid");
  const currentMonthElement = document.getElementById("currentMonth");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const viewToggles = document.querySelectorAll(".view-toggle");
  const themeToggle = document.getElementById("themeToggle");
  const focusModeBtn = document.querySelector(".focus-mode-btn");

  let currentDate = new Date();
  let events = [
    {
      id: 1,
      title: "Team Sync",
      description: "Weekly Sprint Planning",
      date: new Date(2024, 2, 15, 9, 0),
      type: "meeting",
      priority: "high",
    },
    {
      id: 2,
      title: "Project Review",
      description: "Prepare presentation deck",
      date: new Date(2024, 2, 15, 14, 30),
      type: "task",
      priority: "medium",
    },
    {
      id: 3,
      title: "Investor Pitch",
      description: "Final deck submission",
      date: new Date(2024, 2, 15, 16, 0),
      type: "deadline",
      priority: "urgent",
    },
  ];

  // Update calendar
  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthElement.textContent = new Date(year, month).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    let calendarHTML = "";

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasEvents = events.some((event) => event.date.toDateString() === date.toDateString());

      calendarHTML += `
                <div class="calendar-day ${isToday ? "today" : ""} ${hasEvents ? "has-event" : ""}" 
                     data-date="${date.toISOString()}">
                    ${day}
                    ${hasEvents ? '<div class="event-indicator"></div>' : ""}
                </div>
            `;
    }

    calendar.innerHTML = document.querySelectorAll(".weekday").length
      ? Array.from(document.querySelectorAll(".weekday"))
          .map((el) => el.outerHTML)
          .join("") + calendarHTML
      : calendarHTML;
  }

  // Event handlers
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  // View toggle handlers
  viewToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      viewToggles.forEach((t) => t.classList.remove("active"));
      toggle.classList.add("active");
      // Implement view change logic here
    });
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.documentElement.setAttribute(
      "data-theme",
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"
    );
    themeToggle.textContent = document.documentElement.getAttribute("data-theme") === "dark" ? "🌙" : "☀️";
  });

  // Focus mode
  focusModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    focusModeBtn.textContent = document.body.classList.contains("focus-mode") ? "🎯 Exit Focus" : "🎯 Focus Mode";
  });

  // Drag and drop functionality
  const draggableEvents = document.querySelectorAll(".event");
  draggableEvents.forEach((event) => {
    event.addEventListener("dragstart", (e) => {
      e.target.classList.add("dragging");
    });

    event.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging");
    });
  });

  // Initialize
  updateCalendar();
  updateTime();
  setInterval(updateTime, 1000);

  // Quick Add functionality
  const quickAddBtn = document.querySelector(".add-btn");
  quickAddBtn.addEventListener("click", () => {
    // Implement quick add modal logic here
    console.log("Quick add clicked");
  });

  // Filter events
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const type = btn.dataset.type;

      const eventElements = document.querySelectorAll(".event");
      eventElements.forEach((event) => {
        if (type === "all" || event.classList.contains(type)) {
          event.style.display = "grid";
        } else {
          event.style.display = "none";
        }
      });
    });
  });

  // Add navigation function to dashboard items
  const navigateToPage = (page) => {
    window.location.href = `pages/${page}.html`;
  };

  // Add this to your existing dashboard code
  document.querySelectorAll(".dashboard-item").forEach((item) => {
    item.addEventListener("click", () => {
      const pageName = item.querySelector("h2").textContent.toLowerCase().replace(/\s+/g, "-");
      navigateToPage(pageName);
    });
  });
});
