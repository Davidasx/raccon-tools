// --- 数据定义 ---
const MOB_VALUES = {
    "Black Hole": -1,
    Ghost: -0.5,
    Slime: 0,
    Chest: 0,
    Kitten: 0.5,
    Angel: 0.5,
    Rooster: 1,
    Printer: 1,
    Fish: 1.2,
    Shopkeeper: 1.2,
    "Soldier Ant": 1.5,
    Mlime: 1.5,
    Jellyfish: 1.8,
    "Mojo Slime": 1.8,
    "Big Chest": 1.8,
    Runner: 2,
    Mushbug: 2,
    Leafbug: 2,
    "Shadow Slime": 2,
    Dove: 2,
    Bomber: 2.2,
    Shell: 2.2,
    Needle: 2.5,
    Crab: 2.5,
    Spider: 3,
    Ladybug: 3.2,
    Crystal: 3.5,
    Bee: 3.5,
    "Ethereal Slime": 3.8,
    "Shiny Slime": 4,
    "Demon Slime": 4,
    "Giant Chest": 4,
    "Unique Ladybug": 5,
    "Huge Spider": 5,
    "Inspo Shroom": 5.5,
};

const MOB_HEALTH = {
    "Black Hole": 800,
    Ghost: 2000,
    Slime: 1200,
    Chest: 1000,
    Kitten: 600,
    Angel: 1400,
    Rooster: 1000,
    Printer: 1000,
    Fish: 1200,
    Shopkeeper: 1100,
    "Soldier Ant": 2500,
    Jellyfish: 1200,
    "Mojo Slime": 900,
    "Big Chest": 1500,
    Runner: 1200,
    Mushbug: 900,
    Leafbug: 1300,
    Bomber: 1250,
    Shell: 1800,
    Needle: 1300,
    Crab: 1300,
    Spider: 1500,
    Ladybug: 900,
    Crystal: 2000,
    Bee: 800,
    "Ethereal Slime": 2000,
    "Shiny Slime": 2500,
    "Demon Slime": 3000,
    "Giant Chest": 2200,
    "Unique Ladybug": 3000,
    "Huge Spider": 3000,
    "Inspo Shroom": 1000,
    Mlime: 2500,
    "Vivid Kitten": 1200,
    "Vivid Bee": 1600,
    "Vivid Angel": 1900,
    "Vivid Fish": 2000,
};

const RARITIES = [
    { name: "Common", color: "#7EEF6D", id: 1, atk: 1, factor: 1 },
    {
        name: "Unusual",
        color: "#FFE65D",
        id: 2,
        atk: 2.1,
        factor: 1.2,
    },
    {
        name: "Rare",
        color: "#48ABE8",
        id: 3,
        atk: 3.3,
        factor: 1.3,
    },
    {
        name: "Epic",
        color: "#BE6CDE",
        id: 4,
        atk: 4.6,
        factor: 1.5,
    },
    {
        name: "Legendary",
        color: "#EE6A72",
        id: 5,
        atk: 6,
        factor: 1.7,
    },
    {
        name: "Mythic",
        color: "#43E3D8",
        id: 6,
        atk: 8,
        factor: 2.0,
    },
    {
        name: "Ultimate",
        color: "#F274A9",
        id: 7,
        atk: 12,
        factor: 3.0,
        hpMult: 1.3,
    },
    {
        name: "Supreme",
        color: "#FFAA55",
        id: 8,
        atk: 20,
        factor: 5.0,
        hpMult: 10.0,
    },
];

const PROB_MAP = {
    8: { 2: -144, 3.5: -138, 5: -132, 7.5: -126, 10: -120, 15: -112 },
    7: { 5: -68, 10: -60, 15: -56, 20: -40 },
    6: {
        5: -30,
        15: -23,
        30: -18,
        50: -10,
        80: 0,
        100: 2,
        120: 8,
    },
    5: {
        5: -20.6,
        15: -15.6,
        30: -11.2,
        50: -5.2,
        80: 0,
        100: 1.7,
        120: 6,
        200: 16,
    },
    4: {
        5: -17.5,
        15: -12.9,
        30: -9.1,
        50: -4.5,
        80: 0,
        100: 1.5,
        120: 4.6,
        200: 9.8,
    },
    3: {
        5: -13.8,
        15: -10.5,
        30: -7.2,
        50: -3.9,
        80: 0,
        100: 1.3,
        120: 3.3,
        200: 7.8,
    },
    2: {
        5: -10.5,
        15: -8.4,
        30: -5.5,
        50: -3.4,
        80: 0,
        100: 1.2,
        120: 2.1,
        200: 6,
    },
    1: { 30: -5, 50: -4, 80: 0, 100: 1, 120: 1, 200: 5 },
};

