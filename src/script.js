/* ================================================
   Brewed & Bold — script.js
   Features:
   - Cart (add, remove, total, count badge)
   - Menu filter (All / Hot / Cold / Specialty)
   - Toast notifications
   - Cart modal open/close
   - Checkout confirmation
   - Scroll-in animation for cards
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── STATE ─────────────────────────────────── */
  let cart = [];

  /* ─── ELEMENT REFS ──────────────────────────── */
  const cartBtn      = document.getElementById("cartBtn");
  const cartCount    = document.getElementById("cartCount");
  const cartOverlay  = document.getElementById("cartOverlay");
  const closeCart    = document.getElementById("closeCart");
  const cartList     = document.getElementById("cartList");
  const cartTotal    = document.getElementById("cartTotal");
  const checkoutBtn  = document.getElementById("checkoutBtn");
  const toast        = document.getElementById("toast");
  const filterBtns   = document.querySelectorAll(".filter-btn");
  const cards        = document.querySelectorAll(".menu-grid .card");
  const addBtns      = document.querySelectorAll(".add-btn");

  /* ─── CART TOGGLE ───────────────────────────── */
  cartBtn.addEventListener("click", () => cartOverlay.classList.add("open"));
  closeCart.addEventListener("click", () => cartOverlay.classList.remove("open"));
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove("open");
  });

  /* ─── ADD TO CART ───────────────────────────── */
  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const existing = cart.find((item) => item.name === name);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      renderCart();
      showToast(`☕ ${name} added to cart!`);

      // Button pulse feedback
      btn.textContent = "✓ Added";
      btn.style.background = "#2d6a4f";
      setTimeout(() => {
        btn.textContent = "+ Add";
        btn.style.background = "";
      }, 1200);
    });
  });

  /* ─── RENDER CART ───────────────────────────── */
  function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
      cartList.innerHTML = `<li class="empty-msg">Your cart is empty.</li>`;
    } else {
      cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.name} × ${item.qty}</span>
          <span>₱${(item.price * item.qty).toFixed(2)}</span>
          <button class="remove-item" data-index="${index}">✕</button>
        `;
        cartList.appendChild(li);
      });

      // Remove individual items
      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.index);
          cart.splice(i, 1);
          renderCart();
        });
      });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotal.textContent = `₱${total.toFixed(2)}`;

    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
    cartCount.style.transform = "scale(1.4)";
    setTimeout(() => (cartCount.style.transform = "scale(1)"), 200);
  }

  /* ─── CHECKOUT ──────────────────────────────── */
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("🛒 Your cart is empty!");
      return;
    }
    cartOverlay.classList.remove("open");
    cart = [];
    renderCart();
    showToast("🎉 Order placed! See you soon.");
  });

  /* ─── MENU FILTER ───────────────────────────── */
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          card.offsetHeight; // reflow
          card.style.animation = "fadeInUp 0.35s ease both";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ─── TOAST ─────────────────────────────────── */
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ─── SCROLL REVEAL ─────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    observer.observe(card);
  });

  /* ─── INJECT FADE KEYFRAME ───────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ─── INITIAL RENDER ────────────────────────── */
  renderCart();
});