
"use strict";

const strategyProfile = (() => {
  try {
    const session = sessionStorage.getItem("socialsyncCurrentResults");
    const saved = localStorage.getItem("socialsyncProfile");
    return JSON.parse(session || saved || "null");
  } catch {
    return null;
  }
})();

const strategy$ = (selector, root = document) => root.querySelector(selector);

const formatNames = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest",
  google: "Google Business Profile",
  whatsapp: "WhatsApp Business"
};

const platformContent = {
  instagram: {
    format: "Carousel or Reel",
    hook: "Start with a detail your audience will immediately recognise.",
    structure: [
      "Opening: an eye-catching image or a specific question.",
      "Middle: demonstrate the product, process or benefit.",
      "Supporting frame: answer one likely customer question.",
      "Closing: invite a relevant action, such as saving the post or enquiring."
    ],
    visual: "Capture a wide image, a close-up, a real-use shot and a clean final frame. Use natural light, a consistent background and legible on-image text.",
    caution: "Use genuine product or service imagery. Do not imply that staged examples are real customer experiences."
  },
  linkedin: {
    format: "Professional text post or document carousel",
    hook: "Open with a real observation, lesson or problem your audience understands.",
    structure: [
      "Opening: state the business challenge or observation.",
      "Context: explain why it matters to your audience.",
      "Insight: share your approach, lesson or practical framework.",
      "Closing: give a useful takeaway or invite a thoughtful discussion."
    ],
    visual: "Create a clean document carousel, a genuine team or founder photo, or a simple diagram that explains the insight.",
    caution: "Use real experience and verifiable claims. Do not invent company milestones, customer results or professional credentials."
  },
  facebook: {
    format: "Community update, event post or photo-led offer",
    hook: "Lead with the useful local update or the reason your audience should care.",
    structure: [
      "Opening: make the update or offer immediately clear.",
      "Details: include relevant dates, availability or service information.",
      "Context: explain who the update is for.",
      "Closing: invite a question, visit, booking or other relevant action."
    ],
    visual: "Use a real photo of the product, venue, service or team. Make any essential event information easy to read.",
    caution: "Confirm dates, location, pricing and offer conditions before publishing."
  },
  tiktok: {
    format: "Short vertical video",
    hook: "Show the result, surprising detail or customer question in the opening seconds.",
    structure: [
      "Opening shot: introduce the question or demonstrate the result.",
      "Main sequence: show the process in a few clear steps.",
      "Payoff: explain the useful takeaway.",
      "Closing: suggest one relevant next action."
    ],
    visual: "Shoot vertically, keep the subject visible, use clear lighting and add readable captions. Capture the action rather than relying on decorative transitions.",
    caution: "Use licensed audio and disclose commercial relationships when required."
  },
  youtube: {
    format: "Tutorial, explainer or YouTube Short",
    hook: "State the question the viewer will be able to answer by the end.",
    structure: [
      "Opening: explain the question and what viewers will learn.",
      "Main section: demonstrate the process or explain the key points.",
      "Example: show a real use case or worked example.",
      "Closing: summarise the lesson and suggest a related resource."
    ],
    visual: "Plan a clear thumbnail, a stable main shot and supporting close-ups or screen captures. Match the video title to the actual content.",
    caution: "Avoid misleading thumbnails or titles and verify any technical or factual claims."
  },
  pinterest: {
    format: "Searchable visual guide or idea pin",
    hook: "Give the viewer a clear idea, solution or inspiration they can save.",
    structure: [
      "Title: describe the idea clearly.",
      "Visual: show the result or concept.",
      "Details: include useful steps, components or context.",
      "Destination: link to a relevant page when available."
    ],
    visual: "Use a clean vertical composition, readable typography and a consistent visual identity. Create original imagery or use assets you have permission to publish.",
    caution: "Use accurate descriptions and working destination links. Platform formats and publishing options can change."
  },
  google: {
    format: "Business update or authentic photo post",
    hook: "Tell nearby customers what is new, available or useful.",
    structure: [
      "Update: state the service, product or announcement.",
      "Details: include accurate availability and relevant information.",
      "Context: explain who may benefit.",
      "Next step: direct people to a valid business action or page."
    ],
    visual: "Photograph your real premises, team, products or work. Keep images clear and representative of the actual business.",
    caution: "Eligibility and supported features vary. Keep business information accurate and follow Google's content policies."
  },
  whatsapp: {
    format: "Customer update, catalogue entry or service message",
    hook: "Make the purpose of the message clear from the first line.",
    structure: [
      "Opening: explain why you are contacting the customer.",
      "Information: provide the relevant offer, update or answer.",
      "Details: include only information needed for the next step.",
      "Closing: offer a clear reply, booking or catalogue action."
    ],
    visual: "Use an authentic product image or a clean catalogue graphic. Keep the text concise and ensure the offer details are accurate.",
    caution: "Respect consent, customer privacy and applicable messaging rules. Do not send unsolicited promotional messages."
  }
};

function safeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showRecommendations() {
  const results = strategy$("#recommendationResults");
  if (!results) return;

  if (!strategyProfile?.recommendations?.recommended?.length) {
    strategy$("#businessGreeting").textContent = "Your strategy starts with your business.";
    strategy$("#businessSummary").textContent =
      "Your business profile has not been completed in this browser yet. Fill it in on the Studio page to see personalised platform recommendations.";
    results.innerHTML = `
      <article class="recommendation-card">
        <span class="priority-label">GET STARTED</span>
        <h3>Tell us about your business.</h3>
        <p>We will use your business type, audience, goals and resources to build a platform shortlist.</p>
        <a class="button button-primary" href="index.html#business-setup">Complete business profile ↗</a>
      </article>`;
    return;
  }

  const profile = strategyProfile;
  const shortlist = profile.recommendations.recommended;

  strategy$("#businessGreeting").textContent =
    profile.businessName
      ? `A starting point for ${profile.businessName}.`
      : "Your business, your starting point.";

  const goalLabels = {
    awareness: "brand awareness",
    leads: "leads and enquiries",
    sales: "sales and bookings",
    community: "community",
    authority: "credibility",
    recruitment: "recruitment"
  };

  const goals = (profile.goals || []).map(goal => goalLabels[goal] || goal);

  strategy$("#businessSummary").textContent =
    `These recommendations use your selected business type, audience and available resources. Your stated priorities are ${goals.join(", ") || "still to be confirmed"}. Treat the shortlist as a starting hypothesis, not a guarantee of performance.`;

  results.innerHTML = shortlist.map((item, index) => `
    <article class="recommendation-card">
      <span class="priority-label">${index === 0 ? "First to explore" : index === 1 ? "Strong candidate" : "Worth testing"}</span>
      <h3>${safeText(item.name)}</h3>
      <p>${safeText(item.description)}</p>
      <p><strong>Why it may fit:</strong> ${safeText((item.reasons || []).slice(0, 2).join(" "))}</p>
      <p><strong>Content formats to explore</strong></p>
      <ul>${item.formats.map(format => `<li>${safeText(format)}</li>`).join("")}</ul>
      <button class="button button-secondary use-platform" type="button" data-platform="${safeText(item.key)}">Plan for ${safeText(item.name)} ↗</button>
    </article>
  `).join("");

  const later = profile.recommendations.exploreLater || [];
  const laterContainer = strategy$("#exploreLater");

  if (laterContainer && later.length) {
    laterContainer.innerHTML = `
      <h2>Possible next channels</h2>
      <p>Consider these after reviewing your priorities and the effort required to maintain another channel.</p>
      <div class="format-chips">
        ${later.map(item => `<span>${safeText(item.name)}</span>`).join("")}
      </div>`;
  }
}

function createCampaignOutline({ campaignName, objective, audience, details, platform }) {
  const content = platformContent[platform];
  const goalActions = {
    awareness: "Discover the brand or learn what it offers",
    leads: "Ask a question or make an enquiry",
    sales: "Explore the offer or make a booking or purchase",
    community: "Join the conversation or share a relevant experience",
    authority: "Learn from the insight or explore a related resource"
  };

  const action = goalActions[objective] || "Take the most relevant next step";
  const profileName = strategyProfile?.businessName || "your business";

  return {
    campaignName,
    platform: formatNames[platform],
    audience,
    details,
    format: content.format,
    hook: content.hook,
    structure: content.structure,
    visual: content.visual,
    callToAction: action,
    caution: content.caution,
    objective,
    profileName
  };
}

