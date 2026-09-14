/* =========================================================
   MANIVIK
   AI TRAVEL BACKUP ENGINE
   Version: 3.0 - ZERO COST PNR MODEL

   Features:
   - Train Search Demo
   - Official Railway PNR Redirect
   - PNR Validation
   - Alternate Route
   - Backup Plan
   - Mobile Menu
   - Station Swap
   - Demo Risk Engine
   - No API Key
   - No Backend
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

const MANIVIK = {

    demoMode: true,

    currentTab: "search",

    searchData: {
        from: "",
        to: "",
        date: "",
        class: "SL",
        passengers: 1
    },

    pnr: "",

    railwayPNRUrl:
        "https://indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en"
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setMinimumDate();

    initializeTabs();

    initializeMobileMenu();

    initializeSwap();

    initializeSearch();

    initializePNR();

    initializeBackupButtons();

    console.log("MANIVIK initialized successfully.");

});


/* =========================================================
   DATE
   ========================================================= */

function setMinimumDate() {

    const dateInput =
        document.getElementById("journeyDate");

    if (!dateInput) return;

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(today.getDate())
        .padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;

}


/* =========================================================
   TABS
   ========================================================= */

function initializeTabs() {

    const tabs =
        document.querySelectorAll("[data-tab]");

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const tabName =
                this.getAttribute("data-tab");

            switchTab(tabName);

        });

    });

}


