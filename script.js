
"use strict";
const API_BASE_URL = "https://socialsync-ai-api.onrender.com/";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const form = $("#businessForm");
const steps = $$(".form-step");
const nextButton = $("#nextButton");
const backButton = $("#backButton");
const submitButton = $("#submitButton");
const formError = $("#formError");

let currentStep = 1;
const totalSteps = steps.length;

const stepTitles = {
  1: "What do you do?",
  2: "What are your goals?",
  3: "Let's make it practical."
};

function updateFormStep() {
  steps.forEach((step) => {
    const active = Number(step.dataset.step) === currentStep;
    step.classList.toggle("active", active);
    step.setAttribute("aria-hidden", String(!active));
  });

  $("#formTitle").textContent = stepTitles[currentStep];
  $("#stepCounter").textContent = `0${currentStep} / 0${totalSteps}`;
  $("#progressText").textContent = `STEP 0${currentStep} OF 0${totalSteps}`;
  $("#progressPercent").textContent =
    `${Math.round(((currentStep - 1) / totalSteps) * 100)}%`;
  $("#setupProgress").style.width =
    `${((currentStep - 1) / totalSteps) * 100}%`;

  backButton.hidden = currentStep === 1;
  nextButton.hidden = currentStep === totalSteps;
  submitButton.hidden = currentStep !== totalSteps;
  formError.textContent = "";

  const heading = $("#formTitle");
  heading.setAttribute("tabindex", "-1");
}

function validateCurrentStep() {
  const activeStep = $(`.form-step[data-step="${currentStep}"]`);
  const requiredFields = $$("[required]", activeStep);

  for (const field of requiredFields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  if (currentStep === 2) {
    const selectedGoals = $$('input[name="goals"]:checked', activeStep);

    if (selectedGoals.length === 0) {
      formError.textContent =
        "Choose at least one goal so we can tailor your recommendations.";
      return false;
    }
  }

  return true;
}

nextButton?.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < totalSteps) {
    currentStep += 1;
    updateFormStep();
  }
});

backButton?.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep -= 1;
    updateFormStep();
  }
});

const platformRules = {
  instagram: {
    name: "Instagram",
    description:
      "A visual storytelling channel for products, experiences and brand personality.",
    formats: [
      "Carousel posts with a clear visual story",
      "Reels and short behind-the-scenes videos",
      "Stories, polls and product photography"
    ]
  },
  linkedin: {
    name: "LinkedIn",
    description:
      "A professional channel for expertise, business credibility and B2B relationships.",
    formats: [
      "Founder perspectives and industry insights",
      "Customer case studies and project breakdowns",
      "Document carousels, company news and lessons learned"
    ]
  },
  facebook: {
    name: "Facebook",
    description:
      "A useful option for local discovery, community conversations and event communication.",
    formats: [
      "Community updates and event announcements",
      "Customer stories, offers and business updates",
      "Useful local information and discussion prompts"
    ]
  },
  tiktok: {
    name: "TikTok",
    description:
      "A short-video discovery channel for businesses able to produce native, engaging video.",
    formats: [
      "Short videos with an immediate hook",
      "Demonstrations, tutorials and behind-the-scenes clips",
      "Series built around questions customers often ask"
    ]
  },
  youtube: {
    name: "YouTube",
    description:
      "A video library for searchable tutorials, demonstrations and educational content.",
    formats: [
      "Tutorials and product demonstrations",
      "Shorts adapted to vertical video",
      "Explainers, comparisons and customer FAQs"
    ]
  },
  pinterest: {
    name: "Pinterest",
    description:
      "A visual discovery platform suited to ideas people save for future plans and purchases.",
    formats: [
      "Searchable visual guides and idea collections",
      "Product styling, recipes and inspiration boards",
      "Helpful graphics linked to relevant website pages"
    ]
  },
  google: {
    name: "Google Business Profile",
    description:
      "A local discovery tool for eligible businesses that serve customers at a location or in a service area.",
    formats: [
      "Accurate business hours and service information",
      "Authentic photos of products, services and premises",
      "Timely updates and relevant offers"
    ]
  },
  whatsapp: {
    name: "WhatsApp Business",
    description:
      "A customer communication channel for enquiries, service updates and opted-in customer relationships.",
    formats: [
      "Product and service catalogue information",
      "Useful customer updates and order communication",
      "Clear responses to common enquiries"
    ]
  }
};

