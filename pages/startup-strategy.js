// Drawer functionality
const toggleAssistant = document.getElementById("toggleAssistant");
const closeAssistant = document.getElementById("closeAssistant");
const aiSidebar = document.getElementById("aiSidebar");
const body = document.body;
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

// Create overlay if it doesn't exist
let overlay = document.querySelector(".overlay");
if (!overlay) {
  overlay = document.createElement("div");
  overlay.className = "overlay";
  body.appendChild(overlay);
}

// Context for the AI to maintain startup focus
const SYSTEM_CONTEXT = `You are a Startup Strategy Assistant. Your role is to provide specific, 
actionable advice about startup strategy, business models, market entry, and growth. 
Only answer questions related to startups and business strategy. 
If asked about other topics, politely redirect to startup-related discussions.`;

// Add message to chat
const addMessage = (content, isUser = false) => {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "bot"}`;
  messageDiv.innerHTML = `
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Get response from Gemini
const getGeminiResponse = async (prompt) => {
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
    return "Sorry, I encountered an error. Please try again.";
  }
};

// Handle chat submission
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
  const response = await getGeminiResponse(message);
  chatMessages.removeChild(loadingDiv);
  addMessage(response);
});

// Close drawer function
const closeDrawer = () => {
  aiSidebar.classList.remove("open");
  overlay.classList.remove("active");
  body.style.overflow = "auto";
};

// Open drawer function
const openDrawer = () => {
  aiSidebar.classList.add("open");
  overlay.classList.add("active");
  body.style.overflow = "hidden";
};

// Event Listeners
toggleAssistant.addEventListener("click", openDrawer);
closeAssistant.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// Close on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && aiSidebar.classList.contains("open")) {
    closeDrawer();
  }
});

// Prevent clicks inside drawer from closing it
aiSidebar.addEventListener("click", (e) => {
  e.stopPropagation();
});

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

// Rest of your existing JavaScript...
