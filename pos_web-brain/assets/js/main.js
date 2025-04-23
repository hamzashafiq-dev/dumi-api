document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  // tabs
  function handleTabSwitch(containerId) {
    const tabs = document.querySelectorAll(`#${containerId} .tab`);
    const tabPanels = document.querySelectorAll(`#${containerId} .tab-panel`);

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const targetId = tab.getAttribute("data-nxt-toggle");
        const targetPanel = document.getElementById(targetId);
        tabs.forEach((t) => t.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));
        tab.classList.add("active");
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  }
  // Initialize containers
  handleTabSwitch("product_card_content");
  handleTabSwitch("offcanvas_content");
  handleTabSwitch("order_table_content");

  // Open modal
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", function () {
      const targetModal = this.getAttribute("data-target");
      document.getElementById(targetModal + "Overlay").classList.add("active");
      document.getElementById(targetModal).classList.add("active");
    });
  });

  // Close modal
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", function () {
      this.closest(".modal-overlay").classList.remove("active");
      this.closest(".modal").classList.remove("active");
    });
  });

  // Close modal by clicking outside the modal
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.classList.remove("active");
        overlay.querySelector(".modal").classList.remove("active");
      }
    });
  });

  // sidebar
  const sidebarShow = document.getElementById("sidebarShow");

  sidebarShow.addEventListener("click", function () {
    body.classList.toggle("sidebar-show");
  });

  // offcanvas
  const addToBucketButton = document.getElementById("addToBucket");
  if (addToBucketButton) {
    addToBucketButton.addEventListener("click", function () {
      body.classList.add("open");
    });
  }

  // order place
  const orderPlace = document.querySelectorAll(".available-card");

  orderPlace.forEach((el) => {
    if (el) {
      el.addEventListener("click", function () {
        body.classList.add("open-order");
      });
    }
  });

  document.querySelectorAll(".order-table-offcanvas").forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        body.classList.remove("open-order");
      }
    });
  });

  body.addEventListener("click", function (e) {
    const offcanvas = document.querySelector(".order-table-offcanvas");
    if (offcanvas) {
      if (
        !offcanvas.contains(e.target) &&
        !e.target.closest(".available-card")
      ) {
        body.classList.remove("open-order");
      }
    }
  });

  const userEdit = document.getElementById("user_edit");
  if (userEdit) {
    userEdit.addEventListener("click", function () {
      body.classList.toggle("bucket-edit");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // link attached
  const menuItems = document.querySelectorAll(".list-link");
  const currentPath = window.location.pathname;
  const activeLink = localStorage.getItem("activeLink");

  menuItems.forEach((item) => item.classList.remove("active"));
  if (activeLink) {
    menuItems.forEach((item) => {
      if (item.getAttribute("href") === activeLink) {
        item.classList.add("active");
      }
    });
  } else {
    menuItems.forEach((item) => {
      if (item.getAttribute("href") === currentPath) {
        item.classList.add("active");
        localStorage.setItem("activeLink", currentPath);
      }
    });
  }
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      localStorage.setItem("activeLink", item.getAttribute("href"));
    });
  });

  // link list table bg
  const checkElements = document.querySelectorAll(".list-check");

  checkElements.forEach((item) => {
    item.addEventListener("click", function () {
      const parent = this.parentElement;
      parent.parentElement.classList.toggle("active");
    });
  });
});

// increment decrement
document.addEventListener("click", function (e) {
  let input = document.getElementById("quantity");
  let decrementBtn = document.getElementById("decrement");
  let value = parseInt(input.value) || 1;
  if (e.target.closest("#increment")) input.value = value + 1;
  if (e.target.closest("#decrement") && value > 1) input.value = value - 1;
  decrementBtn.classList.toggle("btn-primary", input.value > 1);
});

// login page js
document.addEventListener("DOMContentLoaded", function () {

  const swiper = new Swiper(".swipe-login", {
    loop: true,

    pagination: {
      el: ".swiper-pagination",
    },

    autoplay: {
      delay: 2000,
    },
  });
});


let pin = [];
  const dots = document.querySelectorAll(".dot");
  const signInBtn = document.getElementById("signInBtn");

  function enterPin(number) {
    if (pin.length < 6) {
      pin.push(number);
      updateDots();
    }
  }

  function deletePin() {
    pin.pop();
    updateDots();
  }

  function clearAll() {
    pin = [];
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index < pin.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
    });

    signInBtn.disabled = pin.length !== 6;
  }