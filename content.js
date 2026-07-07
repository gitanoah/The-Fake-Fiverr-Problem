let riskScore = 0;
let findings = [];

const hostname = window.location.hostname.toLowerCase();

const pageText = document.body.innerText.toLowerCase();
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
function isOnDomain(hostname, domain){
    return host === domain || host.endsWith("." + domain);
}

function pageWantsSensitiveData(){
    
}
//

function calculateRiskScore(){
    //example from chat
    for(const brandName in brands){
        if(pageText.includes(brandName) && !hostname.includes(brands[brandName].domain))
        {
            riskScore += 0;
            console.log("+40 to risk score", brandName);
        }
    }
//TODO

//Previous stuff
    if (!hostname.endsWith(".com")) {
         addFinding(15, "Common Domain Name Ending");
    }
    if (!hostname.endsWith(".com")) {
         addFinding(35, "Common Malicious Domain Name Ending");
    }
    if (pageText.includes("verify account")) {
        addFinding(25, "Unwarranted Verification");
    }
    if (pageText.includes("credit card")) {
        addFinding(15, "Card Informaiton Request");
    }

}

function displayRiskScore(rscore){
    console.log("Risk Score = ", rscore)
    //TODO
}

function warningBannerPopup(rscore){
    if (rscore >= 55){
        console.log("WARNING!");
        console.log("Risk Score = ", rscore)
        //TODO
    }
    else{
        return;
    }
}

function main() {
    calculateRiskScore();
    displayRiskScore(riskScore);
    warningBannerPopup(riskScore);
}

main();