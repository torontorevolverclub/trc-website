// =====================================================================
// TRC phone experience: tab bar, swipe rows, "show more", today-first
// range hours and the safety page section picker.
// Desktop layout is unchanged; everything here is styled in mobile.css.
// =====================================================================
(function () {
    const phone = window.matchMedia('(max-width: 767px), (max-height: 500px) and (orientation: landscape) and (max-width: 1023px)');
    const isSafety = !!document.getElementById('toc');
    const onHome = !!document.getElementById('range');
    const isPortal = !!document.getElementById('dashboardView');

    // ---------- Bottom tab bar ----------
    const tabs = [
        { id: 'home',   icon: 'fa-house',        label: 'Home',   href: onHome ? '#' : 'index.html', top: onHome },
        { id: 'hours',  icon: 'fa-clock',        label: 'Hours',  href: 'range.html#hours' },
        { id: 'safety', icon: 'fa-shield-halved', label: 'Safety', href: 'safety.html' },
        { id: 'events', icon: 'fa-calendar-days', label: 'Events', href: 'index.html#calendar' },
        { id: 'portal', icon: 'fa-lock',         label: 'Portal', href: 'members.html' }
    ];
    const active = isSafety ? 'safety' : isPortal ? 'portal' : 'home';
    const bar = document.createElement('nav');
    bar.id = 'mTabBar';
    bar.setAttribute('aria-label', 'Quick navigation');
    bar.innerHTML = tabs.map(t =>
        `<a href="${t.href}" data-tab="${t.id}" class="${t.id === active ? 'on' : ''}"><i class="fa-solid ${t.icon}"></i>${t.label}</a>`).join('');
    document.body.appendChild(bar);
    bar.querySelector('[data-tab="home"]').addEventListener('click', (e) => {
        if (onHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    bar.querySelector('[data-tab="events"]').addEventListener('click', (e) => {
        if (onHome && typeof window.openCalendar === 'function') { e.preventDefault(); window.openCalendar(); }
    });

    // ---------- Home: Safety tab is active while the Safety Essentials card is on screen ----------
    const safetyCard = document.getElementById('range-safety');
    if (onHome && safetyCard && 'IntersectionObserver' in window) {
        const homeTab = bar.querySelector('[data-tab="home"]'), safetyTab = bar.querySelector('[data-tab="safety"]');
        new IntersectionObserver(([en]) => {
            safetyTab.classList.toggle('on', en.isIntersecting);
            homeTab.classList.toggle('on', !en.isIntersecting);
        }, { rootMargin: '-40% 0px -40% 0px' }).observe(safetyCard);
    }

    // ---------- Swipe rows with dots ----------
    document.querySelectorAll('.m-swipe').forEach(row => {
        const cards = [...row.children].filter(el => !el.classList.contains('hidden'));
        if (cards.length < 2) return;
        const dots = document.createElement('div');
        dots.className = 'm-dots' + (row.dataset.dots === 'dark' ? ' on-dark' : '');
        dots.setAttribute('aria-hidden', 'true');
        dots.innerHTML = cards.map((_, i) => `<span class="${i === 0 ? 'on' : ''}"></span>`).join('');
        row.after(dots);
        row.addEventListener('scroll', () => {
            const w = cards[0].getBoundingClientRect().width + 12;
            const i = Math.min(cards.length - 1, Math.round(row.scrollLeft / w));
            [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
        }, { passive: true });
    });

    // ---------- "Show more" sections ----------
    const mores = [...document.querySelectorAll('.m-more')].map(el => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'm-more-btn';
        btn.innerHTML = 'Show more <i class="fa-solid fa-chevron-down"></i>';
        el.after(btn);
        btn.addEventListener('click', () => {
            const open = el.classList.toggle('m-clamped') === false;
            btn.innerHTML = open ? 'Show less <i class="fa-solid fa-chevron-up"></i>' : 'Show more <i class="fa-solid fa-chevron-down"></i>';
            if (!open) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return { el, btn };
    });
    function applyMore() {
        mores.forEach(({ el, btn }) => {
            el.classList.remove('m-clamped');
            const limit = parseInt(getComputedStyle(el).getPropertyValue('--m-h')) || 420;
            const needs = phone.matches && el.scrollHeight > limit + 120;
            if (needs) el.classList.add('m-clamped');
            btn.style.display = needs ? '' : 'none';
            btn.innerHTML = 'Show more <i class="fa-solid fa-chevron-down"></i>';
        });
    }

    // ---------- Range hours: today first ----------
    const chart = document.getElementById('hoursChart');
    if (chart) {
        const todayIdx = (new Date().getDay() + 6) % 7; // Mon = 0
        [...chart.children].forEach((row, i) => { if (i !== todayIdx) row.classList.add('m-not-today'); });
        chart.classList.add('m-week-collapsed');
        const wbtn = document.createElement('button');
        wbtn.type = 'button';
        wbtn.className = 'm-week-btn';
        wbtn.innerHTML = 'Show full week <i class="fa-solid fa-chevron-down"></i>';
        chart.after(wbtn);
        wbtn.addEventListener('click', () => {
            const collapsed = chart.classList.toggle('m-week-collapsed');
            wbtn.innerHTML = collapsed ? 'Show full week <i class="fa-solid fa-chevron-down"></i>' : 'Show today only <i class="fa-solid fa-chevron-up"></i>';
        });
    }

    // ---------- Safety page: sticky section picker ----------
    if (isSafety) {
        const header = document.querySelector('header');
        const picker = document.createElement('div');
        picker.id = 'mPicker';
        const nav = document.querySelector('#toc nav');
        let list = '';
        nav.querySelectorAll(':scope > div, :scope > ol li a.toc-link, :scope > a[href="#quiz"]').forEach(el => {
            if (el.tagName === 'DIV' && /Part \d/.test(el.textContent)) {
                list += `<div class="m-pick-part">${el.textContent.trim()}</div>`;
            } else if (el.tagName === 'A') {
                const num = (el.querySelector('.toc-num, .font-mono') || {}).textContent || '';
                const label = el.textContent.replace(num, '').trim();
                list += `<a href="${el.getAttribute('href')}"><span>${num.trim()}</span>${label}</a>`;
            }
        });
        picker.innerHTML = `<button type="button" class="m-pick-btn" aria-expanded="false"><b><i class="fa-solid fa-list-ul" style="margin-right:6px"></i><span id="mPickLabel">TRC Safety Rules</span></b><span><span id="mPickCount">0</span>/10 read <i class="fa-solid fa-chevron-down" id="mPickChev"></i></span></button><div class="m-pick-list">${list}</div>`;
        header.after(picker);
        const btn = picker.querySelector('.m-pick-btn');
        const setOpen = (o) => {
            picker.classList.toggle('open', o);
            btn.setAttribute('aria-expanded', o);
            document.getElementById('mPickChev').className = 'fa-solid ' + (o ? 'fa-chevron-up' : 'fa-chevron-down');
        };
        btn.addEventListener('click', () => setOpen(!picker.classList.contains('open')));
        picker.querySelectorAll('.m-pick-list a').forEach(a => a.addEventListener('click', () => setOpen(false)));
        document.addEventListener('click', (e) => { if (!picker.contains(e.target)) setOpen(false); });

        const links = [...picker.querySelectorAll('.m-pick-list a')].filter(a => a.getAttribute('href') !== '#quiz' || true);
        const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
        const sync = () => {
            let current = targets[0];
            targets.forEach(t => { if (t.getBoundingClientRect().top <= 170) current = t; });
            const link = links.find(a => a.getAttribute('href') === '#' + current.id);
            if (link) {
                const num = link.querySelector('span').textContent.trim();
                const label = link.textContent.replace(num, '').trim();
                document.getElementById('mPickLabel').textContent = (num ? num + ' · ' : '') + label;
                links.forEach(a => a.classList.toggle('on', a === link));
            }
            const c = document.getElementById('tocCount');
            if (c) document.getElementById('mPickCount').textContent = c.textContent;
        };
        let ticking = false;
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { sync(); ticking = false; }); } }, { passive: true });
        window.addEventListener('scrollend', sync);
        sync();
    }


    // ---------- Safety Essentials: one layer at a time ----------
    document.querySelectorAll('.m-layers').forEach(grid => {
        const cols = [...grid.children];
        const names = cols.map(c => (c.querySelector('h4') || {}).textContent || '').map(t => t.trim().split(' ')[0]);
        const seg = document.createElement('div');
        seg.className = 'm-seg';
        seg.innerHTML = names.map((n, i) => `<button type="button" class="${i === 0 ? 'on' : ''}">${n}</button>`).join('');
        grid.before(seg);
        const pick = (i) => { cols.forEach((c, k) => c.classList.toggle('m-on', k === i)); [...seg.children].forEach((b, k) => b.classList.toggle('on', k === i)); };
        [...seg.children].forEach((b, i) => b.addEventListener('click', () => pick(i)));
        pick(0);
    });

    // ---------- Safety Essentials: click anywhere on a layer box (all screen sizes) ----------
    document.querySelectorAll('.m-layers > div').forEach(box => {
        const link = box.querySelector('a[href]');
        if (!link) return;
        box.style.cursor = 'pointer';
        box.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            link.click();
        });
    });

    // ---------- Range diagram on tap ----------
    document.querySelectorAll('.m-diagram').forEach(box => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'm-toggle-btn';
        btn.innerHTML = '<i class="fa-solid fa-map"></i> View range layout <i class="fa-solid fa-chevron-down"></i>';
        box.prepend(btn);
        btn.addEventListener('click', () => {
            const open = box.classList.toggle('m-open');
            btn.innerHTML = open ? '<i class="fa-solid fa-map"></i> Hide range layout <i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-map"></i> View range layout <i class="fa-solid fa-chevron-down"></i>';
        });
    });

    // ---------- Heritage: read more + crest captions ----------
    document.querySelectorAll('.m-people > div').forEach(card => {
        const body = card.querySelector('p.text-muted');
        if (!body) return;
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'm-read-more';
        btn.innerHTML = 'Read more <i class="fa-solid fa-chevron-down"></i>';
        body.after(btn);
        btn.addEventListener('click', () => {
            const open = card.classList.toggle('m-open');
            btn.innerHTML = open ? 'Show less <i class="fa-solid fa-chevron-up"></i>' : 'Read more <i class="fa-solid fa-chevron-down"></i>';
        });
    });
    document.querySelectorAll('.m-crests').forEach(ol => {
        const items = [...ol.children];
        const cap = document.createElement('div');
        cap.className = 'm-crest-cap';
        ol.after(cap);
        const sel = (li) => {
            items.forEach(x => x.classList.toggle('m-sel', x === li));
            cap.innerHTML = `<b>${(li.querySelector('h4') || {}).textContent || ''}</b><span>${(li.querySelector('p') || {}).textContent || ''}</span>`;
        };
        items.forEach(li => li.addEventListener('click', () => sel(li)));
        sel(items[items.length - 1]);
    });

    // ---------- Member portal: tap a notice to read it ----------
    document.querySelectorAll('#dashboardView article').forEach(a => a.addEventListener('click', () => a.classList.toggle('m-open')));

    // ---------- Safety page: accordions ----------
    if (isSafety) {
        const accs = [...document.querySelectorAll('main > section[id]')].filter(sec => !['never', 'quiz'].includes(sec.id) && sec.querySelector(':scope > h2'));
        accs.forEach(sec => {
            sec.classList.add('m-acc');
            const h2 = sec.querySelector(':scope > h2');
            const link = document.querySelector(`#toc .toc-link[href="#${sec.id}"] .toc-num`);
            if (link) h2.insertAdjacentHTML('afterbegin', `<span class="m-acc-num">${link.textContent.trim()}</span>`);
            h2.setAttribute('role', 'button');
            h2.addEventListener('click', () => sec.classList.toggle('m-acc-open'));
        });
        const openFromHash = () => {
            let t = location.hash && document.querySelector(location.hash);
            // A part heading (from the homepage card) opens the first topic in that part
            if (t && t.classList.contains('m-part')) {
                let n = t.nextElementSibling;
                while (n && !n.classList.contains('m-acc')) n = n.nextElementSibling;
                if (n) { n.classList.add('m-acc-open'); setTimeout(() => t.scrollIntoView({ block: 'start' }), 30); }
                return;
            }
            const sec = t && (t.classList.contains('m-acc') ? t : t.closest('.m-acc'));
            if (sec) { sec.classList.add('m-acc-open'); setTimeout(() => sec.scrollIntoView({ block: 'start' }), 30); }
        };
        window.addEventListener('hashchange', openFromHash);
        openFromHash();
    }

    applyMore();
    if (phone.addEventListener) phone.addEventListener('change', applyMore);
    window.addEventListener('load', applyMore);

    // ---------- Club Experience cards: click anywhere on a card (all screen sizes) ----------
    document.querySelectorAll('.m-list-exp > .trc-card').forEach(card => {
        const action = card.querySelector(':scope > div:last-child a, :scope > div:last-child button');
        if (!action) return;
        card.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            action.click();
        });
    });
})();
