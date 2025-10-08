// frontend/app.js

// Bloquer clic droit / F12 côté client (UX only, pas sécurité)
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.key === "F12") e.preventDefault();
});

const boutons = document.querySelectorAll('.enigme button');
const cellules = [
  document.getElementById('cell1'),
  document.getElementById('cell2'),
  document.getElementById('cell3'),
  document.getElementById('cell4')
];

async function checkAnswer(index, answer) {
  try {
    const resp = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, answer })
    });
    if (!resp.ok) return { ok: false };
    return await resp.json(); // { ok: true/false }
  } catch (e) {
    console.error(e);
    return { ok: false };
  }
}

async function refreshStatus() {
  try {
    const resp = await fetch('/api/status');
    if (!resp.ok) return;
    const data = await resp.json(); // { revealed: [true,false,...] }
    data.revealed.forEach((r, i) => {
      if (r) cellules[i].classList.add('devoilee');
    });
    if (data.revealed.every(Boolean)) {
      document.getElementById('flag-zone').style.display = 'block';
    }
  } catch (e) {
    console.error('status error', e);
  }
}

boutons.forEach((btn, index) => {
  btn.addEventListener('click', async () => {
    const input = btn.previousElementSibling;
    const rep = input.value.trim().toLowerCase();
    btn.disabled = true;
    btn.textContent = "⌛ Vérification...";
    try {
      const result = await checkAnswer(index, rep);
      if (result.ok) {
        cellules[index].classList.add('devoilee');
        input.disabled = true;
        btn.textContent = "✅ Bravo!";
        btn.style.background = "#66b6ff";
        const allRevealed = Array.from(cellules).every(c => c.classList.contains('devoilee'));
        if (allRevealed) {
          setTimeout(() => {
            alert("Bravo ! L'image est complète. Entrez maintenant le flag pour valider 🎯");
            document.getElementById('flag-zone').style.display = 'block';
          }, 700);
        }
      } else {
        btn.textContent = "❌ Réessaie";
        btn.style.background = "#999";
        setTimeout(() => {
          btn.textContent = "Valider";
          btn.style.background = "#b00020";
          btn.disabled = false;
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      btn.textContent = "Erreur";
      setTimeout(() => {
        btn.textContent = "Valider";
        btn.style.background = "#b00020";
        btn.disabled = false;
      }, 1500);
    }
  });
});

refreshStatus();

document.getElementById('flagBtn').addEventListener('click', async () => {
  const val = document.getElementById('flagInput').value.trim();
  const res = document.getElementById('flagResult');
  try {
    const resp = await fetch('/api/flag', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ flag: val })
    });
    const j = await resp.json();
    if (j.ok) {
      res.textContent = "🎉 Correct ! Félicitations, tu as trouvé le flag !";
      res.className = "ok";
    } else {
      res.textContent = "❌ Mauvais flag, vérifie ton orthographe !";
      res.className = "ko";
    }
  } catch (e) {
    console.error(e);
    res.textContent = "❌ Erreur serveur.";
    res.className = "ko";
  }
});