function recommendPlatforms(profile) {
  const scores = {};
  const reasons = {};

  function add(platform, points, reason) {
    scores[platform] = (scores[platform] || 0) + points;
    if (!reasons[platform]) reasons[platform] = [];
    if (!reasons[platform].includes(reason)) {
      reasons[platform].push(reason);
    }
  }

  const type = profile.businessType;
  const audience = profile.audience;
  const goals = profile.goals;
  const resources = profile.resources;
  const location = profile.location;

  // Visual storytelling is especially useful for visually led products.
  if (["food", "fashion", "ecommerce", "creator"].includes(type)) {
    add("instagram", 4, "Your offer benefits from visual storytelling.");
    add("pinterest", 2, "Visual discovery may help people save your ideas.");
  } else if (type === "education") {
    add("instagram", 2, "Short educational visuals can introduce your expertise.");
    add("youtube", 4, "Tutorials can explain topics in greater depth.");
  } else if (type === "professional" || type === "b2b") {
    add("linkedin", 5, "Professional content can help demonstrate expertise.");
  } else if (type === "nonprofit") {
    add("instagram", 2, "Visual stories can help communicate your mission.");
    add("facebook", 3, "Community updates can support participation.");
  } else if (type === "local") {
    add("instagram", 2, "Visual posts can show your work and services.");
    add("facebook", 2, "Community-oriented content may suit your local audience.");
  } else {
    add("instagram", 2, "Visual storytelling can introduce your brand.");
    add("linkedin", 1, "Professional updates can establish credibility.");
  }

  if (audience === "businesses") {
    add("linkedin", 4, "Your audience includes business decision-makers.");
    add("youtube", 1, "Detailed demonstrations can help explain complex offers.");
  }

  if (audience === "students" || audience === "consumers") {
    add("instagram", 2, "Visual and short-form content may fit your audience.");
    add("youtube", 1, "Video can provide additional discovery and education.");
  }

  if (audience === "local" || location === "local") {
    add("google", 4, "Local discovery and accurate business information matter.");
    add("facebook", 2, "Local updates can support community awareness.");
  }

  if (audience === "creators") {
    add("instagram", 2, "Visual portfolio content can showcase your work.");
    add("linkedin", 2, "Professional insights can build peer relationships.");
  }

  if (location === "national" || location === "global") {
    add("youtube", 1, "Searchable content can serve audiences beyond one location.");
  }

  if (goals.includes("awareness")) {
    add("instagram", 2, "Your goal includes introducing the brand to new people.");
    add("youtube", 1, "Video offers another format for discovery.");
  }

  if (goals.includes("leads") || goals.includes("authority")) {
    add("linkedin", 3, "Expertise-led content can support trust and enquiries.");
    add("youtube", 1, "Educational content can answer customer questions.");
  }

  if (goals.includes("sales")) {
    add("instagram", 2, "Product demonstrations and visual stories can support consideration.");
    if (type === "ecommerce" || type === "fashion" || type === "food") {
      add("pinterest", 2, "Visual product discovery may fit your offer.");
    }
  }

  if (goals.includes("community")) {
    add("facebook", 2, "Community conversations and events suit this objective.");
    add("instagram", 1, "Stories and interactive formats can invite participation.");
  }

  if (goals.includes("recruitment")) {
    add("linkedin", 4, "Professional updates can communicate roles and company culture.");
  }

  if (resources === "phone") {
    add("instagram", 1, "You can begin with phone photography and simple carousels.");
    add("facebook", 1, "Photo updates do not require a complex production setup.");
  }

  if (resources === "video") {
    add("tiktok", 3, "You have the resources to experiment with short-form video.");
    add("youtube", 2, "Video resources can support Shorts and tutorials.");
  }

  if (resources === "team") {
    add("instagram", 1, "A team can help maintain a consistent visual style.");
    add("youtube", 1, "More production support can make longer videos practical.");
  }

  if (resources === "text") {
    add("linkedin", 3, "Insights and written expertise are natural content formats here.");
  }

  if (type === "food" || type === "fashion" || type === "ecommerce") {
    add("whatsapp", 1, "Customer enquiries and product information may be useful.");
  }

  if (type === "local" || type === "professional") {
    add("whatsapp", 1, "Direct customer enquiries may be part of your workflow.");
  }

  if (profile.currentPlatforms === "instagram") {
    add("instagram", 2, "You can build on a channel you already use.");
  }

  if (profile.currentPlatforms === "linkedin") {
    add("linkedin", 2, "You can build on your existing professional presence.");
  }

  if (profile.currentPlatforms === "multiple") {
    add("instagram", 1, "Review your existing channels before adding more.");
    add("linkedin", 1, "Review your existing channels before adding more.");
  }

  const ranked = Object.keys(scores)
    .map((key) => ({
      key,
      ...platformRules[key],
      score: scores[key],
      reasons: reasons[key] || []
    }))
    .sort((a, b) => b.score - a.score);

  // Return a manageable shortlist, rather than recommending everything.
  const chosen = ranked.slice(0, 4);

  return {
    recommended: chosen,
    exploreLater: ranked.slice(4, 7),
    allScores: scores
  };
}

