/* Shared site script: calendar + contact pop-ups (moved from the old homepage), hours chart, mobile menu */
document.body.insertAdjacentHTML('beforeend', "<div id=\"toast\" class=\"fixed bottom-24 right-6 z-50 hidden transform transition-all duration-300 translate-y-4 opacity-0\">\n        <div class=\"bg-royal border-2 border-gold text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center space-x-3\">\n            <i class=\"fa-solid fa-circle-check text-gold-bright\"></i>\n            <span id=\"toastMsg\" class=\"font-mono text-xs font-semibold uppercase tracking-wider\">Copied to clipboard</span>\n        </div>\n    </div>\n\n    <!-- ===================================================================== -->\n    <!-- INTERACTIVE MODAL 1: CALENDARS & EVENTS MODAL                         -->\n    <!-- ===================================================================== -->\n    <div id=\"calendarModal\" class=\"fixed inset-0 z-50 hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4\">\n        <div class=\"bg-white border-2 border-royal rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[94vh]\">\n            <div class=\"px-5 sm:px-6 py-5 bg-royal text-white border-b-2 border-gold flex items-center justify-between shrink-0\">\n                <div>\n                    <span class=\"font-mono text-[10px] uppercase tracking-[0.2em] text-gold-bright hidden sm:block\">TRC SCHEDULES &amp; COMPETITIONS</span>\n                    <h3 class=\"font-display font-bold text-2xl text-white uppercase tracking-wide\"><span class=\"sm:hidden\">Calendar</span><span class=\"hidden sm:inline\">Calendars &amp; Club Events</span></h3>\n                </div>\n                <div class=\"flex items-center gap-2 sm:gap-3\"><button type=\"button\" onclick=\"calToggleSubscribe()\" aria-label=\"Add to my calendar\" class=\"h-9 px-3 rounded-lg bg-gold hover:bg-gold-bright text-royal-deep font-display text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 transition\"><i class=\"fa-solid fa-calendar-plus\"></i><span class=\"hidden sm:inline\">Add to my calendar</span></button>\n                <button onclick=\"closeModal('calendarModal')\" aria-label=\"Close calendar\" class=\"w-9 h-9 rounded-lg bg-white/10 hover:bg-gold hover:text-royal text-white flex items-center justify-center transition\">\n                    <i class=\"fa-solid fa-xmark\"></i>\n                </button></div>\n            </div>\n\n            <div id=\"calSubscribe\" class=\"hidden px-5 sm:px-6 py-4 border-b border-gold/40 bg-gold-pale shrink-0\"></div>\n\n            <!-- Toolbar: filters + view toggle -->\n            <div class=\"px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-50 border-b border-slate-200 flex flex-nowrap sm:flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0\">\n                <select id=\"calFilterSel\" aria-label=\"Show events\" class=\"sm:hidden flex-1 min-w-0 h-9 px-2.5 rounded-lg border border-royal/25 bg-white text-royal font-mono text-[11px] font-bold uppercase\"><option value=\"all\">Show: All events</option><option value=\"trc\">Show: TRC events</option><option value=\"rental\">Show: Rentals</option><option value=\"mpl\">Show: Metro Pistol League</option><option value=\"turkey\">Show: Turkey Shoot</option><option value=\"closed\">Show: Closures</option></select>\n                <div class=\"hidden sm:flex flex-wrap gap-2\" id=\"calFilters\">\n                    <button data-filter=\"all\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition\">All</button>\n                    <button data-filter=\"trc\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition inline-flex items-center\"><span class=\"w-2 h-2 rounded-full bg-royal mr-1.5\"></span>TRC Events</button>\n                    <button data-filter=\"rental\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition inline-flex items-center\"><span class=\"w-2 h-2 rounded-full bg-slate-400 mr-1.5\"></span>Rentals</button>\n                    <button data-filter=\"mpl\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition inline-flex items-center\"><span class=\"w-2 h-2 rounded-full bg-gold-bright mr-1.5\"></span>Metro Pistol League</button>\n                    <button data-filter=\"turkey\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition inline-flex items-center\"><span class=\"w-2 h-2 rounded-full bg-amber-600 mr-1.5\"></span>Turkey Shoot</button>\n                    <button data-filter=\"closed\" class=\"cal-filter px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase transition inline-flex items-center\"><span class=\"w-2 h-2 rounded-full bg-red-600 mr-1.5\"></span>Closures</button>\n                </div>\n                <div class=\"inline-flex shrink-0 rounded-lg border border-royal/25 overflow-hidden\" role=\"group\" aria-label=\"Calendar view\">\n                    <button data-view=\"month\" class=\"cal-view px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition\"><i class=\"fa-regular fa-calendar sm:mr-1.5\"></i><span class=\"hidden sm:inline\">Month</span></button>\n                    <button data-view=\"list\" class=\"cal-view px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition border-l border-royal/25\"><i class=\"fa-solid fa-list-ul sm:mr-1.5\"></i><span class=\"hidden sm:inline\">List</span></button>\n                </div>\n            </div>\n\n            <div class=\"overflow-y-auto\">\n                <!-- MONTH VIEW -->\n                <div id=\"calMonthView\" class=\"p-4 sm:p-6\">\n                    <div class=\"flex items-center justify-between mb-4\">\n                        <button onclick=\"calShiftMonth(-1)\" aria-label=\"Previous month\" class=\"w-9 h-9 rounded-lg border border-royal/20 text-royal hover:bg-royal-tint hover:border-royal transition flex items-center justify-center\">\n                            <i class=\"fa-solid fa-chevron-left text-xs\"></i>\n                        </button>\n                        <div class=\"flex items-center gap-3\">\n                            <h4 id=\"calMonthLabel\" class=\"font-display font-bold text-xl sm:text-2xl text-royal uppercase tracking-wide\"></h4>\n                            <button onclick=\"calGoToday()\" class=\"px-2.5 py-1 rounded border border-gold/60 bg-gold-pale text-amber-800 font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-gold hover:text-royal transition\">Today</button>\n                        </div>\n                        <button onclick=\"calShiftMonth(1)\" aria-label=\"Next month\" class=\"w-9 h-9 rounded-lg border border-royal/20 text-royal hover:bg-royal-tint hover:border-royal transition flex items-center justify-center\">\n                            <i class=\"fa-solid fa-chevron-right text-xs\"></i>\n                        </button>\n                    </div>\n\n                    <div class=\"grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5\">\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Sun</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Mon</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Tue</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Wed</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Thu</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Fri</div>\n                        <div class=\"font-mono text-[10px] font-bold uppercase tracking-widest text-muted text-center py-1\">Sat</div>\n                    </div>\n                    <div id=\"calGrid\" class=\"grid grid-cols-7 gap-1 sm:gap-1.5\"></div>\n\n\n                    <!-- Selected day detail -->\n                    <div class=\"mt-5 pt-5 border-t border-slate-200\">\n                        <div id=\"calDayLabel\" class=\"font-mono text-xs font-bold uppercase tracking-[0.18em] text-amber-700 mb-3\"></div>\n                        <div id=\"calDayEvents\" class=\"space-y-3\"></div>\n                    </div>\n\n                    <!-- Dates to be announced (below the day summary) -->\n                    <div id=\"calNotice\" class=\"hidden mt-5 p-3 rounded-lg bg-gold-pale border border-gold/40 font-mono text-[11px] text-amber-800 flex items-start gap-2\"></div>\n                </div>\n\n                <!-- LIST VIEW -->\n                <div id=\"calListView\" class=\"hidden p-4 sm:p-6 space-y-6\"></div>\n            </div>\n\n            <div class=\"px-5 sm:px-6 py-2 sm:py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-center sm:justify-between gap-3 shrink-0\">\n                <span class=\"hidden sm:inline font-mono text-xs text-muted\">ALL FIRING LINES SUPERVISED BY CERTIFIED ROs</span>\n                <button onclick=\"closeModal('calendarModal'); openModal('contactModal');\" class=\"px-0 py-1 sm:px-4 sm:py-2 rounded sm:bg-royal sm:hover:bg-royal-light text-royal sm:text-white font-display text-xs font-semibold uppercase tracking-wider sm:border sm:border-gold/50 underline sm:no-underline decoration-gold underline-offset-4\">\n                    Inquire With Membership Secretary\n                </button>\n            </div>\n        </div>\n    </div>\n\n    <!-- ===================================================================== -->\n    <!-- INTERACTIVE MODAL 2: CONTACT CLUB MODAL                               -->\n    <!-- ===================================================================== -->\n    <div id=\"contactModal\" class=\"fixed inset-0 z-50 hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4\">\n        <div class=\"bg-white border-2 border-royal rounded-xl max-w-lg w-full overflow-hidden shadow-2xl\">\n            <div class=\"px-6 py-5 bg-royal text-white border-b-2 border-gold flex items-center justify-between\">\n                <div>\n                    <span class=\"font-mono text-[10px] uppercase tracking-[0.2em] text-gold-bright block\">CLUB ADMINISTRATION</span>\n                    <h3 class=\"font-display font-bold text-2xl text-white uppercase tracking-wide\">Contact TRC Executive</h3>\n                </div>\n                <button onclick=\"closeModal('contactModal')\" class=\"w-9 h-9 rounded-lg bg-white/10 hover:bg-gold hover:text-royal text-white flex items-center justify-center transition\">\n                    <i class=\"fa-solid fa-xmark\"></i>\n                </button>\n            </div>\n\n            <form onsubmit=\"handleContactSubmit(event)\" class=\"p-6 space-y-4\">\n                <div>\n                    <label class=\"block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5\">Full Name *</label>\n                    <input type=\"text\" required placeholder=\"Your Full Name\" class=\"w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slateink text-sm focus:outline-none focus:border-royal\">\n                </div>\n                <div class=\"grid sm:grid-cols-2 gap-4\">\n                    <div>\n                        <label class=\"block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5\">Email Address *</label>\n                        <input type=\"email\" required placeholder=\"member@example.ca\" class=\"w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slateink text-sm focus:outline-none focus:border-royal\">\n                    </div>\n                    <div>\n                        <label class=\"block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5\">Recipient</label>\n                        <select class=\"w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slateink text-sm focus:outline-none focus:border-royal\">\n                            <option>Membership Secretary (Joining &amp; General)</option>\n                            <option>Club Treasurer (Dues Assistance)</option>\n                            <option>Metro Pistol League Coordinator</option>\n                        </select>\n                    </div>\n                </div>\n                <div>\n                    <label class=\"block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5\">Message *</label>\n                    <textarea rows=\"3\" required placeholder=\"Include your inquiry or dues renewal details...\" class=\"w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slateink text-sm focus:outline-none focus:border-royal\"></textarea>\n                </div>\n                <div id=\"inquiryFeedback\" class=\"hidden p-3.5 rounded-lg bg-royal-tint border border-royal/30 text-royal font-mono text-xs font-semibold\"></div>\n                <div class=\"pt-2 flex justify-end gap-3\">\n                    <button type=\"button\" onclick=\"closeModal('contactModal')\" class=\"px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase\">Cancel</button>\n                    <button type=\"submit\" class=\"px-6 py-2.5 rounded-lg bg-royal hover:bg-royal-light text-white font-display font-semibold text-sm uppercase tracking-wider border border-gold/50\">\n                        Send Inquiry\n                    </button>\n                </div>\n            </form>\n        </div>\n    </div>\n\n    <!-- JAVASCRIPT INTERACTIVITY -->");

        // High-Precision Vector SVG Fallback for TRC Crest (image_721905.png)
        let crestFallbackCounter = 0;
        function renderTrcCrestFallback(imgEl) {
            if (!imgEl || !imgEl.parentElement) return;
            const uid = ++crestFallbackCounter;
            const svgMarkup = `
                <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full block" role="img" aria-label="Toronto Revolver Club Crest Est. 1905">
                    <defs>
                        <radialGradient id="trcNavyGrad_${uid}" cx="45%" cy="40%" r="60%">
                            <stop offset="0%" stop-color="#0A1B9C"/>
                            <stop offset="75%" stop-color="#041078"/>
                            <stop offset="100%" stop-color="#02094D"/>
                        </radialGradient>
                        <linearGradient id="trcGoldBevel_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#FFF08A"/>
                            <stop offset="30%" stop-color="#F4C414"/>
                            <stop offset="70%" stop-color="#D49B00"/>
                            <stop offset="100%" stop-color="#FCE166"/>
                        </linearGradient>
                        <linearGradient id="trcGoldFace_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#FFE45E"/>
                            <stop offset="50%" stop-color="#F4C414"/>
                            <stop offset="100%" stop-color="#D99B06"/>
                        </linearGradient>
                        <filter id="trcDropShadow_${uid}" x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="1.5" dy="2" stdDeviation="1.8" flood-color="#010530" flood-opacity="0.85"/>
                        </filter>
                        <path id="topArc_${uid}" d="M 44,150 A 106,106 0 1,1 256,150" />
                        <path id="bottomArc_${uid}" d="M 32,150 A 118,118 0 0,0 268,150" />
                    </defs>

                    <!-- Base Royal Blue Disc -->
                    <circle cx="150" cy="150" r="148" fill="url(#trcNavyGrad_${uid})"/>

                    <!-- Outer Metallic Gold Ring with Bevel -->
                    <circle cx="150" cy="150" r="142" fill="none" stroke="url(#trcGoldBevel_${uid})" stroke-width="8.5" filter="url(#trcDropShadow_${uid})"/>
                    <circle cx="150" cy="150" r="146" fill="none" stroke="#8C6200" stroke-width="1"/>
                    <circle cx="150" cy="150" r="138" fill="none" stroke="#8C6200" stroke-width="1"/>

                    <!-- Inner Metallic Gold Ring with Bevel -->
                    <circle cx="150" cy="150" r="97" fill="none" stroke="url(#trcGoldBevel_${uid})" stroke-width="6.5" filter="url(#trcDropShadow_${uid})"/>
                    <circle cx="150" cy="150" r="100" fill="none" stroke="#8C6200" stroke-width="0.9"/>
                    <circle cx="150" cy="150" r="94" fill="none" stroke="#8C6200" stroke-width="0.9"/>

                    <!-- Top Curved Text: TORONTO -->
                    <text fill="url(#trcGoldFace_${uid})" font-family="'Plus Jakarta Sans', 'Arial', sans-serif" font-weight="800" font-size="27" letter-spacing="3.5" filter="url(#trcDropShadow_${uid})">
                        <textPath href="#topArc_${uid}" startOffset="50%" text-anchor="middle">TORONTO</textPath>
                    </text>

                    <!-- Bottom Curved Text: REVOLVER CLUB -->
                    <text fill="url(#trcGoldFace_${uid})" font-family="'Plus Jakarta Sans', 'Arial', sans-serif" font-weight="800" font-size="23.5" letter-spacing="2.2" filter="url(#trcDropShadow_${uid})">
                        <textPath href="#bottomArc_${uid}" startOffset="50%" text-anchor="middle">REVOLVER CLUB</textPath>
                    </text>

                    <!-- Center Interlocked TRC Monogram -->
                    <g filter="url(#trcDropShadow_${uid})" fill="url(#trcGoldFace_${uid})" stroke="#9E6F00" stroke-width="0.8">
                        <!-- Stylized C -->
                        <path d="M 182,113 C 175,103 163,98 149,98 C 122,98 105,118 105,144 C 105,171 122,190 149,190 C 165,190 177,183 184,171 L 187,154 L 180,154 C 175,169 164,179 150,179 C 130,179 118,164 118,144 C 118,124 130,109 150,109 C 162,109 172,115 177,125 L 184,125 Z"/>
                        <!-- Stylized T -->
                        <path d="M 119,80 L 181,80 L 182,96 L 176,96 C 174,89 170,87 161,87 L 155,87 L 155,172 C 155,178 157,180 163,181 L 163,185 L 137,185 L 137,181 C 143,180 145,178 145,172 L 145,87 L 139,87 C 130,87 126,89 124,96 L 118,96 Z"/>
                        <!-- Stylized R -->
                        <path d="M 134,117 L 161,117 C 174,117 182,123 182,133 C 182,141 176,147 166,149 L 181,168 C 184,172 186,173 190,174 L 190,178 L 173,178 L 156,151 L 148,151 L 148,169 C 148,173 150,174 154,175 L 154,178 L 134,178 L 134,175 C 138,174 139,173 139,169 L 139,125 C 139,121 138,120 134,120 Z M 148,123 L 148,145 L 158,145 C 167,145 172,140 172,133 C 172,126 167,123 158,123 Z"/>
                    </g>

                    <!-- EST. 1905 Serif Label -->
                    <text x="150" y="213" text-anchor="middle" fill="#F8D254" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="16" letter-spacing="1.2" filter="url(#trcDropShadow_${uid})">
                        EST. 1905
                    </text>
                </svg>
            `;
            imgEl.outerHTML = svgMarkup;
        }
        // Catch crest images that failed before this script loaded
        document.querySelectorAll('img[src="image_721905.png"]').forEach(img => {
            if (img.complete && img.naturalWidth === 0) renderTrcCrestFallback(img);
        });

        // Mobile menu: toggle, close on link tap, outside tap or Escape
        (function () {
            const toggle = document.getElementById('mobileToggle');
            const menu = document.getElementById('mobileMenu');
            if (!toggle || !menu) return;
            const icon = toggle.querySelector('i');
            const setOpen = (open) => {
                menu.classList.toggle('hidden', !open);
                toggle.setAttribute('aria-expanded', open);
                if (icon) { icon.classList.toggle('fa-bars', !open); icon.classList.toggle('fa-xmark', open); }
            };
            toggle.addEventListener('click', (e) => { e.stopPropagation(); setOpen(menu.classList.contains('hidden')); });
            menu.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => setOpen(false)));
            document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
        })();

        // =====================================================================
        // CLUB CALENDAR
        // Source: TRC Google Calendar (Nov 2026) and Metro Pistol League calendar.
        // HOW TO EDIT
        //   Recurring (weekly) events: weekday 0=Sun ... 6=Sat. Optional from/until ('YYYY-MM-DD').
        //   Dated events: date 'YYYY-MM-DD' (or null = "to be announced").
        //   A dated event with replaces:'<key>' hides the recurring event with that key on that day.
        //   cat 'closed' on a date hides all recurring events that day.
        // =====================================================================
        const CAL_CATEGORIES = {
            trc:    { label: 'TRC Events',          dot: 'bg-royal',       pill: 'bg-royal text-white',            border: 'border-l-royal' },
            rental: { label: 'Range Rentals',       dot: 'bg-slate-400',   pill: 'bg-slate-200 text-slate-700',    border: 'border-l-slate-400' },
            mpl:    { label: 'Metro Pistol League', dot: 'bg-gold-bright', pill: 'bg-gold-bright text-royal-deep', border: 'border-l-gold-bright' },
            turkey: { label: 'Annual Turkey Shoot', dot: 'bg-amber-600',   pill: 'bg-amber-600 text-white',        border: 'border-l-amber-600' },
            closed: { label: 'Closures & Maintenance', dot: 'bg-red-600',  pill: 'bg-red-600 text-white',          border: 'border-l-red-600' }
        };

        const RENTAL_DESC = 'Range rented to another club, which has exclusive use. Not open to TRC members during this time.';

        const CAL_RECURRING = [
            { cat: 'trc', weekday: 2, start: '09:00', short: 'ISSF 60', badge: 'WEEKLY MATCH',
              title: 'Tuesday Morning ISSF 60',
              desc: 'Weekly morning ISSF precision match for TRC members.' },
            { key: 'wed-night', cat: 'trc', weekday: 3, start: '17:00', end: '24:00', short: 'Club Night', badge: 'TRC CLUB NIGHT',
              title: 'TRC Club Night',
              desc: 'The weekly TRC club night on the range.' },
            { cat: 'rental', weekday: 0, start: '17:00', short: 'Golden Mile', badge: 'RANGE RENTAL', title: 'Golden Mile (Rental Club)', desc: RENTAL_DESC },
            { cat: 'rental', weekday: 2, start: '17:00', short: 'Durham Sport', badge: 'RANGE RENTAL', title: 'Durham Sport (Rental Club)', desc: RENTAL_DESC },
            { cat: 'rental', weekday: 4, start: '17:00', short: 'Maple Leaf', badge: 'RANGE RENTAL', title: 'Maple Leaf (Rental Club)', desc: RENTAL_DESC },
            { cat: 'rental', weekday: 5, start: '17:00', short: 'Pape', badge: 'RANGE RENTAL', title: 'Pape (Rental Club)', desc: RENTAL_DESC }
        ];

        const CAL_DATED = [
            // --- November 2026 ---
            { cat: 'trc', date: '2026-11-04', start: '17:00', replaces: 'wed-night', short: 'ISSF .22 (30)', badge: 'CLUB NIGHT MATCH', title: 'ISSF .22 (30)', desc: 'Wednesday club night ISSF .22 match, 30 shots.' },
            { cat: 'trc', date: '2026-11-07', start: '08:00', short: 'Air Pistol Match', badge: 'MATCH', title: 'Air Pistol Match', desc: '10m air pistol match.' },
            { cat: 'closed', date: '2026-11-09', start: '18:00', short: 'Club Closed', badge: 'CLOSED', title: 'Club Closed: Executive Meeting', desc: 'The range is closed for the evening.' },
            { cat: 'closed', date: '2026-11-11', start: '07:00', short: 'Maintenance', badge: 'MAINTENANCE', title: 'Range Maintenance', desc: 'Scheduled range maintenance.' },
            { cat: 'trc', date: '2026-11-11', start: '17:00', replaces: 'wed-night', short: 'ISSF .22 (30)', badge: 'CLUB NIGHT MATCH', title: 'ISSF .22 (30)', desc: 'Wednesday club night ISSF .22 match, 30 shots.' },
            { cat: 'trc', date: '2026-11-14', start: '08:00', short: 'IPSC Invitational', badge: 'INVITATIONAL', title: 'IPSC Invitational Match', desc: 'Invitational practical shooting match.' },
            { cat: 'trc', date: '2026-11-18', start: '17:00', replaces: 'wed-night', short: 'ISSF CF (30)', badge: 'CLUB NIGHT MATCH', title: 'ISSF Centrefire (30)', desc: 'Wednesday club night ISSF centrefire match, 30 shots.' },
            { cat: 'trc', date: '2026-11-21', start: '09:30', short: 'Bill Wood Memorial', badge: 'MEMORIAL MATCH', title: 'Bill Wood Memorial Match', desc: 'Annual memorial match.' },
            { cat: 'trc', date: '2026-11-25', start: '17:00', replaces: 'wed-night', short: 'ISSF .22 600', badge: 'CLUB NIGHT MATCH', title: 'ISSF .22 600 (60)', desc: 'Wednesday club night ISSF .22 600 match, 60 shots.' },
            { cat: 'trc', date: '2026-11-30', start: '18:00', short: 'Rifle Night', badge: 'RIFLE NIGHT', title: 'Rifle Night', desc: 'Rifle night. Only .22 calibre rimfire rifles are permitted on the range.' },
            // --- December 2026 ---
            { cat: 'trc', date: '2026-12-02', start: '17:00', replaces: 'wed-night', short: 'ISSF 600 (60)', badge: 'CLUB NIGHT MATCH', title: 'ISSF 600 (60)', desc: 'Wednesday club night ISSF 600 match, 60 shots.' },
            { cat: 'trc', date: '2026-12-05', start: '08:00', short: 'Air Pistol Match', badge: 'MATCH', title: 'Air Pistol Match', desc: '10m air pistol match.' },
            // --- To be announced ---
            { cat: 'mpl', date: null, start: null, short: 'MPL Div. 6', badge: 'DIVISION 6 · 2025–26', title: 'Metro Pistol League Division 6 Matches',
              desc: 'No Division 6 matches are posted for November. Note: the maximum dummy score allowed for .22 or CF is 250.' },
            { cat: 'turkey', date: null, start: null, short: 'Turkey Shoot', badge: 'SIGNATURE EVENT', title: 'TRC Annual Turkey Shoot',
              desc: 'A long-standing TRC tradition: members shoot at colourful paper novelty targets and compete for prizes. The name dates back to when the winners took home a turkey. Annual dues may also be paid in person (cash or cheque).' }
        ];

        const calState = { filter: 'all', view: 'month', year: 0, month: 0, selected: null };
        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

        function calKey(d) {
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
        function calShown(cat) { return calState.filter === 'all' || calState.filter === cat || (calState.filter === 'trc' && cat === 'turkey'); }
        function calFmtTime(t) {
            if (!t) return '';
            let [h, m] = t.split(':').map(Number);
            if (h === 24) return '12:00 AM';
            const ap = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return h + ':' + String(m).padStart(2, '0') + ' ' + ap;
        }
        function calTimeLabel(ev) {
            if (!ev.start) return ev.date ? '' : 'DATE TBA';
            return calFmtTime(ev.start) + (ev.end ? ' – ' + calFmtTime(ev.end) : '');
        }

        function calEventsOn(date) {
            const key = calKey(date);
            const dated = CAL_DATED.filter(ev => ev.date === key);
            const closedAllDay = dated.some(ev => ev.cat === 'closed' && ev.allDay);
            const replaced = dated.map(ev => ev.replaces).filter(Boolean);
            const list = [];
            if (!closedAllDay) {
                CAL_RECURRING.forEach(ev => {
                    if (ev.weekday !== date.getDay()) return;
                    if (ev.from && key < ev.from) return;
                    if (ev.until && key > ev.until) return;
                    if (ev.key && replaced.includes(ev.key)) return;
                    list.push(ev);
                });
            }
            dated.forEach(ev => list.push(ev));
            return list.filter(ev => calShown(ev.cat)).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
        }

        function calEventCard(ev, timeLabel) {
            const c = CAL_CATEGORIES[ev.cat];
            return `
                <div class="p-4 rounded-lg bg-[#F8FAFC] border border-royal/15 border-l-4 ${c.border} hover:border-gold transition">
                    <div class="flex flex-wrap items-center gap-2 mb-1.5">
                        <span class="font-mono text-xs font-bold text-royal">${timeLabel || calTimeLabel(ev)}</span>
                        <span class="px-2.5 py-0.5 rounded bg-gold-pale border border-gold/40 font-mono text-[10px] font-bold text-amber-800">${ev.badge}</span>
                    </div>
                    <h4 class="font-display text-lg font-bold text-slateink uppercase tracking-wide">${ev.title}</h4>
                    ${ev.desc ? '<p class="text-xs sm:text-sm text-muted mt-1 leading-relaxed">' + ev.desc + '</p>' : ''}
                </div>`;
        }

        function calRenderToolbar() {
            document.querySelectorAll('.cal-filter').forEach(btn => {
                const on = btn.dataset.filter === calState.filter;
                btn.classList.toggle('bg-royal', on);
                btn.classList.toggle('text-white', on);
                btn.classList.toggle('bg-white', !on);
                btn.classList.toggle('border', !on);
                btn.classList.toggle('border-slate-200', !on);
                btn.classList.toggle('text-slate-700', !on);
            });
            document.querySelectorAll('.cal-view').forEach(btn => {
                const on = btn.dataset.view === calState.view;
                btn.classList.toggle('bg-royal', on);
                btn.classList.toggle('text-white', on);
                btn.classList.toggle('bg-white', !on);
                btn.classList.toggle('text-royal', !on);
            });
            const sel = document.getElementById('calFilterSel'); if (sel) sel.value = calState.filter;
            document.getElementById('calMonthView').classList.toggle('hidden', calState.view !== 'month');
            document.getElementById('calListView').classList.toggle('hidden', calState.view !== 'list');
        }

        function calRenderMonth() {
            const { year, month } = calState;
            document.getElementById('calMonthLabel').textContent = MONTHS[month] + ' ' + year;
            const todayKey = calKey(new Date());
            const firstDow = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            let html = '';
            for (let i = 0; i < firstDow; i++) html += '<div class="rounded-lg bg-slate-50/60" aria-hidden="true"></div>';
            for (let day = 1; day <= daysInMonth; day++) {
                const d = new Date(year, month, day);
                const key = calKey(d);
                const list = calEventsOn(d);
                const isToday = key === todayKey;
                const isSel = key === calState.selected;
                const pills = list.slice(0, 3).map(ev =>
                    `<span class="block truncate rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${CAL_CATEGORIES[ev.cat].pill}" title="${calFmtTime(ev.start)} ${ev.title}">${ev.short}</span>`).join('');
                const dots = list.map(ev => `<span class="w-1.5 h-1.5 rounded-full ${CAL_CATEGORIES[ev.cat].dot}"></span>`).join('');
                html += `
                    <button onclick="calSelect('${key}')" aria-label="${WEEKDAYS[d.getDay()]} ${MONTHS[month]} ${day}, ${list.length} event${list.length === 1 ? '' : 's'}"
                        class="text-left rounded-lg border min-h-[56px] sm:min-h-[96px] p-1.5 sm:p-2 flex flex-col transition
                        ${isSel ? 'border-royal bg-royal-tint ring-2 ring-royal/30' : 'border-slate-200 bg-white hover:border-gold hover:bg-gold-pale/40'}">
                        <span class="font-mono text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full
                            ${isToday ? 'bg-gold text-royal-deep ring-2 ring-royal' : 'text-slateink'}">${day}</span>
                        <span class="hidden sm:block space-y-1">${pills}${list.length > 3 ? `<span class="block text-[10px] font-mono text-muted">+${list.length - 3} more</span>` : ''}</span>
                        <span class="flex sm:hidden flex-wrap gap-1 mt-auto">${dots}</span>
                    </button>`;
            }
            document.getElementById('calGrid').innerHTML = html;

            const tba = CAL_DATED.filter(ev => !ev.date && calShown(ev.cat));
            const notice = document.getElementById('calNotice');
            if (tba.length) {
                notice.innerHTML = '<i class="fa-solid fa-bullhorn mt-0.5"></i><span><strong>DATES TO BE ANNOUNCED:</strong> ' +
                    tba.map(ev => ev.title).join(' &bull; ') + '. Check back or contact the Membership Secretary.</span>';
                notice.classList.remove('hidden');
            } else {
                notice.classList.add('hidden');
            }
            calRenderDay();
        }

        function calRenderDay() {
            const [y, m, d] = calState.selected.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            const list = calEventsOn(date);
            document.getElementById('calDayLabel').textContent = WEEKDAYS[date.getDay()] + ', ' + MONTHS[date.getMonth()] + ' ' + d;
            document.getElementById('calDayEvents').innerHTML = list.length
                ? list.map(ev => calEventCard(ev)).join('')
                : '<div class="p-4 rounded-lg bg-[#F8FAFC] border border-dashed border-royal/20 font-mono text-xs text-muted">No scheduled events. Members may use the range during regular hours (see the <a href="range.html#hours" onclick="closeModal(\'calendarModal\')" class="text-royal underline">range hours</a>).</div>';
        }

        function calRenderList() {
            const today = calKey(new Date());
            const inTrc = cat => cat === 'turkey' && (calState.filter === 'trc' || calState.filter === 'all');
            const groups = Object.keys(CAL_CATEGORIES).filter(c => calShown(c) && !inTrc(c)).map(cat => {
                const recurring = CAL_RECURRING.filter(ev => ev.cat === cat)
                    .map(ev => calEventCard(ev, WEEKDAYS[ev.weekday].toUpperCase() + 'S // ' + calTimeLabel(ev)));
                const horizon = calKey(new Date(Date.now() + 60 * 864e5));
                const dated = CAL_DATED.filter(ev => (ev.cat === cat || (cat === 'trc' && inTrc(ev.cat))) && (!ev.date || (ev.date >= today && (!calLive || ev.date <= horizon))))
                    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'))
                    .map(ev => {
                        let label = 'DATE TBA';
                        if (ev.date) {
                            const [y, m, d] = ev.date.split('-').map(Number);
                            const dt = new Date(y, m - 1, d);
                            label = WEEKDAYS[dt.getDay()].slice(0, 3).toUpperCase() + ' ' + MONTHS[m - 1].slice(0, 3).toUpperCase() + ' ' + d + ' // ' + calTimeLabel(ev);
                        }
                        return calEventCard(ev, label);
                    });
                const items = recurring.concat(dated);
                if (!items.length) return '';
                return `
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span class="w-2.5 h-2.5 rounded-full ${CAL_CATEGORIES[cat].dot}"></span>
                            <span class="font-mono text-xs font-bold uppercase tracking-[0.18em] text-royal">${CAL_CATEGORIES[cat].label}</span>
                        </div>
                        <div class="space-y-3">${items.join('')}</div>
                    </div>`;
            });
            document.getElementById('calListView').innerHTML = groups.join('') ||
                '<div class="p-4 rounded-lg bg-[#F8FAFC] border border-dashed border-royal/20 font-mono text-xs text-muted">No upcoming events in this category.</div>';
        }

        function calRender() {
            calRenderToolbar();
            if (calState.view === 'month') calRenderMonth(); else calRenderList();
        }

        function calSelect(key) { calState.selected = key; calRenderMonth(); }
        function calShiftMonth(delta) {
            const d = new Date(calState.year, calState.month + delta, 1);
            calState.year = d.getFullYear();
            calState.month = d.getMonth();
            calState.selected = calKey(d);
            calRenderMonth();
        }
        function calGoToday() {
            const t = new Date();
            calState.year = t.getFullYear();
            calState.month = t.getMonth();
            calState.selected = calKey(t);
            calRenderMonth();
        }
        function openCalendar() {
            // Every visit starts with all calendars shown
            calState.filter = 'all';
            openModal('calendarModal');
            calRender();
        }

        function calSubscribeLinks() {
            const rows = [['TRC club calendar', 'webmaster@torontorevolverclub.com'], ['Metro Pistol League', 'pfspehu6fdsnkaod9vvj6puht8@group.calendar.google.com']];
            const btn = 'flex-1 min-w-[9rem] inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-royal/20 bg-royal-tint text-royal text-sm font-semibold hover:border-royal';
            return '<div class="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700 mb-2">Add to my calendar</div>' +
                rows.map(([label, id]) => '<div class="text-sm text-slateink mb-1">' + label + '</div><div class="flex flex-wrap gap-2 mb-3">' +
                    '<a class="' + btn + '" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?cid=' + encodeURIComponent(id) + '"><i class="fa-brands fa-google"></i>Google / Android</a>' +
                    '<a class="' + btn + '" href="webcal://calendar.google.com/calendar/ical/' + encodeURIComponent(id) + '/public/basic.ics"><i class="fa-brands fa-apple"></i>iPhone / Mac</a></div>').join('') +
                '<p class="font-mono text-[11px] text-muted">Events update on your phone automatically. Read-only.</p>';
        }
        function calToggleSubscribe(show) {
            const el = document.getElementById('calSubscribe');
            if (!el.innerHTML) el.innerHTML = calSubscribeLinks();
            const open = show === undefined ? el.classList.contains('hidden') : show;
            el.classList.toggle('hidden', !open);
            if (open) el.scrollIntoView({ block: 'nearest' });
        }
        function openCalendarSubscribe() { openCalendar(); calToggleSubscribe(true); }
        function calJumpToNext(cat) {
            // Show the month of the next event in this category and select that day
            const today = calKey(new Date());
            const next = CAL_DATED.filter(ev => (ev.cat === cat || (cat === 'trc' && ev.cat === 'turkey')) && ev.date && ev.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
            let d = null;
            if (next) { const [y, m, dd] = next.date.split('-').map(Number); d = new Date(y, m - 1, dd); }
            else {
                const rec = CAL_RECURRING.filter(ev => ev.cat === cat);
                if (rec.length) { d = new Date(); for (let i = 0; i < 7 && !rec.some(ev => ev.weekday === d.getDay()); i++) d.setDate(d.getDate() + 1); }
            }
            if (!d) return;
            calState.year = d.getFullYear(); calState.month = d.getMonth(); calState.selected = calKey(d);
        }
        document.querySelectorAll('.cal-filter').forEach(btn => btn.addEventListener('click', () => { calState.filter = btn.dataset.filter; if (calState.filter !== 'all') calJumpToNext(calState.filter); calRender(); }));
        document.getElementById('calFilterSel').addEventListener('change', e => { calState.filter = e.target.value; if (calState.filter !== 'all') calJumpToNext(calState.filter); calRender(); });
        document.querySelectorAll('.cal-view').forEach(btn => btn.addEventListener('click', () => { calState.view = btn.dataset.view; calRender(); }));

        (function () {
            const t = new Date();
            calState.year = t.getFullYear();
            calState.month = t.getMonth();
            calState.selected = calKey(t);
            calRender();
        })();

// ---------- Live events from the club's public Google Calendars ----------
// Needs calendar-config.js (window.TRC_GCAL_KEY). Without it, the hand-copied events above are used.
const GCAL_IDS = { trc: 'webmaster@torontorevolverclub.com', mpl: 'pfspehu6fdsnkaod9vvj6puht8@group.calendar.google.com' };
let calLive = false;
function calGuessCat(title, src) {
    if (src === 'mpl') return 'mpl';
    const t = (title || '').toLowerCase();
    if (/turkey/.test(t)) return 'turkey';
    if (/closed|closure|maintenance|no shooting|cancel/.test(t)) return 'closed';
    if (/rental|golden mile|durham|maple leaf|pape/.test(t)) return 'rental';
    return 'trc';
}
function calPlain(html) {
    const d = document.createElement('div'); d.innerHTML = (html || '').replace(/<br\s*\/?>/gi, ' ');
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
}
function calFromGoogle(item, src) {
    let title = (item.summary || 'Club event').trim();
    // ALL-CAPS titles (e.g. "DURHAM SPORT") → normal capitals; short codes like ISSF, IPSC, MPL stay as typed
    if (title === title.toUpperCase() && /[A-Z]{4,}/.test(title))
        title = title.toLowerCase().replace(/\b([a-z])/g, c => c.toUpperCase()).replace(/\b(Issf|Ipsc|Mpl|Nra|Trc|Ro|Rpal|Cf|Ii|Iii)\b/g, w => w.toUpperCase());
    const cat = calGuessCat(title, src);
    const allDay = !!(item.start && item.start.date);
    const date = allDay ? item.start.date : String(item.start.dateTime).slice(0, 10);
    let start = allDay ? null : String(item.start.dateTime).slice(11, 16);
    let end = allDay || !item.end || !item.end.dateTime ? null : String(item.end.dateTime).slice(11, 16);
    if (end === '00:00' && String(item.end.dateTime).slice(0, 10) !== date) end = '24:00';
    if (end === start) end = null;
    return { cat, date, start, end, allDay, short: title.length > 22 ? title.slice(0, 21) + '…' : title, title,
        badge: cat === 'rental' ? 'RANGE RENTAL' : CAL_CATEGORIES[cat].label.toUpperCase(),
        desc: [calPlain(item.description), item.location ? 'Location: ' + item.location : ''].filter(Boolean).join(' ') || (cat === 'rental' ? RENTAL_DESC : '') };
}
async function calLoadGoogle() {
    const key = window.TRC_GCAL_KEY;
    if (!key || /PASTE_KEY/.test(key)) return;
    const from = new Date(); from.setDate(from.getDate() - 62);
    const to = new Date(); to.setDate(to.getDate() + 400);
    const get = async (src) => {
        const url = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(GCAL_IDS[src]) + '/events?singleEvents=true&orderBy=startTime&maxResults=2500&timeZone=America%2FToronto' +
            '&timeMin=' + encodeURIComponent(from.toISOString()) + '&timeMax=' + encodeURIComponent(to.toISOString()) + '&key=' + encodeURIComponent(key);
        const r = await fetch(url);
        if (!r.ok) throw new Error(src + ' ' + r.status);
        return ((await r.json()).items || []).filter(i => i.status !== 'cancelled' && i.start).map(i => calFromGoogle(i, src));
    };
    const res = await Promise.allSettled([get('trc'), get('mpl')]);
    const live = res.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    res.filter(r => r.status === 'rejected').forEach(r => console.warn('Google Calendar:', r.reason));
    if (!live.length && res.every(r => r.status === 'rejected')) return;
    const cats = new Set(live.map(e => e.cat));
    // Keep a hand-entered weekly item only if Google has nothing of that kind (e.g. rentals may not be on Google)
    for (let i = CAL_RECURRING.length - 1; i >= 0; i--) if (cats.has(CAL_RECURRING[i].cat)) CAL_RECURRING.splice(i, 1);
    CAL_DATED.filter(e => !e.date).forEach(t => live.forEach(e => { if (e.cat === t.cat && e.cat !== 'trc' && !e.desc) { e.desc = t.desc; e.badge = t.badge; } }));
    const tba = CAL_DATED.filter(e => !e.date && !cats.has(e.cat));
    CAL_DATED.splice(0, CAL_DATED.length, ...live, ...tba);
    calLive = true;
    calRender();
    document.dispatchEvent(new Event('trc:calendar'));
}
(function () {
    const sc = document.createElement('script');
    sc.src = '/calendar-config.js';
    sc.onload = () => calLoadGoogle().catch(e => console.warn('Google Calendar:', e));
    document.head.appendChild(sc);
})();

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') ['calendarModal', 'contactModal'].forEach(closeModal);
        });
        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            toastMsg.textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.remove('translate-y-4', 'opacity-0');
            }, 10);
            setTimeout(() => {
                toast.classList.add('translate-y-4', 'opacity-0');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 3000);
        }

        // Modal Controls
        function openModal(id) {
            document.getElementById(id).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
            document.body.style.overflow = '';
        }

        window.addEventListener('click', (e) => {
            ['calendarModal', 'contactModal'].forEach(id => {
                const modal = document.getElementById(id);
                if (e.target === modal) closeModal(id);
            });
        });

        function handleContactSubmit(e) {
            e.preventDefault();
            const feedback = document.getElementById('inquiryFeedback');
            const to = (e.target.querySelector('select')?.selectedOptions[0]?.text || 'Membership Secretary').replace(/\s*\(.*\)$/, '');
            feedback.textContent = 'MESSAGE SENT: Your inquiry has been routed to the ' + to + '.';
            feedback.classList.remove('hidden');
            e.target.reset();
        }

        
