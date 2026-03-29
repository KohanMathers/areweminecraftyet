const SERVERS = [
    {
        name: "Minestom VRI",
        url: "https://github.com/Minestom/VanillaReimplementation/",
        sourceLabel: "GitHub",
        compliance: "experimental",
        language: "java",
        type: "reimplementation",
        mcVersion: "1.20.1",
        status: "wip",
        description: "A Minestom extension working toward full vanilla behavior reimplementation.",
        forkNote: null,
    },
    {
        name: "Minestom Vibenilla",
        url: "https://github.com/vibenilla/server",
        sourceLabel: "GitHub",
        compliance: "experimental",
        language: "java",
        type: "reimplementation",
        mcVersion: "1.21.11",
        status: "wip",
        description: "Another Minestom-based server aiming for vanilla compliance.",
        forkNote: null,
    },
    {
        name: "Pumpkin",
        url: "https://github.com/Pumpkin-MC/Pumpkin",
        sourceLabel: "GitHub",
        compliance: "partial",
        language: "rust",
        type: "reimplementation",
        mcVersion: "1.21.8",
        status: "wip",
        description: "A Minecraft server built entirely in Rust, offering a fast, efficient, and customizable experience. It prioritizes performance and player enjoyment while adhering to the core mechanics of the game.",
        forkNote: null,
    },
    {
        name: "Paper",
        url: "https://github.com/PaperMC/Paper",
        sourceLabel: "GitHub",
        compliance: "forked",
        language: "java",
        type: "fork",
        mcVersion: "1.21.x",
        status: "active",
        description: "A widely-used Spigot fork that intentionally diverges from vanilla behavior for performance and gameplay improvements.",
        forkNote: "This is a fork of vanilla Minecraft. Forks are listed for completeness but are unlikely candidates for full compliance.",
    },
    {
        name: "FerrumC",
        url: "https://github.com/ferrumc-rs/ferrumc",
        sourceLabel: "GitHub",
        compliance: "experimental",
        language: "rust",
        type: "reimplementation",
        mcVersion: "1.21.8",
        status: "wip",
        description: "A 1.21.8 Minecraft server implementation written from the ground up in Rust. Leveraging the power of the Rust programming language, it is completely multithreaded and offers high performance as well as amazing memory efficiency.",
        forkNote: null,
    },
    {
        name: "Obsidian",
        url: "https://github.com/ObsidianMC/Obsidian",
        sourceLabel: "GitHub",
        compliance: "partial",
        language: "csharp",
        type: "reimplementation",
        mcVersion: "1.21.8",
        status: "wip",
        description: "A C# .NET implementation of the Minecraft server protocol.",
        forkNote: null,
    },
    {
        name: "VectoraServer",
        url: "https://github.com/Hardrivetech/VectoraServer",
        sourceLabel: "GitHub",
        compliance: "experimental",
        language: "cpp",
        type: "reimplementation",
        mcVersion: "1.21.11",
        status: "wip",
        description: "A high-performance custom Minecraft Java Edition 1.21.11 server written in modern C++20.",
        forkNote: null,
    },
    {
        name: "Wrench",
        url: "https://github.com/KohanMathers/Wrench",
        sourceLabel: "GitHub",
        compliance: "forked",
        language: "java",
        type: "fork",
        mcVersion: "1.21.11",
        status: "wip",
        description: "A server focused on observability and control first, with compatibility planned as a later phase.",
        forkNote: "This is a fork of vanilla Minecraft. Forks are listed for completeness but are unlikely candidates for full compliance.",
    },
];

const LANG_LABELS = { java: "Java", rust: "Rust", go: "Go", cpp: "C++", csharp: "C#" };
const STATUS_LABELS = { active: "Active", wip: "WIP", abandoned: "Abandoned" };
const TYPE_LABELS = { reimplementation: "Reimplementation", fork: "Fork" };
const COMPLIANCE_LABELS = {
    full: "Full",
    mostly: "Mostly",
    partial: "Partial",
    experimental: "Experimental",
    forked: "Forked",
};
const COMPLIANCE_SCORES = {
    full: 100,
    mostly: 75,
    partial: 40,
    experimental: 15,
    forked: 0,
};

let activeLang = "all";
let activeType = "all";

function buildCards() {
    const grid = document.getElementById("servers-grid");
    const empty = document.getElementById("empty-state");
    grid.querySelectorAll(".card").forEach(c => c.remove());

    SERVERS.forEach(s => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.lang = s.language;
        card.dataset.type = s.type;

        const forkNoteHTML = s.forkNote
            ? `<div class="card-fork-note">&#9888; ${s.forkNote}</div>`
            : "";
        const complianceLabel = COMPLIANCE_LABELS[s.compliance] ?? "Unknown";
        const complianceScore = COMPLIANCE_SCORES[s.compliance] ?? 0;

        card.innerHTML = `
            <div class="card-top ${s.compliance === "full" ? "compliant" : ""}"></div>
            <div class="card-body">
                <div class="card-name">${s.name}</div>
                <div class="card-meta">
                    <span class="badge badge-lang-${s.language}">${LANG_LABELS[s.language] ?? s.language}</span>
                    <span class="badge badge-type-${s.type === "reimplementation" ? "reimpl" : "fork"}">${TYPE_LABELS[s.type]}</span>
                    <span class="badge badge-version">MC ${s.mcVersion}</span>
                    <span class="badge badge-status-${s.status}">${STATUS_LABELS[s.status]}</span>
                    <span class="badge badge-compliance badge-compliance-${s.compliance}">Compliance: ${complianceLabel}</span>
                </div>
                <p class="card-desc">${s.description}</p>
                <div class="compliance-meter" aria-hidden="true">
                    <span class="compliance-fill compliance-${s.compliance}" style="width: ${complianceScore}%;"></span>
                </div>
                ${forkNoteHTML}
            </div>
            <div class="card-footer">
                <span class="card-compliant ${s.compliance === "full" ? "yes" : "no"}">${s.compliance === "full" ? "Compliant" : "Not Compliant"}</span>
                <a class="card-source" href="${s.url}" target="_blank" rel="noopener">${s.sourceLabel} &rarr;</a>
            </div>
        `;

        grid.insertBefore(card, empty);
    });

    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll(".card");
    let visible = 0;

    cards.forEach(card => {
        const langMatch = activeLang === "all" || card.dataset.lang === activeLang;
        const typeMatch = activeType === "all" || card.dataset.type === activeType;
        const show = langMatch && typeMatch;
        card.classList.toggle("hidden", !show);
        if (show) visible++;
    });

    document.getElementById("empty-state").style.display = visible === 0 ? "block" : "none";
}

function updateVerdict() {
    const total = SERVERS.length;
    const yes = SERVERS.filter(s => s.compliance === "full").length;
    document.getElementById("count-yes").textContent = yes;
    document.getElementById("count-total").textContent = total;

    if (yes >= 1) {
        document.getElementById("verdict-text").textContent = "YES!";
        document.getElementById("verdict-text").classList.add("yes");
    }
}

document.querySelectorAll("[data-filter-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-lang]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLang = btn.dataset.filterLang;
        applyFilters();
    });
});

document.querySelectorAll("[data-filter-type]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-filter-type]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeType = btn.dataset.filterType;
        applyFilters();
    });
});

buildCards();
updateVerdict();


