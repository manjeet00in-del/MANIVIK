/* =========================================================
   MANIVIK
   YOUR JOURNEY. OUR BACKUP.
   Version 3.1
   ZERO-COST REAL PNR MODEL
   ========================================================= */

"use strict";


/* =========================================================
   MANIVIK STATE
   ========================================================= */

const MANIVIK = {

    from: "",
    to: "",
    date: "",
    pnr: "",

    railwayPNR:
        "https://indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en"

};


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setMinimumDate();

    console.log("MANIVIK loaded successfully.");

});


/* =========================================================
   SET MINIMUM JOURNEY DATE
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
   MOBILE MENU
   ========================================================= */

function toggleMenu() {

    const menu =
        document.getElementById("mobileMenu");

    if (!menu) return;

    menu.classList.toggle("open");

}


/* =========================================================
   CLOSE MOBILE MENU
   ========================================================= */

function closeMenu() {

    const menu =
        document.getElementById("mobileMenu");

    if (!menu) return;

    menu.classList.remove("open");

}


/* =========================================================
   SWAP FROM / TO
   ========================================================= */

function swapStations() {

    const from =
        document.getElementById("fromStation");

    const to =
        document.getElementById("toStation");

    if (!from || !to) return;

    const temp =
        from.value;

    from.value =
        to.value;

    to.value =
        temp;

}


/* =========================================================
   TAB SYSTEM
   ========================================================= */

function showTab(tabName, clickedButton) {

    const tabs = [
        "search",
        "pnr",
        "alternate",
        "backup"
    ];


    /* Hide all sections */

    tabs.forEach(function (name) {

        const section =
            document.getElementById(
                name + "Tab"
            );

        if (section) {

            section.classList.remove(
                "active"
            );

        }

    });


    /* Remove active from buttons */

    const tabButtons =
        document.querySelectorAll(
            ".tabs .tab"
        );

    tabButtons.forEach(function (button) {

        button.classList.remove(
            "active"
        );

    });


    /* Show selected section */

    const selected =
        document.getElementById(
            tabName + "Tab"
        );

    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    /* Activate clicked button */

    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    } else {

        const buttons =
            document.querySelectorAll(
                ".tabs .tab"
            );

        buttons.forEach(function (button) {

            const text =
                button.textContent
                    .toLowerCase();

            if (
                (tabName === "search" &&
                    text.includes("search")) ||

                (tabName === "pnr" &&
                    text.includes("pnr")) ||

                (tabName === "alternate" &&
                    text.includes("alternate")) ||

                (tabName === "backup" &&
                    text.includes("backup"))
            ) {

                button.classList.add(
                    "active"
                );

            }

        });

    }


    closeMenu();


    /* Scroll to section */

    if (selected) {

        setTimeout(function () {

            selected.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 50);

    }

}


/* =========================================================
   TAB BY ID
   Used by Mobile Menu
   ========================================================= */

function showTabById(tabName) {

    showTab(tabName, null);

}


/* =========================================================
   SEARCH TRAINS
   ========================================================= */

function searchTrains() {

    const fromInput =
        document.getElementById(
            "fromStation"
        );

    const toInput =
        document.getElementById(
            "toStation"
        );

    const dateInput =
        document.getElementById(
            "journeyDate"
        );


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


    /* Validation */

    if (!from) {

        showSearchMessage(
            "Please enter your departure station."
        );

        return;

    }


    if (!to) {

        showSearchMessage(
            "Please enter your destination station."
        );

        return;

    }


    if (!date) {

        showSearchMessage(
            "Please select your journey date."
        );

        return;

    }


    if (
        from.toLowerCase()
        ===
        to.toLowerCase()
    ) {

        showSearchMessage(
            "From and To stations cannot be the same."
        );

        return;

    }


    MANIVIK.from =
        from;

    MANIVIK.to =
        to;

    MANIVIK.date =
        date;


    /* Open Search tab */

    showTabById("search");


    /* Loading */

    const results =
        document.getElementById(
            "trainResults"
        );

    if (!results) return;


    results.innerHTML = `

        <div class="loading-card">

            <div class="loader"></div>

            <h3>
                Searching your journey...
            </h3>

            <p>
                MANIVIK is preparing available
                travel options.
            </p>

        </div>

    `;


    /* Demo search result */

    setTimeout(function () {

        showTrainResults();

    }, 700);

}


