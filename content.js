let riskScore = 0;
let findings = [];

const hostname = window.location.hostname.toLowerCase();

const pageText = document.body.innerText.toLowerCase();
const pageTitle = (document.title || "").toLowerCase();
// find way to check for capitalization incase phishing site uses mixed caps to mask domain name (e.g. fIvErR.com)

const suspiciousDomains = [
    ".top", ".xyz", ".xin", 
    ".shop", ".cfd", ".lol", ".cf", ".ml", 
    ".ga", ".work", ".gq", ".fit", ".tk"
];

const trustedDomains = [
    ".edu", ".gov", ".mil"
];

const maliciousPhrases = [
    "human verification",
    "verify your identity",
    "verify account",
    "verify your account",
    "confirm your identity",
    "confirm identity",
    "identity confirmation",
    "account suspended",
    "unusual activity",
    "unusual account activity",
    "collect your payment",
    "collect your funds",
    "claim your funds",
    "collect your payment",
    "act now",
    "action required",
    "urgent action required",
    "urgent action needed"
];


function addFinding(points, message){
    riskScore += points;
    findings.push({points, message});
}

//New

//CHECKS
function isOnDomain(hostname, domain){
    return hostname === domain || hostname.endsWith("." + domain);
}

function pageWantsSensitiveData(){
    const cardInputs = document.querySelectorAll(
        'input[autocomplete^="cc-"], input[name*="card"], input[id*="card"], ' +
        'input[name*="cvv"], input[id*="cvv"], input[name*="cvc"]'
    );
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    return {
        card: cardInputs.length > 0,
        password: passwordInputs.length > 0
    };
}

//Layers
// 1. Brand Impersonation
function checkBrandImpersonation(inputs) {
    for (const brandName in brands) {
        const brand = brands[brandName];
        const onRealDomain = isOnDomain(hostname, brand.domain);
        if (onRealDomain) continue; 

        
        if (hostname.includes(brandName.replace(" ", ""))) {
            addFinding(brand.riskWeight + 10,
                `Hostname contains "${brandName}" but is not ${brand.domain}`);
            continue; 
        }

        const mentioned = pageTitle.includes(brandName) || pageText.includes(brandName);
        if (mentioned && (inputs.card || inputs.password)) {
            addFinding(brand.riskWeight,
                `Page imitates "${brandName}" (asks for credentials/card) but host is ${hostname}, not ${brand.domain}`);
        }
    }
}
//2. Domain

function checkTld() {
    for (const tld of suspiciousDomains) {
        if (hostname.endsWith(tld)) {
            addFinding(35, `Domain uses high-abuse extension "${tld}"`);
            return;
        }
    }
    for (const tld of trustedDomains) {
        if (hostname.endsWith(tld)) {
            addFinding(-15, `Domain uses restricted extension "${tld}"`);
            return;
        }
    }
}
//3. URL Shape

function checkUrlShape() {
    
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
        addFinding(30, "Site is served from a raw IP address, not a domain name");
    }

    if (hostname.split(".").some(part => part.startsWith("xn--"))) {
        addFinding(25, "Domain uses punycode (possible look-alike characters)");
    }

    if (hostname.split(".").length >= 5) {
        addFinding(15, "Unusually deep subdomain chain");
    }
    if ((hostname.match(/-/g) || []).length >= 3) {
        addFinding(10, "Hostname contains many hyphens");
    }
}
//4. Sensitive Input

function checkSensitiveInputs(inputs) {
    
    if (inputs.card) {
        addFinding(10, "Page requests card details");
    }
    
    if ((inputs.card || inputs.password) && window.location.protocol === "http:") {
        addFinding(30, "Credentials/card requested over insecure HTTP");
    }

    for (const form of document.querySelectorAll("form[action]")) {
        try {
            const actionHost = new URL(form.action, window.location.href).hostname.toLowerCase();
            if (actionHost && actionHost !== hostname && !isOnDomain(actionHost, hostname)) {
                addFinding(25, `A form submits data to a different domain (${actionHost})`);
                break; // one finding is enough
            }
        } catch (exception) { /* malformed action attribute, ignore */ }
    }
}

//5. Pressure/verification language

function checkPhrases() {
    let hits = 0;
    for (const phrase of maliciousPhrases) {
        if (pageText.includes(phrase)) {
            hits++;
            if (hits <= 2) { // cap so a long page can't rack up 12 findings
                addFinding(15, `Suspicious language: "${phrase}"`);
            }
        }
    }
}
//END OF CHECKS

//OUTPUT

function clampScore() {
    riskScore = Math.max(0, Math.min(100, riskScore));
}

function warningBannerPopup(score) {
    if (score < 55) return;
    if (document.getElementById("ers-warning-banner")) return; // don't stack

    const banner = document.createElement("div");
    banner.id = "ers-warning-banner";
    banner.style.cssText = [
        "position:fixed", "top:0", "left:0", "right:0", "z-index:2147483647",
        "background:#b91c1c", "color:#ffffff",
        "font:600 15px/1.4 system-ui, sans-serif",
        "padding:12px 48px 12px 16px", "text-align:center",
        "box-shadow:0 2px 8px rgba(0,0,0,.35)"
    ].join(";");

    const text = document.createElement("span");
    text.textContent =
        `Risk Score: ${score}/100 — CAUTION, do not enter passwords or card details on this site.`;
    banner.appendChild(text);

    const close = document.createElement("button");
    close.textContent = "✕";
    close.setAttribute("aria-label", "Dismiss warning");
    close.style.cssText =
        "position:absolute;right:12px;top:8px;background:none;border:none;" +
        "color:#fff;font-size:18px;cursor:pointer";
    close.addEventListener("click", () => banner.remove());
    banner.appendChild(close);

    document.documentElement.appendChild(banner);
}

function main() {
    const inputs = pageWantsSensitiveData();
    console.log("Check 1 Done");

    checkBrandImpersonation(inputs);
    console.log("Check 2 Done");

    checkTld();
    console.log("Check 3 Done");

    checkUrlShape();
    console.log("Check 4 Done");

    checkSensitiveInputs(inputs);
    console.log("Check 5 Done");

    checkPhrases();
    console.log("Check 6 Done");

    clampScore();
    console.log("[Ecommerce Risk Score]", riskScore, findings);
    warningBannerPopup(riskScore);

}

main();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_RISK_REPORT") {
        sendResponse({ score: riskScore, findings, hostname});
    }
});