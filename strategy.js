

"use strict";

// Keep this URL in sync with the API_BASE_URL in script.js.
const API_BASE_URL = "https://socialsync-ai-api.onrender.com/";

const form = document.querySelector("#campaignForm");
const status = document.querySelector("#studioStatus");
const result = document.querySelector("#campaignResult");
const button = document.querySelector("#generateButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    businessName: document.querySelector("#businessName").value.trim(),
    businessType: document.querySelector("#businessType").value.trim(),
    audience: document.querySelector("#audience").value.trim(),
    goal: document.querySelector("#goal").value,
    platform: document.querySelector("#platform").value,
    campaignBrief: document.querySelector("#campaignBrief").value.trim(),
    tone: document.querySelector("#tone").value,
    offerDetails: document.querySelector("#offerDetails").value.trim(),
    visualResources: document.querySelector("#visualResources").value.trim()
  };

  if (!payload.businessType || !payload.audience || !payload.goal ||
      !payload.platform || !payload.campaignBrief) {
    status.textContent = "Please complete all required fields.";
    return;
  }

  button.disabled = true;
  button.textContent = "Generating...";
  status.textContent = "Connecting to the AI service. This may take a little while.";
  result.textContent = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/campaign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status}).`);
    }

    result.textContent = data.campaign;
    status.textContent = "Your campaign plan is ready. Review all details before publishing.";
  } catch (error) {
    status.textContent =
      `${error.message || "Could not connect to the AI service."} Check the backend URL and try again.`;
  } finally {
    button.disabled = false;
    button.textContent = "Generate campaign plan";
  }
});