// --- 核心算法 ---

function getDEF(mob, rar) {
    const slot = rar.id > 2 ? Math.min(rar.id + 3, 10) : 5;
    let val = slot * rar.atk;
    const mv = MOB_VALUES[mob] || 0;
    val += mv > 0 ? mv * rar.factor : mv;
    return Math.floor(val * 10 + 0.9) / 10;
}

function getLootHits(mob, rar, atk) {
    if (rar.id < 7) return null;
    const baseHp = MOB_HEALTH[mob] || 0;
    const totalHp = baseHp * (rar.hpMult || 1);
    const threshold = totalHp * 0.05;
    return Math.ceil(threshold / atk);
}

// --- UI 更新函数 ---

// 选中的稀有度（单选，默认Ultimate即id=7）
let selectedRarity = 7;

function initRarityFilters() {
    const container = document.getElementById("rarityFilters");
    let html = "";

    RARITIES.forEach((rar) => {
        const isActive = rar.id === selectedRarity;
        html += `<button 
            class="rarity-filter-btn ${isActive ? "active" : ""}" 
            data-rarity-id="${rar.id}"
            style="background:${rar.color}"
            onclick="toggleRarity(${rar.id})"
        >${rar.name}</button>`;
    });

    container.innerHTML = html;
}

function toggleRarity(rarityId) {
    // 单选模式：取消之前选中的，选中新的
    if (selectedRarity === rarityId) return; // 如果点击已选中的，不做任何操作

    // 移除之前的active状态
    const prevBtn = document.querySelector(
        `[data-rarity-id="${selectedRarity}"]`,
    );
    if (prevBtn) prevBtn.classList.remove("active");

    // 设置新的选中状态
    selectedRarity = rarityId;
    const newBtn = document.querySelector(`[data-rarity-id="${rarityId}"]`);
    if (newBtn) newBtn.classList.add("active");

    runQuery();
}

function runQuery() {
    const atk = parseFloat(document.getElementById("atkInput").value) || 0;
    const searchTerm = (
        document.getElementById("mobSearch")?.value || ""
    ).toLowerCase();
    const container = document.getElementById("singleQueryResult");

    // 获取当前选中的稀有度
    const rar = RARITIES.find((r) => r.id === selectedRarity);
    if (!rar) {
        container.innerHTML = `<p class="empty-hint">请选择稀有度</p>`;
        return;
    }

    // 判断是否显示Loot相关列（仅Ultimate和Supreme）
    const showLootColumns = rar.id >= 7;

    // 根据稀有度决定表头
    let html = showLootColumns
        ? `<table><thead><tr><th>怪物</th><th>当前概率</th><th>下一档概率</th><th>下一档ATK</th><th>Loot刀数</th><th>更少刀ATK</th></tr></thead><tbody>`
        : `<table><thead><tr><th>怪物</th><th>当前概率</th><th>下一档概率</th><th>下一档ATK</th></tr></thead><tbody>`;

    let hasResults = false;

    Object.keys(MOB_VALUES).forEach((mob) => {
        // 检查怪物名称是否匹配搜索
        if (searchTerm && !mob.toLowerCase().includes(searchTerm)) return;

        const def = getDEF(mob, rar);
        let bestProb = 0;
        const probs = PROB_MAP[rar.id];

        // 找到当前概率
        Object.entries(probs).forEach(([p, cor]) => {
            if (atk >= def + cor) bestProb = Math.max(bestProb, parseFloat(p));
        });

        if (bestProb > 0) {
            hasResults = true;
            const hits = getLootHits(mob, rar, atk);
            const probText =
                bestProb >= 200
                    ? "Double"
                    : bestProb >= 120
                      ? "Crit"
                      : bestProb + "%";

            // 计算下一档概率和所需ATK
            let nextProb = null;
            let nextAtkNeeded = null;
            const sortedProbs = Object.entries(probs).sort(
                (a, b) => parseFloat(a[0]) - parseFloat(b[0]),
            );
            for (let [p, cor] of sortedProbs) {
                if (parseFloat(p) > bestProb) {
                    nextProb = parseFloat(p);
                    nextAtkNeeded = Math.ceil((def + cor) * 10) / 10;
                    break;
                }
            }

            const nextProbText = nextProb
                ? nextProb >= 200
                    ? "Double"
                    : nextProb >= 120
                      ? "Crit"
                      : nextProb + "%"
                : "-";
            const nextAtkText = nextAtkNeeded ? nextAtkNeeded.toFixed(1) : "-";

            if (showLootColumns) {
                // 计算更少刀数所需ATK（仅适用于Ultimate/Supreme）
                let fewerHitsAtk = "-";
                if (hits && hits > 1) {
                    const baseHp = MOB_HEALTH[mob] || 0;
                    const totalHp = baseHp * (rar.hpMult || 1);
                    const threshold = totalHp * 0.05;
                    const nextHits = hits - 1;
                    const requiredAtk =
                        Math.ceil((threshold / nextHits) * 10) / 10;
                    fewerHitsAtk = requiredAtk.toFixed(1);
                }

                html += `<tr>
                    <td><span class="mob-name" style="background:${rar.color}">${mob}</span></td>
                    <td>${probText}</td>
                    <td>${nextProbText}</td>
                    <td>${nextAtkText}</td>
                    <td>${hits ? hits + " 刀" : "-"}</td>
                    <td>${fewerHitsAtk}</td>
                </tr>`;
            } else {
                html += `<tr>
                    <td><span class="mob-name" style="background:${rar.color}">${mob}</span></td>
                    <td>${probText}</td>
                    <td>${nextProbText}</td>
                    <td>${nextAtkText}</td>
                </tr>`;
            }
        }
    });

    html += `</tbody></table>`;

    if (!hasResults) {
        html = `<p class="empty-hint">没有找到匹配的结果</p>`;
    }

    container.innerHTML = html;
}