function makeCampaignIdeas(profile) {
  const type = profile.businessType;
  const resources = profile.resources;
  const visualBusinesses = ["food", "fashion", "ecommerce", "creator", "local"];
  const visual = visualBusinesses.includes(type);

  const visualIdea = visual
    ? {
        title: "The visual story",
        format: "Carousel or short video",
        concept: "Show the product or service in context, explain one useful benefit, and finish with a clear next step.",
        shotList: [
          "A clean opening image that immediately shows the subject.",
          "A close-up of a useful detail or key feature.",
          "A real-life use, process or behind-the-scenes moment.",
          "A final frame with one clear action for the viewer."
        ]
      }
    : {
        title: "The expertise story",
        format: "Text post or document carousel",
        concept: "Explain one question your audience frequently asks, share a practical insight, and finish with a thoughtful question or next step.",
        shotList: [
          "Open with a specific question or misconception.",
          "Explain the context in straightforward language.",
          "Give a practical example, lesson or framework.",
          "Close with a useful takeaway."
        ]
      };

  const professionalIdea = {
    title: "The business perspective",
    format: "LinkedIn post",
    concept: "Share a lesson from your work, a customer problem you understand, or a decision that changed your approach.",
    shotList: [
      "Start with a real observation or problem.",
      "Explain what you learned or how you approached it.",
      "Use a concrete example without inventing results.",
      "End with a useful takeaway for your audience."
    ]
  };

  const videoIdea = {
    title: "The short-form explainer",
    format: "Reel, TikTok or YouTube Short",
    concept: "Answer one customer question in a concise video. Start with the question, show the answer, and end with a relevant next step.",
    shotList: [
      "First shot: show the problem or ask the question.",
      "Second shot: demonstrate the answer.",
      "Third shot: give one useful tip or example.",
      "Final shot: invite the viewer to learn more."
    ]
  };

  const ideas = [visualIdea, professionalIdea];

  if (resources === "video" || resources === "team" || resources === "mixed") {
    ideas.push(videoIdea);
  }

  return ideas;
}

function saveProfile(profile) {
  try {
    localStorage.setItem("socialsyncProfile", JSON.stringify(profile));
    return true;
  } catch (error) {
    console.warn("The profile could not be saved in this browser.", error);
    return false;
  }
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  const data = new FormData(form);

  const profile = {
    businessName: String(data.get("businessName") || "").trim(),
    businessType: String(data.get("businessType") || ""),
    audience: String(data.get("audience") || ""),
    location: String(data.get("location") || ""),
    goals: data.getAll("goals").map(String),
    resources: String(data.get("resources") || ""),
    budget: String(data.get("budget") || ""),
    currentPlatforms: String(data.get("currentPlatforms") || ""),
    challenge: String(data.get("challenge") || "").trim(),
    createdAt: new Date().toISOString()
  };

  if (!profile.businessType || !profile.audience || !profile.goals.length) {
    formError.textContent = "Please complete your business profile and choose at least one goal.";
    return;
  }

  const results = recommendPlatforms(profile);
  const campaignIdeas = makeCampaignIdeas(profile);

  profile.recommendations = results;
  profile.campaignIdeas = campaignIdeas;

  const saved = saveProfile(profile);

  try {
    sessionStorage.setItem("socialsyncCurrentResults", JSON.stringify(profile));
  } catch (error) {
    console.warn("Session storage is unavailable.", error);
  }

  // Display a real, useful summary immediately. The Strategy Lab
  // will provide the detailed recommendations in the next page.
  const resultArea = document.createElement("section");
  resultArea.className = "setup-success";
  resultArea.setAttribute("aria-live", "polite");

  const resultHeading = document.createElement("h3");
  resultHeading.textContent = "Your first strategy is ready.";

  const resultText = document.createElement("p");
  resultText.textContent =
    `Based on your business profile, start by exploring ${results.recommended.slice(0, 3).map((item) => item.name).join(", ")}.`;

  const resultLink = document.createElement("a");
  resultLink.className = "button button-primary";
  resultLink.href = "strategy.html";
  resultLink.textContent = "Explore my recommendations ↗";

  const resultNote = document.createElement("p");
  resultNote.className = "privacy-note";
  resultNote.textContent = saved
    ? "Your profile is saved in this browser so the Strategy Lab can use it."
    : "Your recommendations are ready for this session, but your browser did not allow a persistent save.";

  resultArea.append(resultHeading, resultText, resultLink, resultNote);

  const previous = $(".setup-success");
  if (previous) previous.remove();

  $(".setup-card").append(resultArea);

  resultArea.scrollIntoView({ behavior: "smooth", block: "center" });
});

const mobileMenuButton = $("#mobileMenuButton");
const mainNav = $(".main-nav");

mobileMenuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
  mobileMenuButton.textContent = isOpen ? "×" : "☰";
});

$$(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("open");
    mobileMenuButton?.setAttribute("aria-expanded", "false");
    if (mobileMenuButton) {
      mobileMenuButton.textContent = "☰";
      mobileMenuButton.setAttribute("aria-label", "Toggle navigation");
    }
  });
});

if (form) updateFormStep();
