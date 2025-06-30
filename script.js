
  const input = document.querySelector(".search input");
  const sendBtn = document.getElementById("send-btn");
  const chatBox = document.querySelector(".chat-box");

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage(userText, "user");
    input.value = "";

    // Show typing indicator
    appendMessage("...", "bot");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Free model
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userText }
          ]
        })
      });

      const data = await response.json();

      // Remove typing placeholder
      removeLastBotMessage();

      // Add real reply
      appendMessage(data.choices[0].message.content, "bot");
    } catch (error) {
      removeLastBotMessage();
      appendMessage("Error: Unable to get response", "bot");
    }
  }

  function appendMessage(content, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = content;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeLastBotMessage() {
    const lastMsg = chatBox.querySelector(".message.bot:last-child");
    if (lastMsg) chatBox.removeChild(lastMsg);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