function renderCampaignOutline(outline) {
  const results = strategy$("#campaignResults");

  results.innerHTML = `
    <article class="result-card">
      <span class="result-label">CAMPAIGN OUTLINE · ${safeText(outline.platform)}</span>
      <h3>${safeText(outline.campaignName)}</h3>
      <p><strong>Prepared for:</strong> ${safeText(outline.profileName)}</p>
      <p><strong>Audience:</strong> ${safeText(outline.audience)}</p>
      <p><strong>Campaign brief:</strong> ${safeText(outline.details)}</p>
      <p><strong>Suggested format:</strong> ${safeText(outline.format)}</p>
      <p><strong>Opening direction:</strong> ${safeText(outline.hook)}</p>
      <h3>Suggested content structure</h3>
      <ol>${outline.structure.map(item => `<li>${safeText(item)}</li>`).join("")}</ol>
      <h3>Creative direction</h3>
      <p>${safeText(outline.visual)}</p>
      <p><strong>Suggested next action:</strong> ${safeText(outline.callToAction)}</p>
      <p class="privacy-note"><strong>Before publishing:</strong> ${safeText(outline.caution)} This is a planning outline, not a published post or a verified performance prediction.</p>
      <button type="button" class="button button-primary" id="copyOutlineButton">Copy campaign outline ↗</button>
      <p id="copyOutlineStatus" role="status" aria-live="polite"></p>
    </article>`;

  strategy$("#copyOutlineButton").addEventListener("click", async () => {
    const plainText = [
      `Campaign: ${outline.campaignName}`,
      `Platform: ${outline.platform}`,
      `Audience: ${outline.audience}`,
      `Brief: ${outline.details}`,
      `Format: ${outline.format}`,
      `Opening direction: ${outline.hook}`,
      "",
      "Content structure:",
      ...outline.structure.map((item, i) => `${i + 1}. ${item}`),
      "",
      `Creative direction: ${outline.visual}`,
      `Suggested next action: ${outline.callToAction}`,
      `Before publishing: ${outline.caution}`
    ].join("\n");

    const status = strategy$("#copyOutlineStatus");

    try {
      await navigator.clipboard.writeText(plainText);
      status.textContent = "Outline copied. You can paste it into your working document.";
    } catch {
      const area = document.createElement("textarea");
      area.value = plainText;
      area.setAttribute("aria-label", "Campaign outline text");
      document.body.append(area);
      area.select();
      const copied = document.execCommand("copy");
      area.remove();
      status.textContent = copied
        ? "Outline copied."
        : "Automatic copying is unavailable here. Select and copy the outline text manually.";
    }
  });
}

strategy$("#campaignForm")?.addEventListener("submit", event => {
  event.preventDefault();

  const error = strategy$("#campaignError");
  error.textContent = "";

  const data = new FormData(event.currentTarget);
  const campaignName = String(data.get("campaignName") || "").trim();
  const objective = String(data.get("campaignObjective") || "");
  const audience = String(data.get("campaignAudience") || "").trim();
  const details = String(data.get("campaignDetails") || "").trim();
  let platform = String(data.get("campaignPlatforms") || "");

  if (!campaignName || !objective || !audience || !details || !platform) {
    error.textContent = "Please complete the required campaign fields.";
    return;
  }

  if (platform === "recommended") {
    platform =
      strategyProfile?.recommendations?.recommended?.[0]?.key || "instagram";
  }

  const outline = createCampaignOutline({
    campaignName,
    objective,
    audience,
    details,
    platform
  });

  renderCampaignOutline(outline);
  strategy$("#campaignResults").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

strategy$("#recommendationResults")?.addEventListener("click", event => {
  const button = event.target.closest(".use-platform");
  if (!button) return;

  const select = strategy$("#campaignPlatforms");
  if (select) select.value = button.dataset.platform;

  strategy$("#campaignForm")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

showRecommendations();