// ---------- Range hours (from the TRC Club Safety Rules) ----------
        // Segments: [startHour, endHour, type]. type: member | club | rental
        const HOURS = [
            { day: 'Mon', segs: [[7, 24, 'member']], note: 'See schedule' },
            { day: 'Tue', segs: [[7, 17, 'member'], [17, 24, 'rental', 'Durham Sport']] },
            { day: 'Wed', segs: [[17, 24, 'club']] },
            { day: 'Thu', segs: [[7, 17, 'member'], [17, 24, 'rental', 'Maple Leaf']] },
            { day: 'Fri', segs: [[7, 17, 'member'], [17, 24, 'rental', 'Pape']] },
            { day: 'Sat', segs: [[7, 24, 'member']] },
            { day: 'Sun', segs: [[7, 17, 'member'], [17, 24, 'rental', 'Golden Mile']] }
        ];
        
// New-layout hours chart (Range page)
(function () {
    const chart = document.getElementById('hoursRows');
    if (!chart) return;
    const fmt = h => h === 24 ? '12 AM' : h === 12 ? '12 PM' : h > 12 ? (h - 12) + ' PM' : h + ' AM';
    const today = (new Date().getDay() + 6) % 7; // Mon=0
    chart.innerHTML = HOURS.map((row, i) => '<div class="hrow"><div class="hday' + (i === today ? ' today' : '') + '">' + row.day + '</div><div class="htrack">' +
        row.segs.map(([s, e, t, name]) => {
            const cls = t === 'member' ? 'm' : t === 'club' ? 'c' : 'r';
            const lab = t === 'member' ? 'TRC' + ((e - s) > 12 ? ' members' : '') : t === 'club' ? '★ Club Night' : (name || 'Rental club');
            const tm = t === 'rental' ? '' : '<span class="t">&nbsp;· ' + fmt(s) + '–' + fmt(e) + '</span>';
            return '<div class="seg ' + cls + '" style="left:' + ((s - 6) / 18 * 100) + '%;width:' + ((e - s) / 18 * 100) + '%" title="' + (name ? name + ': ' : '') + fmt(s) + ' – ' + fmt(e) + '">' + lab + tm + '</div>';
        }).join('') + '</div></div>').join('');
    const el = document.getElementById('openNow');
    if (!el) return;
    const now = new Date(), h = now.getHours() + now.getMinutes() / 60;
    const seg = HOURS[today].segs.find(([s, e]) => h >= s && h < e);
    if (seg && seg[2] === 'member') el.innerHTML = '<span class="dot"></span>Open now · TRC members until ' + fmt(seg[1]);
    else if (seg && seg[2] === 'club') el.innerHTML = '<span class="dot"></span>TRC club night now · until ' + fmt(seg[1]);
    else { el.classList.add('shut'); el.innerHTML = seg ? (seg[3] || 'Rental club') + ' has the range now · not available to TRC members' : 'Range closed now'; }
})();

