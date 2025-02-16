// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const metricCards = document.querySelectorAll(".metric-card");
const exploreButtons = document.querySelectorAll(".explore-btn");
const actionButtons = document.querySelectorAll(".action-btn");

// Gemini API Key - Replace with your actual key
const API_KEY = "AIzaSyB4nTmDUart66JWQ1Rgv_T5_S8g41RSH-g";

// Context for the AI to maintain wellbeing focus
const SYSTEM_CONTEXT = `You are a Wellbeing Assistant for startup founders. Your role is to provide 
advice on maintaining work-life balance, managing stress, improving productivity, and maintaining 
mental health. Focus on practical, actionable advice that can be implemented by busy entrepreneurs. 
If asked about other topics, politely redirect to wellbeing-related discussions.`;

// Metrics Data (Example data - would be replaced with real data from backend)
let metricsData = {
  sleep: {
    value: 7.5,
    trend: "improving",
    goal: 8,
  },
  stress: {
    value: 60,
    trend: "stable",
    goal: 50,
  },
  energy: {
    value: 80,
    trend: "improving",
    goal: 85,
  },
  focus: {
    value: 4.5,
    trend: "declining",
    goal: 6,
  },
};

// Update Metrics Display
function updateMetrics() {
  metricCards.forEach((card) => {
    const progressBar = card.querySelector(".progress-bar");
    const metricValue = card.querySelector(".metric-value");

    // Animate progress bars
    if (progressBar) {
      const currentWidth = progressBar.style.width;
      progressBar.style.transition = "width 1s ease-in-out";
      progressBar.style.width = currentWidth;
    }
  });
}

// Chat Functionality
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, true);
  userInput.value = "";

  // Show typing indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message bot";
  loadingDiv.innerHTML = '<div class="message-content"><p>Typing...</p></div>';
  chatMessages.appendChild(loadingDiv);

  try {
    const response = await getAIResponse(message);
    chatMessages.removeChild(loadingDiv);
    addMessage(response);
  } catch (error) {
    chatMessages.removeChild(loadingDiv);
    addMessage("Sorry, I encountered an error. Please try again.");
  }
});

// Add message to chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "bot"}`;
  messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get AI Response
async function getAIResponse(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_CONTEXT}\n\nUser: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to get AI response");
  }
}

// Handle Explore Buttons
exploreButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const area = this.parentElement.querySelector("h3").textContent;
    const resources = getResourcesForArea(area);
    showResourcesModal(area, resources);
  });
});

// Get Resources for Growth Area
function getResourcesForArea(area) {
  // This would typically fetch from a backend API
  const resourcesMap = {
    "Mental Resilience": [
      { title: "Meditation Basics", type: "video", duration: "15 min" },
      { title: "Stress Management Guide", type: "article", duration: "10 min" },
      { title: "Resilience Workshop", type: "course", duration: "2 hours" },
    ],
    "Time Management": [
      { title: "Productivity Techniques", type: "guide", duration: "20 min" },
      { title: "Calendar Optimization", type: "tool", duration: "5 min" },
      { title: "Focus Timer", type: "app", duration: "N/A" },
    ],
    // Add more areas as needed
  };

  return resourcesMap[area] || [];
}

// Show Resources Modal
function showResourcesModal(area, resources) {
  const modal = document.createElement("div");
  modal.className = "resources-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h3>${area} Resources</h3>
            <div class="resources-list">
                ${resources
                  .map(
                    (resource) => `
                    <div class="resource-item">
                        <h4>${resource.title}</h4>
                        <p>${resource.type} • ${resource.duration}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;

  document.body.appendChild(modal);

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });
}

// Handle Action Buttons
actionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const action = this.textContent.trim();
    const insight = this.closest(".insight-card").querySelector(".insight-text").textContent;

    if (action === "Save") {
      saveInsight(insight);
    } else if (action === "Share") {
      shareInsight(insight);
    }
  });
});

// Save Insight
function saveInsight(insight) {
  // This would typically save to a backend
  const savedInsights = JSON.parse(localStorage.getItem("savedInsights") || "[]");
  savedInsights.push({
    text: insight,
    date: new Date().toISOString(),
  });
  localStorage.setItem("savedInsights", JSON.stringify(savedInsights));

  // Show success message
  showNotification("Insight saved successfully!");
}

// Share Insight
function shareInsight(insight) {
  // This would typically integrate with sharing APIs
  if (navigator.share) {
    navigator
      .share({
        title: "Founder Growth Insight",
        text: insight,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    // Fallback
    showNotification("Sharing not supported on this device");
  }
}

// Show Notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateMetrics();
});

// Update metrics periodically (every 5 minutes)
setInterval(updateMetrics, 300000);
