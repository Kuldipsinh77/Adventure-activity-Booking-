/* =========================================================
   BASECAMP — Adventure Activity Booking
   script.js
========================================================= */

// ---------- Activity data ----------
const ACTIVITIES = [
  {
    id: "trek-01",
    name: "Himalayan Ridge Trek",
    difficulty: "Hard",
    duration: "5 days",
    altitude: "4,200 m",
    price: 8999,
    desc: "A high-altitude trail through pine forest and exposed ridgeline, ending at a glacial lake.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=60"
  },
  {
    id: "raft-01",
    name: "White-water Rafting",
    difficulty: "Moderate",
    duration: "Half day",
    altitude: "Grade III–IV",
    price: 1499,
    desc: "12 km of rapids on a fast-flowing river, guided by certified river rescue instructors.",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=60"
  },
  {
    id: "para-01",
    name: "Valley Paragliding",
    difficulty: "Moderate",
    duration: "2 hours",
    altitude: "1,800 m",
    price: 2999,
    desc: "Tandem paragliding over open valley with a certified pilot — no experience required.",
    img: "https://images.unsplash.com/photo-1521673461164-de300ebcfb17?w=500&q=60"
  },
  {
    id: "climb-01",
    name: "Sandstone Rock Climbing",
    difficulty: "Hard",
    duration: "1 day",
    altitude: "60 m routes",
    price: 1799,
    desc: "Top-rope and lead climbing on natural sandstone cliffs, all safety gear included.",
    img: "https://images.unsplash.com/photo-1516592066896-6c5c67aa4a08?w=500&q=60"
  },
  {
    id: "camp-01",
    name: "Desert Night Camping",
    difficulty: "Easy",
    duration: "Overnight",
    altitude: "sea level",
    price: 1299,
    desc: "Tents, bonfire and a starlit dinner in open desert terrain — beginner friendly.",
    img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&q=60"
  },
  {
    id: "zip-01",
    name: "Canopy Zip-lining",
    difficulty: "Easy",
    duration: "3 hours",
    altitude: "8 lines",
    price: 999,
    desc: "Eight linked zip-lines through forest canopy, suited to first-time adventurers.",
    img: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=500&q=60"
  }
];

const STORAGE_KEY = "basecamp_bookings";

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getBookings(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveBookings(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function showToast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("show"), 2600);
}
function formatPrice(n){
  return "₹" + n.toLocaleString("en-IN");
}

// ---------- Render activity cards ----------
function renderActivities(filter = "all"){
  const grid = $("#activityGrid");
  const list = filter === "all" ? ACTIVITIES : ACTIVITIES.filter(a => a.difficulty === filter);
  grid.innerHTML = list.map(a => `
    <article class="activity-card" data-id="${a.id}">
      <div class="thumb">
        <img src="${a.img}" alt="${a.name}" loading="lazy">
        <span class="badge ${a.difficulty}">${a.difficulty}</span>
      </div>
      <div class="body">
        <h3>${a.name}</h3>
        <p class="desc">${a.desc}</p>
        <div class="stat-line">
          <span>Duration<b>${a.duration}</b></span>
          <span>Altitude / Grade<b>${a.altitude}</b></span>
        </div>
        <div class="card-foot">
          <span class="price">${formatPrice(a.price)} <span style="color:var(--muted); font-weight:400;">/ person</span></span>
          <button class="book-btn" data-book="${a.id}">Book</button>
        </div>
      </div>
    </article>
  `).join("");
}

function populateActivitySelect(){
  const sel = $("#activitySelect");
  sel.innerHTML = ACTIVITIES.map(a =>
    `<option value="${a.id}">${a.name} — ${formatPrice(a.price)}</option>`
  ).join("");
}

