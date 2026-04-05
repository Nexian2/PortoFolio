/* ===========================
   TSAR PORTFOLIO — main.js
=========================== */

// ───────────────────────────
// Custom Cursor
// ───────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

(function animateTrail() {
    trailX += (mouseX - trailX) * 0.14;
    trailY += (mouseY - trailY) * 0.14;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
})();

document.querySelectorAll('a, button, .cert-card, .skill-tag, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform       = 'translate(-50%, -50%) scale(2)';
        cursorTrail.style.opacity    = '0.8';
        cursorTrail.style.width      = '40px';
        cursorTrail.style.height     = '40px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform       = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.opacity    = '0.5';
        cursorTrail.style.width      = '28px';
        cursorTrail.style.height     = '28px';
    });
});

// ───────────────────────────
// Navbar scroll
// ───────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ───────────────────────────
// Reveal on scroll
// ───────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ───────────────────────────
// Active nav highlight
// ───────────────────────────
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ───────────────────────────
// Smooth anchor scroll
// ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ───────────────────────────
// Terminal animation
// ───────────────────────────
const terminalLines = [
    {
        cmd: 'cat profile.json',
        output: [
            '<span class="t-key">name</span>:   <span class="t-val">"Tsar"</span>',
            '<span class="t-key">role</span>:   <span class="t-val">"Junior Security Researcher"</span>',
            '<span class="t-key">focus</span>:  <span class="t-val">"Web Penetration Testing"</span>',
            '<span class="t-key">ctf</span>:    <span class="t-val">true</span>',
            '<span class="t-key">osint</span>:  <span class="t-val">true</span>',
            '<span class="t-key">blue</span>:   <span class="t-val">true</span>',
        ]
    },
    {
        cmd: 'ls ./certs/',
        output: [
            '<span class="t-val">CJWPT_ECR-02040.pdf</span>',
            '<span class="t-val">WebPentest_CyberAcademy.pdf</span>',
            '<span class="t-val">BIGotTalent_1stPlace.pdf</span>',
        ]
    },
    {
        cmd: 'nmap -sV --open target',
        output: [
            '<span class="t-key">PORT     STATE  SERVICE</span>',
            '<span class="t-val">80/tcp</span>   open   <span class="t-val">http</span>',
            '<span class="t-val">443/tcp</span>  open   <span class="t-val">https</span>',
            '<span class="t-val">8080/tcp</span> open   <span class="t-val">http-proxy</span>',
            '<span class="t-key">scan done</span> -- 1 host up',
        ]
    }
];

let termLineIndex = 0;

function runTerminalSequence() {
    const line = terminalLines[termLineIndex % terminalLines.length];
    typeCommand(line.cmd, line.output, () => {
        setTimeout(() => {
            clearTerminal();
            termLineIndex++;
            runTerminalSequence();
        }, 3400);
    });
}

function typeCommand(cmd, outputLines, onDone) {
    const cmdEl    = document.getElementById('termCmd');
    const outputEl = document.getElementById('termOutput');
    const cursorEl = document.querySelector('.t-cursor');

    if (!cmdEl || !outputEl) return;

    cmdEl.textContent  = '';
    outputEl.innerHTML = '';

    let i = 0;

    const typing = setInterval(() => {
        cmdEl.textContent += cmd[i];
        i++;
        if (i >= cmd.length) {
            clearInterval(typing);
            setTimeout(() => {
                if (cursorEl) cursorEl.style.display = 'none';
                outputLines.forEach((line, idx) => {
                    setTimeout(() => {
                        const div = document.createElement('div');
                        div.innerHTML = line;
                        div.style.cssText = 'opacity:0; transform:translateX(-8px); transition:opacity .22s, transform .22s';
                        outputEl.appendChild(div);
                        requestAnimationFrame(() => {
                            div.style.opacity   = '1';
                            div.style.transform = 'translateX(0)';
                        });
                        if (idx === outputLines.length - 1 && onDone) setTimeout(onDone, 600);
                    }, idx * 130);
                });
            }, 200);
        }
    }, 52);
}

