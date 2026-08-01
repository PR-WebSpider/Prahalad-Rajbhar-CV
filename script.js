(function () {
  var tabs = document.querySelectorAll(".doc-switch__btn");
  var panels = {
    cv: document.getElementById("panel-cv"),
    cover: document.getElementById("panel-cover"),
  };
  var switchEl = document.querySelector(".doc-switch");

  function activate(target, opts) {
    opts = opts || {};

    tabs.forEach(function (btn) {
      var isTarget = btn.dataset.target === target;
      btn.classList.toggle("is-active", isTarget);
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    Object.keys(panels).forEach(function (key) {
      var panel = panels[key];
      if (!panel) return;
      if (key === target) {
        panel.hidden = false;
        panel.classList.add("is-active");
      } else {
        panel.hidden = true;
        panel.classList.remove("is-active");
      }
    });

    if (switchEl) switchEl.dataset.active = target;

    if (!opts.silent) {
      history.replaceState(null, "", "#" + target);
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activate(btn.dataset.target);
    });
  });

  // basic left/right arrow support between tabs
  var tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    tabList.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var order = ["cv", "cover"];
      var current = switchEl.dataset.active || "cv";
      var idx = order.indexOf(current);
      idx = e.key === "ArrowRight" ? (idx + 1) % order.length : (idx - 1 + order.length) % order.length;
      activate(order[idx]);
      tabs[idx].focus();
    });
  }

  // deep-link support: #cover opens the cover letter directly
  var initial = (location.hash || "").replace("#", "");
  if (initial === "cover" || initial === "cv") {
    activate(initial, { silent: true });
  } else {
    activate("cv", { silent: true });
  }
})();