// ---------- Bookings list ----------
function renderBookings(){
  const search = $("#bookingSearch").value.trim().toLowerCase();
  const status = $("#statusFilterRow .chip.active")?.dataset.status || "all";
  let list = getBookings();

  if (status !== "all") list = list.filter(b => b.status === status);
  if (search){
    list = list.filter(b =>
      b.name.toLowerCase().includes(search) ||
      b.activityName.toLowerCase().includes(search)
    );
  }

  const container = $("#bookingsList");
  const empty = $("#emptyState");

  if (list.length === 0){
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  container.innerHTML = list.slice().reverse().map(b => `
    <div class="booking-item ${b.status === 'cancelled' ? 'is-cancelled' : ''}" data-booking="${b.id}">
      <div>
        <div class="who">${b.name} <span class="mono" style="color:var(--muted); font-size:11px;">#${b.id}</span></div>
        <div class="meta">${b.activityName} · ${b.participants} pax · ${b.date}</div>
      </div>
      <div class="right">
        <span class="status-pill ${b.status}">${b.status}</span>
        ${b.status === "upcoming" ? `<button class="cancel-btn" data-cancel="${b.id}">Cancel</button>` : ""}
      </div>
    </div>
  `).join("");
}

// ---------- Booking form submit ----------
function handleBookingSubmit(e){
  e.preventDefault();
  const name = $("#fullName").value.trim();
  const email = $("#email").value.trim();
  const phone = $("#phone").value.trim();
  const activityId = $("#activitySelect").value;
  const participants = parseInt($("#participants").value, 10);
  const date = $("#bookingDate").value;
  const notes = $("#notes").value.trim();
  const msgEl = $("#formMsg");

  if (!name || !email || !phone || !date || !activityId || !participants){
    msgEl.textContent = "Please fill in every required field.";
    msgEl.className = "form-msg error";
    return;
  }

  const activity = ACTIVITIES.find(a => a.id === activityId);
  const booking = {
    id: Date.now().toString(36).toUpperCase().slice(-6),
    name, email, phone, notes,
    activityId, activityName: activity.name,
    participants, date,
    status: "upcoming",
    createdAt: new Date().toISOString()
  };

  const list = getBookings();
  list.push(booking);
  saveBookings(list);

  msgEl.textContent = `Booked! Confirmation code #${booking.id}.`;
  msgEl.className = "form-msg success";
  e.target.reset();
  $("#participants").value = 1;

  renderBookings();
  showToast(`Booking confirmed — ${activity.name} on ${date}`);
}

// ---------- Cancel booking ----------
function handleBookingsClick(e){
  const cancelId = e.target.dataset.cancel;
  if (!cancelId) return;
  const list = getBookings().map(b =>
    b.id === cancelId ? { ...b, status: "cancelled" } : b
  );
  saveBookings(list);
  renderBookings();
  showToast("Booking cancelled.");
}

// ---------- Activity grid click (Book buttons) ----------
function handleActivityGridClick(e){
  const bookId = e.target.dataset.book;
  if (!bookId) return;
  $("#activitySelect").value = bookId;
  document.getElementById("book").scrollIntoView({ behavior: "smooth", block: "start" });
  $("#fullName").focus();
}

// ---------- Filters ----------
function setupChipFilter(rowSelector, dataAttr, onChange){
  const row = $(rowSelector);
  row.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    row.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    onChange(chip.dataset[dataAttr]);
  });
}

// ---------- Theme toggle ----------
function setupTheme(){
  const toggle = $("#themeToggle");
  const saved = localStorage.getItem("basecamp_theme");
  if (saved === "light"){
    document.documentElement.setAttribute("data-theme", "light");
    toggle.textContent = "☀";
  }
  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight){
      document.documentElement.removeAttribute("data-theme");
      toggle.textContent = "☾";
      localStorage.setItem("basecamp_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      toggle.textContent = "☀";
      localStorage.setItem("basecamp_theme", "light");
    }
  });
}

// ---------- Mobile nav ----------
function setupMobileNav(){
  const burger = $("#navBurger");
  const nav = $("#mainNav");
  burger.addEventListener("click", () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "68px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "var(--bg)";
    nav.style.padding = "16px 24px";
    nav.style.borderBottom = "1px solid var(--line)";
    nav.style.gap = "16px";
  });
  $$("#mainNav a").forEach(a => a.addEventListener("click", () => {
    if (window.innerWidth <= 640) nav.style.display = "none";
  }));
}

// ---------- Contact form (demo only, no storage) ----------
function setupContactForm(){
  const form = $("#contactForm");
  const msg = $("#contactMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent = "Message sent — a coordinator will reply within 24 hours.";
    msg.className = "form-msg success";
    form.reset();
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderActivities();
  populateActivitySelect();
  renderBookings();
  setupTheme();
  setupMobileNav();
  setupContactForm();

  $("#activityGrid").addEventListener("click", handleActivityGridClick);
  $("#bookingForm").addEventListener("submit", handleBookingSubmit);
  $("#bookingsList").addEventListener("click", handleBookingsClick);
  $("#bookingSearch").addEventListener("input", renderBookings);

  setupChipFilter("#filterRow", "filter", renderActivities);
  setupChipFilter("#statusFilterRow", "status", renderBookings);

  // set minimum date to today for the booking date field
  $("#bookingDate").min = new Date().toISOString().split("T")[0];
});