function runRange() {
    const start = parseFloat(document.getElementById("rangeStart").value) || 0;
    const end = parseFloat(document.getElementById("rangeEnd").value) || 0;
    const container = document.getElementById("rangeResult");

    const low = Math.min(start, end);
    const high = Math.max(start, end);

    // 收集所有转折点
    let milestones = {};

    RARITIES.forEach((rar) => {
        Object.keys(MOB_VALUES).forEach((mob) => {
            const def = getDEF(mob, rar);

            // 1. 概率转折点
            Object.entries(PROB_MAP[rar.id]).forEach(([p, cor]) => {
                const threshold = Math.round((def + cor) * 10) / 10;
                if (threshold > low && threshold <= high) {
                    if (!milestones[threshold]) milestones[threshold] = [];
                    milestones[threshold].push(
                        `<span class="mob-name" style="background:${rar.color}">${mob}</span> ${p}%`,
                    );
                }
            });

            // 2. Loot 刀数转折点 (仅 Ultimate/Supreme)
            if (rar.id >= 7) {
                const baseHp = MOB_HEALTH[mob] || 0;
                const thresholdDmg = baseHp * rar.hpMult * 0.05;
                // 计算从 1 刀到 20 刀的临界点
                for (let h = 1; h <= 20; h++) {
                    const hitAtk = Math.ceil((thresholdDmg / h) * 10) / 10;
                    if (hitAtk > low && hitAtk <= high) {
                        if (!milestones[hitAtk]) milestones[hitAtk] = [];
                        milestones[hitAtk].push(
                            `<span class="mob-name" style="background:${rar.color}">${mob}</span> ${h} 刀 loot`,
                        );
                    }
                }
            }
        });
    });

    // 排序并显示
    const sortedAtks = Object.keys(milestones).sort((a, b) => a - b);
    if (sortedAtks.length === 0) {
        container.innerHTML = `<p class="empty-hint">在此区间内没有发现概率或刀数的变化点。</p>`;
        return;
    }

    let html = "";
    sortedAtks.forEach((atk) => {
        const items = [...new Set(milestones[atk])]; // 去重

        html += `<div class="milestone-item">
            <span class="atk-val">ATK ${parseFloat(atk).toFixed(1)}</span>: 
            <div>${items.join(" | ")}</div>
        </div>`;
    });
    container.innerHTML = html;
}

// 标签页切换
function switchTab(tabName) {
    // 隐藏所有标签内容
    document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.style.display = "none";
    });

    // 移除所有按钮的active类
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    // 显示对应的标签内容
    if (tabName === "probability") {
        document.getElementById("probabilityTab").style.display = "block";
        document.querySelectorAll(".tab-btn")[0].classList.add("active");
    } else if (tabName === "range") {
        document.getElementById("rangeTab").style.display = "block";
        document.querySelectorAll(".tab-btn")[1].classList.add("active");
    }
}

// 初始化运行
document.addEventListener("DOMContentLoaded", function () {
    initRarityFilters();
    runQuery();
    runRange();
});
