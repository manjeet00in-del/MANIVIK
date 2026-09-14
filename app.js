/* =========================================================
   MANIVIK V2
   Your Journey. Our Backup.
   APP.JS
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

const MANIVIK = {
  demoMode: true,

  journey: {
    from: "",
    to: "",
    date: ""
  },

  pnr: null,

  prediction: {
    score: 34,
    level: "Low",
    recommendation: "Backup Recommended"
  }
};


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  setMinimumDate();

  console.log("MANIVIK V2 loaded successfully.");

});


/* =========================================================
   DATE
   ========================================================= */

function setMinimumDate() {

  const dateInput = document.getElementById("journeyDate");

  if (!dateInput) return;

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  dateInput.min = `${year}-${month}-${day}`;

}


/* =========================================================
   TAB SYSTEM
   ========================================================= */

function showTab(tabName, button) {

  const contents = document.querySelectorAll(".tab-content");
  const tabs = document.querySelectorAll(".tab");

  contents.forEach(section => {
    section.classList.remove("active");
  });

  tabs.forEach(tab => {
    tab.classList.remove("active");
  });


  const target = document.getElementById(
    `${tabName}Tab`
  );

  if (target) {
    target.classList.add("active");
  }


  if (button) {
    button.classList.add("active");
  }


  window.scrollTo({
    top: 300,
    behavior: "smooth"
  });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMenu() {

  const menu = document.getElementById("mobileMenu");

  if (!menu) return;

  menu.classList.toggle("show");

}


function showTabById(tabName) {

  const tabs = document.querySelectorAll(".tab");

  let matchingButton = null;

  tabs.forEach(tab => {

    const text = tab.innerText.toLowerCase();

    if (
      (tabName === "search" && text.includes("search")) ||
      (tabName === "pnr" && text.includes("pnr")) ||
      (tabName === "alternate" && text.includes("alternate")) ||
      (tabName === "backup" && text.includes("backup"))
    ) {
      matchingButton = tab;
    }

  });


  showTab(tabName, matchingButton);


  const menu = document.getElementById("mobileMenu");

  if (menu) {
    menu.classList.remove("show");
  }

}


/* =========================================================
   SWAP STATIONS
   ========================================================= */

function swapStations() {

  const from = document.getElementById("fromStation");
  const to = document.getElementById("toStation");

  if (!from || !to) return;

  const temporary = from.value;

  from.value = to.value;
  to.value = temporary;

}


/* =========================================================
   SEARCH TRAINS
   ========================================================= */

function searchTrains() {

  const from =
    document.getElementById("fromStation").value.trim();

  const to =
    document.getElementById("toStation").value.trim();

  const date =
    document.getElementById("journeyDate").value;


  if (!from) {

    alert("Please enter your departure station.");

    return;
  }


  if (!to) {

    alert("Please enter your destination.");

    return;
  }


  if (!date) {

    alert("Please select journey date.");

    return;
  }


  if (
    from.toLowerCase() ===
    to.toLowerCase()
  ) {

    alert(
      "Departure and destination cannot be the same."
    );

    return;
  }


  MANIVIK.journey = {
    from,
    to,
    date
  };


  const results =
    document.getElementById("trainResults");


  results.innerHTML = `
    <div class="loading">

      <div class="spinner"></div>

      <p>Finding trains...</p>

    </div>
  `;


  setTimeout(() => {

    renderTrainResults(
      from,
      to,
      date
    );

  }, 700);

}


/* =========================================================
   TRAIN RESULTS
   ========================================================= */

function renderTrainResults(
  from,
  to,
  date
) {

  const results =
    document.getElementById("trainResults");


  const formattedDate =
    formatDate(date);


  results.innerHTML = `

    <div class="section-title">

      <div>
        <h2>
          Trains from ${escapeHTML(from)}
          to ${escapeHTML(to)}
        </h2>

        <p>
          ${formattedDate} · Demo railway data
        </p>
      </div>

      <span class="live-badge">
        ● DEMO
      </span>

    </div>


    ${createTrainCard(
      "12876",
      "Neelachal Express",
      "15:10",
      "17:55",
      "26h 45m",
      "₹1,850",
      "Available",
      from,
      to
    )}


    ${createTrainCard(
      "12586",
      "Lucknow - Puri Express",
      "08:25",
      "12:40",
      "28h 15m",
      "₹1,720",
      "RAC / WL",
      from,
      to
    )}


    ${createTrainCard(
      "22688",
      "Superfast Express",
      "19:20",
      "20:10",
      "24h 50m",
      "₹2,050",
      "Limited",
      from,
      to
    )}

  `;

}


function createTrainCard(
  number,
  name,
  departure,
  arrival,
  duration,
  fare,
  availability,
  from,
  to
) {

  return `

    <div class="result-card">

      <div class="train-top">

        <div>

          <div class="train-name">
            ${name}
          </div>

          <div class="train-number">
            Train No. ${number}
          </div>

        </div>

        <span class="live-badge">
          Popular
        </span>

      </div>


      <div class="train-time">

        <div class="station-time">

          <strong>${departure}</strong>

          <span>${escapeHTML(from)}</span>

        </div>


        <div class="travel-line"></div>


        <div class="duration">
          ${duration}
        </div>


        <div class="travel-line"></div>


        <div class="station-time">

          <strong>${arrival}</strong>

          <span>${escapeHTML(to)}</span>

        </div>

      </div>


      <div class="train-bottom">

        <div>

          <div class="availability">
            ● ${availability}
          </div>

          <div class="fare">
            ${fare}
          </div>

        </div>


        <button
          class="mini-btn"
          onclick="openPNRFromTrain('${number}')"
        >
          Check PNR
        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   OPEN PNR
   ========================================================= */

function openPNRFromTrain(trainNumber) {

  showTabById("pnr");

  const input =
    document.getElementById("pnrInput");

  if (input) {
    input.focus();
  }

}


/* =========================================================
   PNR CHECK
   ========================================================= */

function checkPNR() {

  const input =
    document.getElementById("pnrInput");

  const pnr =
    input.value.trim();


  if (!/^\d{10}$/.test(pnr)) {

    alert(
      "Please enter a valid 10-digit PNR number."
    );

    return;
  }


  MANIVIK.pnr = pnr;


  const result =
    document.getElementById("pnrResult");


  result.innerHTML = `

    <div class="loading">

      <div class="spinner"></div>

      <p>Checking PNR...</p>

    </div>

  `;


  setTimeout(() => {

    renderPNRResult(pnr);

  }, 800);

}


/* =========================================================
   PNR RESULT
   ========================================================= */

function renderPNRResult(pnr) {

  const result =
    document.getElementById("pnrResult");


  const score =
    calculateConfirmationScore(pnr);


  MANIVIK.prediction.score =
    score;


  const level =
    getRiskLevel(score);


  MANIVIK.prediction.level =
    level;


  MANIVIK.prediction.recommendation =
    score < 60
      ? "Backup Recommended"
      : "Backup Not Urgent";


  const scoreColor =
    score >= 80
      ? "#138a4b"
      : score >= 60
        ? "#d88900"
        : "#d83a3a";


  result.innerHTML = `

    <div class="result-card">

      <div class="train-top">

        <div>

          <div class="train-name">
            Neelachal Express
          </div>

          <div class="train-number">
            12876 · ${pnr}
          </div>

        </div>

        <span class="live-badge">
          Demo Result
        </span>

      </div>


      <div style="
        margin-top:18px;
        padding-top:18px;
        border-top:1px solid #edf0f5;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          gap:10px;
          margin-bottom:10px;
        ">

          <strong>Passenger Status</strong>

          <span
            style="
              color:#d83a3a;
              font-weight:800;
            "
          >
            RLWL 7 / 8 / 9
          </span>

        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          gap:10px;
          margin-bottom:10px;
        ">

          <span>Chart Status</span>

          <strong>
            Not Prepared
          </strong>

        </div>


        <div style="
          display:flex;
          justify-content:space-between;
          gap:10px;
        ">

          <span>Journey</span>

          <strong>
            Lucknow → Puri
          </strong>

        </div>

      </div>

    </div>


    <div class="score-card">

      <div class="score-layout">

        <div
          class="score-circle"
          style="
            --score:${score}%;
            --score-color:${scoreColor};
          "
        >

          <div class="score-number">
            ${score}%
          </div>

        </div>


        <div class="score-info">

          <h3 class="${getRiskClass(score)}">
            ${getScoreLabel(score)}
          </h3>

          <p>
            Estimated confirmation probability.
            This is a prediction, not a guarantee.
          </p>

          <br>

          <strong>
            ${MANIVIK.prediction.recommendation}
          </strong>

        </div>

      </div>

    </div>


    <button
      class="primary-btn"
      onclick="loadAlternates()"
      style="width:100%;"
    >
      🔄 Find Backup Options
    </button>

  `;

}


/* =========================================================
   CONFIRMATION ENGINE
   ========================================================= */

function calculateConfirmationScore(pnr) {

  /*
    DEMO prediction engine.

    Later this will receive real inputs:

    Current WL/RAC        30%
    Historical movement  25%
    Journey date         15%
    Train demand         10%
    Quota / route        10%
    Days remaining       10%
  */


  let numeric = 0;


  for (let i = 0; i < pnr.length; i++) {

    numeric +=
      Number(pnr.charAt(i));

  }


  const possibleScores = [
    34,
    42,
    57,
    68,
    74,
    81,
    91
  ];


  return possibleScores[
    numeric % possibleScores.length
  ];

}


function getRiskLevel(score) {

  if (score >= 80) {
    return "Very High";
  }

  if (score >= 60) {
    return "High";
  }

  if (score >= 40) {
    return "Moderate";
  }

  if (score >= 20) {
    return "Low";
  }

  return "Very Low";

}


function getScoreLabel(score) {

  if (score >= 80) {
    return "Very High Confirmation Chance";
  }

  if (score >= 60) {
    return "High Confirmation Chance";
  }

  if (score >= 40) {
    return "Moderate Confirmation Chance";
  }

  if (score >= 20) {
    return "Low Confirmation Chance";
  }

  return "Very Low Confirmation Chance";

}


function getRiskClass(score) {

  if (score >= 80) {
    return "risk-high";
  }

  if (score >= 60) {
    return "risk-medium";
  }

  return "risk-low";

}


/* =========================================================
   ALTERNATE ROUTES
   ========================================================= */

function loadAlternates() {

  const section =
    document.getElementById("alternateTab");

  const results =
    document.getElementById("alternateResults");


  showTabById("alternate");


  results.innerHTML = `

    <div class="loading">

      <div class="spinner"></div>

      <p>
        Finding alternate routes...
      </p>

    </div>

  `;


  setTimeout(() => {

    renderAlternates();

  }, 700);

}


function renderAlternates() {

  const results =
    document.getElementById("alternateResults");


  const from =
    MANIVIK.journey.from || "Lucknow";

  const to =
    MANIVIK.journey.to || "Puri";


  results.innerHTML = `

    <div class="section-title">

      <div>

        <h2>
          Alternate Options
        </h2>

        <p>
          Options found for
          ${escapeHTML(from)}
          → ${escapeHTML(to)}
        </p>

      </div>

    </div>


    ${createRouteCard(
      "Best Chance",
      `${from} → Bhubaneswar → ${to}`,
      "91%",
      "₹2,140",
      "+2h 35m",
      "Lower risk"
    )}


    ${createRouteCard(
      "Cheapest",
      `${from} → Kanpur → ${to}`,
      "84%",
      "₹1,680",
      "+4h 10m",
      "Budget friendly"
    )}


    ${createRouteCard(
      "Fastest",
      `${from} → Bhubaneswar → ${to}`,
      "97%",
      "₹5,450",
      "Fastest",
      "Lowest travel risk"
    )}

  `;

}


function createRouteCard(
  title,
  path,
  score,
  fare,
  time,
  note
) {

  return `

    <div class="route-card">

      <div class="route-info">

        <h3>
          ${title}
        </h3>

        <div class="route-path">
          ${escapeHTML(path)}
        </div>

        <div class="route-meta">

          <span>
            💰 ${fare}
          </span>

          <span>
            ⏱ ${time}
          </span>

          <span>
            ✓ ${note}
          </span>

        </div>

      </div>


      <div class="route-score">

        <strong>
          ${score}
        </strong>

        <span>
          Estimated chance
        </span>

      </div>

    </div>

  `;

}


/* =========================================================
   BACKUP PLAN
   ========================================================= */

function generateBackup() {

  const results =
    document.getElementById("backupResults");


  results.innerHTML = `

    <div class="loading">

      <div class="spinner"></div>

      <p>
        Building your backup plan...
      </p>

    </div>

  `;


  setTimeout(() => {

    renderBackup();

  }, 900);

}


function renderBackup() {

  const results =
    document.getElementById("backupResults");


  const from =
    MANIVIK.journey.from || "Lucknow";

  const to =
    MANIVIK.journey.to || "Puri";


  results.innerHTML = `

    <div class="section-title">

      <div>

        <h2>
          Your MANIVIK Backup
        </h2>

        <p>
          Three options based on chance,
          cost and travel time.
        </p>

      </div>

    </div>


    ${createBackupCard(
      "Best Chance",
      `${from} → Bhubaneswar → ${to}`,
      "91%",
      "₹2,140",
      "+2h 35m",
      "Best overall option",
      true
    )}


    ${createBackupCard(
      "Cheapest",
      `${from} → Kanpur → ${to}`,
      "84%",
      "₹1,680",
      "+4h 10m",
      "Save money",
      false
    )}


    ${createBackupCard(
      "Fastest",
      `${from} → Bhubaneswar → ${to}`,
      "97%",
      "₹5,450",
      "Fastest",
      "Maximum travel confidence",
      false
    )}

  `;

}


function createBackupCard(
  type,
  path,
  score,
  fare,
  time,
  note,
  recommended
) {

  return `

    <div class="
      backup-card
      ${recommended ? "recommended" : ""}
    ">

      ${
        recommended
          ? `
            <div class="recommended-label">
              MANIVIK RECOMMENDS
            </div>
          `
          : ""
      }


      <div class="backup-top">

        <div>

          <div class="backup-type">
            ${type}
          </div>

          <h3>
            ${escapeHTML(path)}
          </h3>

          <div class="backup-path">
            ${note}
          </div>

        </div>


        <div class="backup-score">

          <strong>
            ${score}
          </strong>

          <span>
            Estimated chance
          </span>

        </div>

      </div>


      <div class="backup-details">

        <div class="backup-detail">
          💰 ${fare}
        </div>

        <div class="backup-detail">
          ⏱ ${time}
        </div>

        <div class="backup-detail">
          🛡 Lower journey risk
        </div>

        <div class="backup-detail">
          🔄 Alternate route
        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(dateString) {

  if (!dateString) {
    return "Date not selected";
  }


  const date =
    new Date(dateString + "T00:00:00");


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   API PLACEHOLDER
   ========================================================= */

/*
   IMPORTANT

   अभी MANIVIK DEMO MODE में है.

   Future real API calls:

   searchTrains()
   getPNRStatus()
   getAvailability()
   getTrainSchedule()
   getLiveTrainStatus()

   ये calls बाद में Cloudflare Worker के
   माध्यम से जाएँगी.

   API key कभी भी frontend JavaScript में
   directly नहीं रखनी है.
*/


async function apiRequest(endpoint, options = {}) {

  const API_BASE_URL =
    "/api";

  try {

    const response =
      await fetch(
        API_BASE_URL + endpoint,
        {
          ...options,

          headers: {
            "Content-Type":
              "application/json",

            ...(options.headers || {})
          }
        }
      );


    if (!response.ok) {

      throw new Error(
        `API Error: ${response.status}`
      );

    }


    return await response.json();

  } catch (error) {

    console.error(
      "MANIVIK API Error:",
      error
    );

    throw error;

  }

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.showTab = showTab;
window.toggleMenu = toggleMenu;
window.showTabById = showTabById;
window.swapStations = swapStations;
window.searchTrains = searchTrains;
window.checkPNR = checkPNR;
window.loadAlternates = loadAlternates;
window.generateBackup = generateBackup;
window.openPNRFromTrain = openPNRFromTrain;