/* =========================================================
   TRAIN RESULTS
   ========================================================= */

function showTrainResults() {

    const results =
        document.getElementById(
            "trainResults"
        );

    if (!results) return;


    results.innerHTML = `

        <div class="result-header">

            <div>

                <span class="result-label">
                    JOURNEY SEARCH
                </span>

                <h3>
                    ${escapeHTML(MANIVIK.from)}
                    →
                    ${escapeHTML(MANIVIK.to)}
                </h3>

                <p>
                    ${formatDate(MANIVIK.date)}
                </p>

            </div>

            <span class="live-badge">
                PREVIEW
            </span>

        </div>


        <!-- TRAIN 1 -->

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

                    <span>→</span>

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
                    💺 Sleeper
                </span>

            </div>


            <div class="availability">

                <span class="availability-good">
                    Check Availability
                </span>

                <strong>
                    ₹850+
                </strong>

            </div>


            <div class="train-actions">

                <button
                    class="primary-btn"
                    onclick="generateBackup()"
                >
                    🛟 Backup Plan
                </button>

                <button
                    class="secondary-btn"
                    onclick="showTabById('pnr')"
                >
                    🎫 Check PNR
                </button>

            </div>

        </div>


        <!-- TRAIN 2 -->

        <div class="train-card">

            <div class="train-main">

                <div>

                    <strong>
                        12560
                    </strong>

                    <h3>
                        Shiv Ganga Express
                    </h3>

                </div>

                <div class="train-timing">

                    <strong>
                        21:15
                    </strong>

                    <span>→</span>

                    <strong>
                        18:30
                    </strong>

                </div>

            </div>


            <div class="train-info">

                <span>
                    🚆 Express
                </span>

                <span>
                    ⏱ 21h 15m
                </span>

                <span>
                    💺 3A
                </span>

            </div>


            <div class="availability">

                <span class="availability-good">
                    Check Availability
                </span>

                <strong>
                    ₹1,450+
                </strong>

            </div>


            <div class="train-actions">

                <button
                    class="primary-btn"
                    onclick="generateBackup()"
                >
                    🛟 Backup Plan
                </button>

                <button
                    class="secondary-btn"
                    onclick="loadAlternates()"
                >
                    🔄 Alternate
                </button>

            </div>

        </div>


        <div class="info-note">

            ℹ️ These train results are currently
            a MANIVIK preview. Live railway
            availability will be connected later.

        </div>

    `;

}


/* =========================================================
   SEARCH MESSAGE
   ========================================================= */

