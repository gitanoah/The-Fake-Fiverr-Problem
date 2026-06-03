let riskScore = 0;

const hostname = window.location.hostname;

const pageText = document.body.innerText.toLowerCase();

// find way to check for capitalization incase phishing site uses mixed caps to mask domain name (e.g. fIvErR.com)

const brands = [
    "fiverr",
    "etsy",
    "facebook",
    "amazon",
    "paypal",
];

const maliciousDomains = [
    ".top", ".xyz", ".xin", 
    ".shop", ".cfd", ".lol", ".cf", ".ml", 
    ".ga", ".work", ".gq", ".fit", ".tk"
];

const trustedBrands = {
    "fiverr": "fiverr.com",
    "etsy": "etsy.com",
    "facebook": "facebook.com",
    "amazon": "amazon.com",
    "paypal": "paypal.com"
};

const trustedDomains = [
    ".edu", ".gov", ".mil"
];


function main() {
    calculateRiskScore();
    displayRiskScore(riskScore);
    warningBannerPopup(riskScore);
}

function calculateRiskScore(){
    if (!hostname.endsWith(".com")) {
        riskScore += 15;
    }
    if (pageText.includes("verify account")) {
        riskScore += 25;
    }
    if (pageText.includes("credit card")) {
        riskScore += 10;
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

main();