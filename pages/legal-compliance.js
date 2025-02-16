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

// Chat functionality
const API_KEY = "AIzaSyB4nTmDUart66JWQ1Rgv_T5_S8g41RSH-g";
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Function to add message to chat
const addMessage = (message, isUser = false) => {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${isUser ? "user" : "bot"}`;

  const content = `
        ${!isUser ? '<img src="../images/gemini.svg" alt="AI Assistant" class="bot-avatar">' : ""}
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

  messageDiv.innerHTML = content;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
};

// Function to get response from Gemini
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
                  text: prompt + "\n\nPlease provide legal and compliance advice for startups.",
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

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Add user message
  addMessage(message, true);
  userInput.value = "";

  // Show typing indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "chat-message bot";
  loadingDiv.innerHTML = '<div class="message-content"><p>Typing...</p></div>';
  chatBox.appendChild(loadingDiv);

  // Get and display AI response
  const response = await getGeminiResponse(message);
  chatBox.removeChild(loadingDiv);
  addMessage(response);
});