// Mobile menu
(function () {
    const btn = document.querySelector('.burger'), panel = document.getElementById('mnav');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => { const open = panel.classList.toggle('is-open'); btn.setAttribute('aria-expanded', open); });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('is-open')));
})();

// Open calendar or contact form when arriving from another page
        function openFromHash() {
            if (location.hash === '#calendar') openCalendar();
            if (location.hash === '#contact') openModal('contactModal');
            if (location.hash === '#contact-treasurer') {
                const sel = document.querySelector('#contactModal select');
                if (sel) sel.selectedIndex = [...sel.options].findIndex(o => /Treasurer/.test(o.text));
                openModal('contactModal');
            }
        }
        openFromHash();
        window.addEventListener('hashchange', openFromHash);

        
// Phone bottom tab bar (same as current site)
(function () {
    if (document.getElementById('mTabBar')) return;
    const page = location.pathname.split('/').pop() || 'index.html';
    const tabs = [
        ['home', 'fa-house', 'Home', '/index.html'],
        ['hours', 'fa-clock', 'Hours', '/range.html#hours'],
        ['safety', 'fa-shield-halved', 'Safety', '/safety.html'],
        ['events', 'fa-calendar-days', 'Events', '#calendar'],
        ['portal', 'fa-users', 'Members', '/members.html']
    ];
    const active = page.startsWith('safety') ? 'safety' : page === 'range.html' ? 'hours' : page === 'index.html' ? 'home' : '';
    const bar = document.createElement('nav');
    bar.id = 'mTabBar';
    bar.setAttribute('aria-label', 'Quick navigation');
    bar.innerHTML = tabs.map(([id, ic, lab, href]) => '<a href="' + href + '" data-tab="' + id + '" class="' + (id === active ? 'on' : '') + '"><i class="fa-solid ' + ic + '"></i>' + lab + '</a>').join('');
    document.body.appendChild(bar);
    bar.querySelector('[data-tab="events"]').addEventListener('click', e => { e.preventDefault(); openCalendar(); });
})();