function switchTab(tabName) {

    MANIVIK.currentTab =
        tabName;

    /* Tab buttons */

    const tabs =
        document.querySelectorAll("[data-tab]");

    tabs.forEach(function (tab) {

        tab.classList.remove("active");

        if (
            tab.getAttribute("data-tab")
            === tabName
        ) {
            tab.classList.add("active");
        }

    });


    /* Sections */

    const sections =
        document.querySelectorAll("[data-section]");

    sections.forEach(function (section) {

        section.classList.remove("active");

        if (
            section.getAttribute("data-section")
            === tabName
        ) {
            section.classList.add("active");
        }

    });


    /* Common ID fallback */

    const allSections = [
        "searchSection",
        "pnrSection",
        "alternateSection",
        "backupSection"
    ];

    allSections.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (!element) return;

        element.classList.remove("active");

    });


    const sectionMap = {

        search: "searchSection",

        pnr: "pnrSection",

        alternate: "alternateSection",

        backup: "backupSection"

    };


    const targetId =
        sectionMap[tabName];

    if (targetId) {

        const target =
            document.getElementById(targetId);

        if (target) {

            target.classList.add("active");

        }

    }

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById("menuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (!menuButton || !mobileMenu) return;

    menuButton.addEventListener(
        "click",
        function () {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================================================
   SWAP FROM / TO
   ========================================================= */

function initializeSwap() {

    const swapButton =
        document.getElementById("swapStations");

    if (!swapButton) return;

    swapButton.addEventListener(
        "click",
        function () {

            const fromInput =
                document.getElementById("fromStation");

            const toInput =
                document.getElementById("toStation");

            if (!fromInput || !toInput)
                return;

            const temp =
                fromInput.value;

            fromInput.value =
                toInput.value;

            toInput.value =
                temp;

        }
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeSearch() {

    const searchButton =
        document.getElementById("searchTrains");

    if (!searchButton) return;

    searchButton.addEventListener(
        "click",
        function () {

            searchTrains();

        }
    );

}


function searchTrains() {

    const fromInput =
        document.getElementById("fromStation");

    const toInput =
        document.getElementById("toStation");

    const dateInput =
        document.getElementById("journeyDate");

    const classInput =
        document.getElementById("travelClass");

    const passengerInput =
        document.getElementById("passengers");


    const from =
        fromInput
            ? fromInput.value.trim()
            : "";

    const to =
        toInput
            ? toInput.value.trim()
            : "";

    const date =
        dateInput
            ? dateInput.value
            : "";

    const travelClass =
        classInput
            ? classInput.value
            : "SL";

    const passengers =
        passengerInput
            ? passengerInput.value
            : 1;


    if (!from || !to) {

        showSearchError(
            "Please enter both From and To stations."
        );

        return;

    }


    if (!date) {

        showSearchError(
            "Please select your journey date."
        );

        return;

    }


    if (
        from.toLowerCase()
        === to.toLowerCase()
    ) {

        showSearchError(
            "From and To stations cannot be the same."
        );

        return;

    }


    MANIVIK.searchData = {

        from,
        to,
        date,
        class: travelClass,
        passengers

    };


    showSearchLoading();


    setTimeout(function () {

        showDemoTrainResults();

    }, 700);

}


/* =========================================================
   SEARCH LOADING
   ========================================================= */

function showSearchLoading() {

    const result =
        getElement(
            [
                "searchResults",
                "trainResults",
                "results"
            ]
        );

    if (!result) return;

    result.innerHTML = `

        <div class="loading-card">

            <div class="loader"></div>

            <h3>
                Searching trains...
            </h3>

            <p>
                MANIVIK is checking available
                journey options.
            </p>

        </div>

    `;

}


/* =========================================================
   DEMO TRAIN RESULTS
   ========================================================= */

function showDemoTrainResults() {

    const result =
        getElement(
            [
                "searchResults",
                "trainResults",
                "results"
            ]
        );

    if (!result) return;


    const from =
        escapeHTML(
            MANIVIK.searchData.from
        );

    const to =
        escapeHTML(
            MANIVIK.searchData.to
        );


    result.innerHTML = `

        <div class="result-header">

            <div>

                <span class="result-label">
                    MANIVIK Search
                </span>

                <h3>
                    ${from} → ${to}
                </h3>

            </div>

            <span class="demo-badge">
                Preview
            </span>

        </div>


        <div class="train-card">

            <div class="train-main">

                <div>

                    <strong>
                        12876
                    </strong>

                    <h3>
                        Neelachal Express
                    </h3>

                </div>

                <div class="train-timing">

                    <strong>
                        06:30
                    </strong>

                    <span>
                        →
                    </span>

                    <strong>
                        11:20
                    </strong>

                </div>

            </div>


            <div class="train-info">

                <span>
                    🚆 Superfast
                </span>

                <span>
                    ⏱ 28h 50m
                </span>

                <span>
                    💺 SL
                </span>

            </div>


            <div class="availability">

                <span class="availability-good">
                    Available / Check
                </span>

                <strong>
                    ₹850
                </strong>

            </div>


            <div class="train-actions">

                <button
                    class="primary-btn"
                    onclick="openBackupFromSearch()">

                    🛟 Backup Plan

                </button>

                <button
                    class="secondary-btn"
                    onclick="openPNRTab()">

                    🎫 Check PNR

                </button>

            </div>

        </div>


        <div class="info-note">

            ℹ️ Train availability shown here is
            currently a MANIVIK preview.
            Real railway availability will be
            connected later through an authorised
            data provider.

        </div>

    `;

}


/* =========================================================
   PNR INITIALIZATION
   ========================================================= */

function initializePNR() {

    const button =
        document.getElementById("checkPNR");

    if (button) {

        button.addEventListener(
            "click",
            checkPNR
        );

    }


    /* Support common alternative IDs */

    const alternateButton =
        document.getElementById("checkPnrButton");

    if (
        alternateButton
        &&
        alternateButton !== button
    ) {

        alternateButton.addEventListener(
            "click",
            checkPNR
        );

    }

}


/* =========================================================
   REAL PNR - ZERO COST
   ========================================================= */

function checkPNR() {

    const input =
        getElement(
            [
                "pnrInput",
                "pnrNumber",
                "pnr"
            ]
        );


    if (!input) {

        alert(
            "PNR input field not found."
        );

        return;

    }


    const pnr =
        input.value.trim();


    /* 10 digit validation */

    if (!/^\d{10}$/.test(pnr)) {

        showPNRError(
            "Please enter a valid 10-digit PNR number."
        );

        return;

    }


    MANIVIK.pnr =
        pnr;


    showPNRReady(pnr);

}


/* =========================================================
   PNR READY SCREEN
   ========================================================= */

function showPNRReady(pnr) {

    const result =
        getElement(
            [
                "pnrResult",
                "pnrResults",
                "pnr-result"
            ]
        );


    if (!result) {

        openRailwayPNR();

        return;

    }


    result.innerHTML = `

        <div class="pnr-card">

            <div class="pnr-icon">
                🚆
            </div>

            <span class="result-label">
                MANIVIK PNR CHECK
            </span>

            <h3>
                PNR Ready
            </h3>

            <p>
                PNR
                <strong>${pnr}</strong>
                is ready to check.
            </p>

            <div class="pnr-official-note">

                🔒 Your PNR is not stored by MANIVIK.
                You will check the live status directly
                on the official Indian Railways website.

            </div>


            <button
                class="primary-btn"
                onclick="openRailwayPNR()">

                🚆 Check Live PNR
                on Indian Railways

            </button>


            <button
                class="secondary-btn"
                onclick="showBackupOptions()">

                🛟 Find Backup Plan

            </button>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   OPEN OFFICIAL RAILWAY WEBSITE
   ========================================================= */

function openRailwayPNR() {

    window.open(
        MANIVIK.railwayPNRUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   BACKUP OPTIONS
   ========================================================= */

function showBackupOptions() {

    const result =
        getElement(
            [
                "pnrResult",
                "pnrResults",
                "pnr-result"
            ]
        );


    if (!result) return;


    result.innerHTML = `

        <div class="backup-intro">

            <div class="backup-icon">
                🛟
            </div>

            <span class="result-label">
                MANIVIK
            </span>

            <h3>
                Your Journey Needs a Backup?
            </h3>

            <p>

                If your railway ticket is not confirmed,
                MANIVIK can help you explore another
                journey option.

            </p>


            <div class="backup-options">

                <button
                    class="backup-action"
                    onclick="activateAlternateRoute()">

                    🔄
                    <span>
                        Alternate Route
                    </span>

                </button>


                <button
                    class="backup-action"
                    onclick="activateTrainSearch()">

                    🚆
                    <span>
                        Search Another Train
                    </span>

                </button>


                <button
                    class="backup-action"
                    onclick="activateBackupPlan()">

                    🛟
                    <span>
                        Create Backup Plan
                    </span>

                </button>

            </div>


            <button
                class="secondary-btn"
                onclick="openRailwayPNR()">

                Check Railway PNR Again

            </button>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   ALTERNATE ROUTE
   ========================================================= */

function activateAlternateRoute() {

    switchTab("alternate");


    const section =
        getElement(
            [
                "alternateSection",
                "alternate"
            ]
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    showDemoAlternateRoutes();

}


/* =========================================================
   DEMO ALTERNATE ROUTES
   ========================================================= */

function showDemoAlternateRoutes() {

    const result =
        getElement(
            [
                "alternateResults",
                "alternateResult",
                "alternate-results"
            ]
        );


    if (!result) return;


    const from =
        escapeHTML(
            MANIVIK.searchData.from
            || "Lucknow"
        );


    const to =
        escapeHTML(
            MANIVIK.searchData.to
            || "Puri"
        );


    result.innerHTML = `

        <div class="alternate-header">

            <span class="result-label">
                MANIVIK BACKUP ENGINE
            </span>

            <h3>
                Alternative Journey Options
            </h3>

            <p>
                ${from} → ${to}
            </p>

        </div>


        <div class="route-card">

            <div class="route-icon">
                🥇
            </div>

            <div class="route-content">

                <h3>
                    Best Confirmation Chance
                </h3>

                <p>
                    Alternate train / route
                </p>

                <strong>
                    Estimated 91%
                </strong>

            </div>

            <span class="route-tag">
                BEST
            </span>

        </div>


        <div class="route-card">

            <div class="route-icon">
                💰
            </div>

            <div class="route-content">

                <h3>
                    Cheapest Backup
                </h3>

                <p>
                    Lower-cost alternative journey
                </p>

                <strong>
                    Estimated 84%
                </strong>

            </div>

            <span class="route-tag">
                VALUE
            </span>

        </div>


        <div class="route-card">

            <div class="route-icon">
                ⚡
            </div>

            <div class="route-content">

                <h3>
                    Fastest Backup
                </h3>

                <p>
                    Faster alternate connection
                </p>

                <strong>
                    Estimated 97%
                </strong>

            </div>

            <span class="route-tag">
                FAST
            </span>

        </div>


        <div class="info-note">

            ⚠️ These recommendations are currently
            demonstration data. Real availability
            will be added later.

        </div>

    `;

}


/* =========================================================
   TRAIN SEARCH
   ========================================================= */

function activateTrainSearch() {

    switchTab("search");


    const section =
        getElement(
            [
                "searchSection",
                "search"
            ]
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   BACKUP PLAN
   ========================================================= */

function activateBackupPlan() {

    switchTab("backup");


    const section =
        getElement(
            [
                "backupSection",
                "backup"
            ]
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    showDemoBackupPlan();

}


/* =========================================================
   DEMO BACKUP PLAN
   ========================================================= */

function showDemoBackupPlan() {

    const result =
        getElement(
            [
                "backupResults",
                "backupResult",
                "backup-results"
            ]
        );


    if (!result) return;


    result.innerHTML = `

        <div class="backup-plan-header">

            <span class="result-label">
                MANIVIK BACKUP PLAN
            </span>

            <h3>
                Don't depend on one ticket.
            </h3>

            <p>
                Compare your backup options
                before your journey.
            </p>

        </div>


        <div class="backup-plan-card recommended">

            <div class="backup-top">

                <span class="recommended-badge">
                    ⭐ RECOMMENDED
                </span>

                <span class="risk-score">
                    91%
                </span>

            </div>


            <h3>
                Option A — Best Chance
            </h3>

            <p>
                Higher confirmation probability
                with balanced price and journey time.
            </p>


            <div class="backup-details">

                <span>
                    💰 ₹1,050
                </span>

                <span>
                    ⏱ 29h
                </span>

                <span>
                    🔄 1 Change
                </span>

            </div>


            <button
                class="primary-btn"
                onclick="activateTrainSearch()">

                Explore Option

            </button>

        </div>


        <div class="backup-plan-card">

            <div class="backup-top">

                <span>
                    💰 Cheapest
                </span>

                <span class="risk-score">
                    84%
                </span>

            </div>


            <h3>
                Option B — Budget
            </h3>

            <p>
                Lower cost alternative
                for flexible travellers.
            </p>


            <div class="backup-details">

                <span>
                    💰 ₹720
                </span>

                <span>
                    ⏱ 34h
                </span>

                <span>
                    🔄 2 Changes
                </span>

            </div>


            <button
                class="secondary-btn"
                onclick="activateTrainSearch()">

                Explore Option

            </button>

        </div>


        <div class="backup-plan-card">

            <div class="backup-top">

                <span>
                    ⚡ Fastest
                </span>

                <span class="risk-score">
                    97%
                </span>

            </div>


            <h3>
                Option C — Fastest
            </h3>

            <p>
                Prioritises journey time
                over price.
            </p>


            <div class="backup-details">

                <span>
                    💰 ₹1,850
                </span>

                <span>
                    ⏱ 20h
                </span>

                <span>
                    🔄 1 Change
                </span>

            </div>


            <button
                class="secondary-btn"
                onclick="activateTrainSearch()">

                Explore Option

            </button>

        </div>


        <div class="info-note">

            ℹ️ Confirmation percentages shown above
            are demonstration values only.
            MANIVIK will not present them as
            real predictions until reliable
            railway data is connected.

        </div>

    `;

}


/* =========================================================
   PNR ERROR
   ========================================================= */

function showPNRError(message) {

    const result =
        getElement(
            [
                "pnrResult",
                "pnrResults",
                "pnr-result"
            ]
        );


    if (!result) {

        alert(message);

        return;

    }


    result.innerHTML = `

        <div class="error-card">

            <div class="error-icon">
                ⚠️
            </div>

            <h3>
                Invalid PNR
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;


    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   SEARCH ERROR
   ========================================================= */

function showSearchError(message) {

    const result =
        getElement(
            [
                "searchResults",
                "trainResults",
                "results"
            ]
        );


    if (!result) {

        alert(message);

        return;

    }


    result.innerHTML = `

        <div class="error-card">

            <div class="error-icon">
                ⚠️
            </div>

            <h3>
                Search Required
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   OPEN PNR TAB
   ========================================================= */

function openPNRTab() {

    switchTab("pnr");


    const section =
        getElement(
            [
                "pnrSection",
                "pnr"
            ]
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================================
   OPEN BACKUP FROM SEARCH
   ========================================================= */

function openBackupFromSearch() {

    activateBackupPlan();

}


/* =========================================================
   GENERIC ELEMENT FINDER
   ========================================================= */

function getElement(ids) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const element =
            document.getElementById(
                ids[i]
            );

        if (element) {

            return element;

        }

    }

    return null;

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FUTURE API PLACEHOLDER
   =========================================================
   IMPORTANT:

   Currently NOT USED.

   Later, if MANIVIK gets a railway data provider,
   only this layer needs to be connected.

   Frontend API keys should NEVER be stored here.
   ========================================================= */

async function apiRequest(
    endpoint,
    options = {}
) {

    const API_BASE_URL = "/api";

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
                "API request failed"
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
   FUTURE API FUNCTIONS
   ========================================================= */

async function getPNRStatus(pnr) {

    return apiRequest(
        `/pnr/${encodeURIComponent(pnr)}`
    );

}


async function getTrainAvailability(
    from,
    to,
    date,
    trainNumber
) {

    const query =
        new URLSearchParams({

            from,
            to,
            date,
            trainNumber

        });


    return apiRequest(
        `/availability?${query.toString()}`
    );

}


async function getTrainSchedule(
    trainNumber
) {

    return apiRequest(
        `/schedule/${encodeURIComponent(trainNumber)}`
    );

}


async function getLiveTrainStatus(
    trainNumber,
    date
) {

    const query =
        new URLSearchParams({

            trainNumber,
            date

        });


    return apiRequest(
        `/running-status?${query.toString()}`
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
   =========================================================
   These make onclick="" buttons work.
   ========================================================= */

window.checkPNR =
    checkPNR;

window.openRailwayPNR =
    openRailwayPNR;

window.showBackupOptions =
    showBackupOptions;

window.activateAlternateRoute =
    activateAlternateRoute;

window.activateTrainSearch =
    activateTrainSearch;

window.activateBackupPlan =
    activateBackupPlan;

window.openPNRTab =
    openPNRTab;

window.openBackupFromSearch =
    openBackupFromSearch;

window.searchTrains =
    searchTrains;


/* =========================================================
   MANIVIK READY
   ========================================================= */

console.log(
    "🚆 MANIVIK - AI Travel Backup Engine"
);

console.log(
    "Mode: ZERO COST PNR MODEL"
);

console.log(
    "Railway API: Not connected"
);

console.log(
    "Official Railway PNR:",
    MANIVIK.railwayPNRUrl
);
