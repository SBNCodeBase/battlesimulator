const advantageMap = {
  Militia: ["Spearmen", "LightCavalry"],
  Spearmen: ["LightCavalry", "HeavyCavalry"],
  LightCavalry: ["FootArcher", "CavalryArcher"],
  HeavyCavalry: ["Militia", "FootArcher", "LightCavalry"],
  FootArcher: ["Spearmen", "HeavyCavalry"],
  CavalryArcher: ["Militia", "CavalryArcher"],
};

function parsePlatoons(input) {
  return input.split(";").map((platoon) => {
    const [unitClass, count] = platoon.split("#");
    return { unitClass, count: parseInt(count) };
  });
}

function computeEffectivePower(own, opponent) {
  let ownPower = own.count;
  let opponentPower = opponent.count;

  if (advantageMap[own.unitClass]?.includes(opponent.unitClass)) {
    ownPower *= 2;
  } else if (advantageMap[opponent.unitClass]?.includes(own.unitClass)) {
    opponentPower *= 2;
  }

  if (ownPower > opponentPower) return "win";
  if (ownPower === opponentPower) return "draw";
  return "loss";
}

function permute(arr) {
  if (arr.length === 0) return [[]];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const current = { ...arr[i] };
    const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
    rest.forEach((r) => result.push([current, ...r]));
  }
  return result;
}

function findWinningArrangement(ownStr, opponentStr) {
  const ownPlatoons = parsePlatoons(ownStr);
  const opponentPlatoons = parsePlatoons(opponentStr);

  const allPermutations = permute(ownPlatoons);
  let bestOutcome = { wins: 0, arrangement: null };

  for (const perm of allPermutations) {
    let wins = 0;
    for (let i = 0; i < 5; i++) {
      const result = computeEffectivePower(perm[i], opponentPlatoons[i]);
      if (result === "win") wins++;
    }
    if (wins >= 3) {
      return {
        message: "Winning Arrangement Found",
        arrangement: perm.map(p => `${p.unitClass}#${p.count}`).join(";"),
        wins
      };
    }
    if (wins > bestOutcome.wins) {
      bestOutcome = { wins, arrangement: perm };
    }
  }

  if (bestOutcome.wins === 0) {
    return { message: "Total Loss (0 wins)", arrangement: null };
  }

  return {
    message: "No winning arrangement possible (less than 3 wins)",
    arrangement: bestOutcome.arrangement.map(p => `${p.unitClass}#${p.count}`).join(";"),
    wins: bestOutcome.wins
  };
}

const own1 = "Spearmen#10;Militia#30;FootArcher#120;LightCavalry#1000;HeavyCavalry#120";
const opponent1 = "Militia#50;Spearmen#100;FootArcher#1000;LightCavalry#1200;CavalryArcher#1000";

const own2 = "Militia#10;Militia#10;Militia#10;Militia#10;Militia#10";
const opponent2 = "HeavyCavalry#100;HeavyCavalry#100;HeavyCavalry#100;HeavyCavalry#100;HeavyCavalry#100";

const own3 = "HeavyCavalry#100;LightCavalry#120;FootArcher#150;Militia#90;Spearmen#100";
const opponent3 = "Militia#50;Spearmen#80;FootArcher#140;LightCavalry#100;CavalryArcher#60";

const selectedOwn = own1;
const selectedOpponent = opponent1;

const result = findWinningArrangement(selectedOwn, selectedOpponent);

if (result.arrangement) {
  console.log(`${result.message}\nWins: ${result.wins}/5\nArrangement:\n${result.arrangement}`);
} else {
  console.log(`${result.message}`);
}
