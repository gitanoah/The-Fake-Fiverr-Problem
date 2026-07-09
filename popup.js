async function loadReport() {

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const report = await chrome.tabs.sendMessage(tab.id, { type: "GET_RISK_REPORT" });
        render(report);
    } catch (e) {
        render(null);
    }
}

function render(report) {
    const scoreEl   = document.getElementById("score");
    const verdictEl = document.getElementById("verdict");
    const hostEl    = document.getElementById("host");
    const needleEl  = document.getElementById("needle");
    const listEl    = document.getElementById("findings");
    const emptyEl   = document.getElementById("empty");

    if (!report) {
        verdictEl.textContent = "Can't scan this page";
        verdictEl.style.color = "var(--muted)";
        emptyEl.hidden = false;
        emptyEl.textContent = "This page type doesn't allow scanning.";
        return;
    }

    const { score, findings, hostname } = report;

    hostEl.textContent = hostname;
    hostEl.title = hostname;

    scoreEl.textContent = score;
    const small = document.createElement("small");
    small.textContent = "/100";
    scoreEl.appendChild(small);

    needleEl.style.left = score + "%";

    if (score >= 55) {
        verdictEl.textContent = "High risk — likely phishing";
        verdictEl.style.color = "var(--danger)";
    } else if (score >= 30) {
        verdictEl.textContent = "Caution — some risk signals";
        verdictEl.style.color = "var(--warn)";
    } else {
        verdictEl.textContent = "No strong phishing signals";
        verdictEl.style.color = "var(--safe)";
    }

    if (findings.length === 0) {
        emptyEl.hidden = false;
        return;
    }

    for (const f of findings) {
        const li = document.createElement("li");

        const pts = document.createElement("span");
        pts.className = "pts" + (f.points < 0 ? " credit" : "");
        pts.textContent = (f.points > 0 ? "+" : "") + f.points;

        const msg = document.createElement("span");
        msg.textContent = f.message;

        li.appendChild(pts);
        li.appendChild(msg);
        listEl.appendChild(li);
    }
}
loadReport();