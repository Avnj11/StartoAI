// DOM Elements
const profileImage = document.getElementById("profileImage");
const uploadBtn = document.querySelector(".upload-btn");
const skillInput = document.getElementById("skillInput");
const addSkillBtn = document.querySelector(".add-skill-btn");
const skillsTags = document.getElementById("skillsTags");
const summaryTextarea = document.querySelector(".summary-container textarea");
const aiSuggestBtn = document.querySelector(".ai-suggest-btn");
const saveProfileBtn = document.querySelector(".save-profile-btn");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// Gemini API Key - Replace with your actual key
const API_KEY = "AIzaSyB4nTmDUart66JWQ1Rgv_T5_S8g41RSH-g";

// Context for the AI to maintain profile focus
const SYSTEM_CONTEXT = `You are a Profile Assistant for entrepreneurs. Your role is to help them create 
compelling profiles by suggesting improvements to their summaries, recommending relevant skills, and helping 
them articulate their goals. Only provide advice related to profile creation and entrepreneurial presentation. 
If asked about other topics, politely redirect to profile-related discussions.`;

// Profile Image Upload
uploadBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImage.src = e.target.result;
        // TODO: Implement image upload to server
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
});

// Skills Management
addSkillBtn.addEventListener("click", () => {
  const skillValue = skillInput.value.trim();
  if (skillValue) {
    addSkillTag(skillValue);
    skillInput.value = "";
  }
});

function addSkillTag(skill) {
  const tag = document.createElement("span");
  tag.className = "skill-tag";
  tag.innerHTML = `
        ${skill}
        <button onclick="this.parentElement.remove()">×</button>
    `;
  skillsTags.appendChild(tag);
}

// AI Integration for Summary Suggestions
aiSuggestBtn.addEventListener("click", async () => {
  const currentSummary = summaryTextarea.value.trim();
  const prompt = `Please help improve this entrepreneur's summary or suggest a new one if empty: "${currentSummary}"
    Consider including: background, achievements, vision, and unique value proposition.`;

  try {
    const suggestion = await getGeminiResponse(prompt);
    summaryTextarea.value = suggestion;
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
  }
});

// Chat Functionality with AI
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

  // Get and display AI response
  try {
    const response = await getGeminiResponse(message);
    chatMessages.removeChild(loadingDiv);
    addMessage(response);
  } catch (error) {
    chatMessages.removeChild(loadingDiv);
    addMessage("Sorry, I encountered an error. Please try again.");
  }
});

// Helper function to add messages to chat
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

// Gemini API Integration
async function getGeminiResponse(prompt) {
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

// Auto-save functionality
let autoSaveTimeout;
const autoSave = () => {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveProfile();
  }, 2000);
};

// Add auto-save to all input fields
document.querySelectorAll("input, textarea").forEach((element) => {
  element.addEventListener("input", autoSave);
});

// Save Profile
async function saveProfile() {
  const profile = {
    name: document.querySelector(".profile-name").value,
    title: document.querySelector(".profile-title").value,
    industryFocus: document.querySelector('[placeholder="e.g., SaaS, FinTech, E-commerce"]').value,
    experience: document.querySelector('[placeholder="Years"]').value,
    ventureStage: document.querySelector("select").value,
    previousVentures: document.querySelector('[placeholder="Number of ventures"]').value,
    skills: Array.from(skillsTags.children).map((tag) => tag.textContent.trim().replace("×", "")),
    summary: summaryTextarea.value,
    shortTermGoals: document.querySelector('[placeholder="What do you want to achieve in the next 6-12 months?"]')
      .value,
    longTermVision: document.querySelector('[placeholder="Where do you see yourself and your venture in 5 years?"]')
      .value,
  };

  try {
    // TODO: Implement actual API call to save profile
    console.log("Saving profile:", profile);
    // Show success message
    const savedIndicator = document.createElement("div");
    savedIndicator.className = "save-indicator";
    savedIndicator.textContent = "Changes saved";
    document.body.appendChild(savedIndicator);
    setTimeout(() => savedIndicator.remove(), 2000);
  } catch (error) {
    console.error("Error saving profile:", error);
  }
}

// Save button click handler
saveProfileBtn.addEventListener("click", saveProfile);

// Initialize time display
const updateTime = () => {
  const timeElement = document.getElementById("current-time");
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  timeElement.textContent = timeString;
};

setInterval(updateTime, 1000);
updateTime();