function showSearchMessage(message) {

    const results =
        document.getElementById(
            "trainResults"
        );

    if (!results) {

        alert(message);

        return;

    }


    results.innerHTML = `

        <div class="error-card">

            <div class="error-icon">
                ⚠️
            </div>

            <h3>
                Journey Details Required
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   PNR CHECK
   ========================================================= */

function checkPNR() {

    const input =
        document.getElementById(
            "pnrInput"
        );

    const result =
        document.getElementById(
            "pnrResult"
        );


    if (!input || !result) return;


    const pnr =
        input.value.trim();


    /* Validate */

    if (!/^\d{10}$/.test(pnr)) {

        result.innerHTML = `

            <div class="error-card">

                <div class="error-icon">
                    ⚠️
                </div>

                <h3>
                    Invalid PNR
                </h3>

                <p>
                    Please enter a valid
                    10-digit PNR number.
                </p>

            </div>

        `;

        return;

    }


    MANIVIK.pnr =
        pnr;


    /* Show zero-cost PNR option */

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

                🔒 MANIVIK does not collect
                or store your railway PNR.

                <br><br>

                Your live status will be checked
                directly on the official
                Indian Railways website.

            </div>


            <button
                class="primary-btn"
                onclick="openRailwayPNR()"
            >
                🚆 Check Live PNR
                on Indian Railways
            </button>


            <button
                class="secondary-btn"
                onclick="generateBackup()"
            >
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
   OPEN OFFICIAL INDIAN RAILWAYS PNR
   ========================================================= */

function openRailwayPNR() {

    window.open(
        MANIVIK.railwayPNR,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   ALTERNATE ROUTES
   ========================================================= */

function loadAlternates() {

    showTabById("alternate");


    const results =
        document.getElementById(
            "alternateResults"
        );

    if (!results) return;


    const from =
        MANIVIK.from
        || "Lucknow";


    const to =
        MANIVIK.to
        || "Puri";


    results.innerHTML = `

        <div class="result-header">

            <div>

                <span class="result-label">
                    MANIVIK BACKUP ENGINE
                </span>

                <h3>
                    Alternate Journey Options
                </h3>

                <p>
                    ${escapeHTML(from)}
                    →
                    ${escapeHTML(to)}
                </p>

            </div>

        </div>


        <div class="route-card">

            <div class="route-icon">
                🥇
            </div>

            <div class="route-content">

                <h3>
                    Best Chance
                </h3>

                <p>
                    Alternate train / route
                </p>

                <strong>
                    High availability potential
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
                    Budget Option
                </h3>

                <p>
                    Lower-cost alternate journey
                </p>

                <strong>
                    Value focused
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
                    Fastest Option
                </h3>

                <p>
                    Prioritises travel time
                </p>

                <strong>
                    Time focused
                </strong>

            </div>

            <span class="route-tag">
                FAST
            </span>

        </div>


        <div class="info-note">

            ℹ️ MANIVIK will connect real train
            availability here in a future version.

        </div>

    `;

}


/* =========================================================
   BACKUP PLAN
   ========================================================= */

function generateBackup() {

    showTabById("backup");


    const results =
        document.getElementById(
            "backupResults"
        );

    if (!results) return;


    results.innerHTML = `

        <div class="backup-plan-card recommended">

            <div class="backup-top">

                <span class="recommended-badge">
                    ⭐ RECOMMENDED
                </span>

                <span class="risk-score">
                    BACKUP A
                </span>

            </div>


            <h3>
                Best Journey Backup
            </h3>


            <p>
                Choose another train or alternate
                route instead of depending only
                on your uncertain ticket.
            </p>


            <div class="backup-details">

                <span>
                    🚆 Alternate Train
                </span>

                <span>
                    💰 Compare Fare
                </span>

                <span>
                    ⏱ Compare Time
                </span>

            </div>


            <button
                class="primary-btn"
                onclick="loadAlternates()"
            >
                🔄 Explore Alternatives
            </button>

        </div>


        <div class="backup-plan-card">

            <div class="backup-top">

                <span>
                    💰 Budget
                </span>

                <span class="risk-score">
                    OPTION B
                </span>

            </div>


            <h3>
                Cheapest Backup
            </h3>


            <p>
                Look for another train, nearby station
                or different travel combination.
            </p>


            <button
                class="secondary-btn"
                onclick="searchTrains()"
            >
                🔎 Search Journey
            </button>

        </div>


        <div class="backup-plan-card">

            <div class="backup-top">

                <span>
                    ⚡ Fast
                </span>

                <span class="risk-score">
                    OPTION C
                </span>

            </div>


            <h3>
                Fastest Backup
            </h3>


            <p>
                Prioritise travel time when your
                journey date is close.
            </p>


            <button
                class="secondary-btn"
                onclick="loadAlternates()"
            >
                🔄 Find Another Route
            </button>

        </div>


        <div class="info-note">

            ⚠️ MANIVIK does not currently claim
            these options are live railway
            availability. This is the MVP
            backup-planning engine.

        </div>

    `;

}


/* =========================================================
   HTML ESCAPE
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
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date.getTime())) {

        return dateString;

    }


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
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.getElementById(
                "mobileMenu"
            );

        const button =
            document.querySelector(
                ".menu-btn"
            );


        if (!menu || !button) return;


        if (
            menu.classList.contains("open")
            &&
            !menu.contains(event.target)
            &&
            !button.contains(event.target)
        ) {

            menu.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   =========================================================
   Required because HTML uses onclick=""
   ========================================================= */

window.toggleMenu =
    toggleMenu;

window.showTab =
    showTab;

window.showTabById =
    showTabById;

window.swapStations =
    swapStations;

window.searchTrains =
    searchTrains;

window.checkPNR =
    checkPNR;

window.openRailwayPNR =
    openRailwayPNR;

window.loadAlternates =
    loadAlternates;

window.generateBackup =
    generateBackup;


/* =========================================================
   READY
   ========================================================= */

console.log(
    "🚆 MANIVIK is ready."
);

console.log(
    "PNR Mode: ZERO COST"
);

console.log(
    "Railway API: NOT REQUIRED"
);