function clearTerminal() {
    const cmdEl    = document.getElementById('termCmd');
    const outputEl = document.getElementById('termOutput');
    const cursorEl = document.querySelector('.t-cursor');
    if (cmdEl)    cmdEl.textContent  = '';
    if (outputEl) outputEl.innerHTML = '';
    if (cursorEl) cursorEl.style.display = 'inline';
}

let termStarted = false;
const aboutSection = document.getElementById('about');

if (aboutSection) {
    new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !termStarted) {
                termStarted = true;
                setTimeout(runTerminalSequence, 800);
            }
        });
    }, { threshold: 0.3 }).observe(aboutSection);
}

// ───────────────────────────
// Skill tag level bar
// ───────────────────────────
document.querySelectorAll('.skill-tag').forEach(tag => {
    const level = tag.getAttribute('data-level');
    if (!level) return;

    tag.addEventListener('mouseenter', () => {
        let bar = tag.querySelector('.skill-bar');
        if (!bar) {
            bar = document.createElement('span');
            bar.className = 'skill-bar';
            bar.style.cssText = `
                position:absolute; bottom:0; left:0; height:2px;
                background:var(--red-2); width:0;
                transition:width .5s cubic-bezier(.4,0,.2,1);
            `;
            tag.style.position = 'relative';
            tag.appendChild(bar);
        }
        requestAnimationFrame(() => { bar.style.width = level + '%'; });
    });

    tag.addEventListener('mouseleave', () => {
        const bar = tag.querySelector('.skill-bar');
        if (bar) bar.style.width = '0';
    });
});

// ───────────────────────────
// Unified Modal
// ───────────────────────────
const modalOverlay      = document.getElementById('modalOverlay');
const modalBackdrop     = document.getElementById('modalBackdrop');
const modalClose        = document.getElementById('modalClose');
const modalImg          = document.getElementById('modalImg');
const modalPlaceholder  = document.getElementById('modalPlaceholder');
const modalPlaceholderText = document.getElementById('modalPlaceholderText');
const modalTitle        = document.getElementById('modalTitle');
const modalIssuer       = document.getElementById('modalIssuer');
const modalDate         = document.getElementById('modalDate');

function openModal({ img, title, issuer, date, placeholder }) {
    // Reset state
    modalImg.style.display        = 'block';
    modalPlaceholder.style.display = 'none';

    modalImg.src         = img || '';
    modalTitle.textContent  = title   || '--';
    modalIssuer.textContent = issuer  || '--';
    modalDate.textContent   = date    || '--';
    modalPlaceholderText.textContent = placeholder || 'IMAGE';

    modalImg.onerror = () => {
        modalImg.style.display        = 'none';
        modalPlaceholder.style.display = 'flex';
    };

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    // Bersihkan src supaya tidak loading ulang di background
    setTimeout(() => { modalImg.src = ''; }, 350);
}

// Cert cards — ambil data dari data-* attribute
document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
        openModal({
            img:     card.dataset.img,
            title:   card.dataset.title   || '// CERTIFICATE',
            issuer:  card.dataset.issuer  || '--',
            date:    card.dataset.date    || '--',
            placeholder: 'CERTIFICATE IMAGE',
        });
    });
});

// Project cards — ambil data dari data-* attribute
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        openModal({
            img:     card.dataset.img,
            title:   '// ' + (card.dataset.title || 'PROJECT').toUpperCase().replace(/\s/g, '_'),
            issuer:  card.dataset.desc || '--',
            date:    card.querySelector('.project-stack') ? 
                     Array.from(card.querySelectorAll('.project-stack span')).map(s => s.textContent).join(' · ') : '--',
            placeholder: 'PROJECT SCREENSHOT',
        });
    });
});

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});