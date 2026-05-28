const API_KEY = "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";
const MODEL  = "claude-sonnet-4-20250514";

let conversationHistory = [];

function addMessage(role, text) {
  const messagesEl = document.getElementById("messages");
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function sendMessage() {
  const inputEl   = document.getElementById("userInput");
  const sendBtn   = document.getElementById("sendBtn");
  const userText  = inputEl.value.trim();
  if (!userText) return;

  addMessage("user", userText);
  inputEl.value = "";

  conversationHistory.push({ role: "user", content: userText });

  const messagesEl = document.getElementById("messages");
  const typingDiv  = document.createElement("div");
  typingDiv.classList.add("message", "bot", "typing");
  typingDiv.textContent = "Thinking...";
  messagesEl.appendChild(typingDiv);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  sendBtn.disabled = true;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: "You are a helpful and friendly AI assistant.",
        messages: conversationHistory
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const botText = data.content[0].text;
    typingDiv.classList.remove("typing");
    typingDiv.textContent = botText;

    conversationHistory.push({ role: "assistant", content: botText });

  } catch (err) {
    typingDiv.classList.remove("typing");
    typingDiv.textContent = "Error: " + err.message;
    typingDiv.style.color = "red";
  }

  sendBtn.disabled = false;
  document.getElementById("userInput").focus();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("userInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});