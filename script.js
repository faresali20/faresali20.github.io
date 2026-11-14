const workflowItems = [
  { id: "review", text: "مراجعة الفكرة والملفات" },
  { id: "timeline", text: "ترتيب اللقطات على الخط الزمني" },
  { id: "edit", text: "المونتاج وإضافة الصوت" },
  { id: "thumbnail", text: "تجهيز الصورة المصغرة" },
  { id: "export", text: "مراجعة وتصدير الفيديو" }
];

const storageKey = "fares-editing-workflow-v1";
const workflowList = document.querySelector("#workflow-list");
const progressBar = document.querySelector("#workflow-progress");
const progressCount = document.querySelector("#workflow-count");
const workflowStatus = document.querySelector("#workflow-status");
const resetButton = document.querySelector("#reset-workflow");
const completedItems = new Set();

if (workflowList && progressBar && progressCount && workflowStatus && resetButton) {
  let storageAvailable = true;

  try {
    const savedItems = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(savedItems)) {
      throw new Error("Saved workflow data is not a list.");
    }

    savedItems
      .filter((id) => workflowItems.some((item) => item.id === id))
      .forEach((id) => completedItems.add(id));
  } catch (error) {
    storageAvailable = false;
    workflowStatus.textContent = "تعذّر تحميل التقدم المحفوظ؛ يمكنك استخدام القائمة خلال هذه الزيارة.";
  }

  function renderWorkflow() {
    workflowList.replaceChildren();

    workflowItems.forEach((item) => {
      const listItem = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = completedItems.has(item.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          completedItems.add(item.id);
        } else {
          completedItems.delete(item.id);
        }

        if (storageAvailable) {
          try {
            localStorage.setItem(storageKey, JSON.stringify([...completedItems]));
          } catch (error) {
            storageAvailable = false;
            workflowStatus.textContent = "تعذّر حفظ التقدم في هذا المتصفح؛ التغييرات الحالية ما زالت ظاهرة.";
          }
        }

        renderWorkflow();
      });

      label.append(checkbox, document.createTextNode(item.text));
      listItem.append(label);
      workflowList.append(listItem);
    });

    const completedCount = completedItems.size;
    progressBar.value = completedCount;
    progressCount.textContent = `${completedCount.toLocaleString("ar-EG")} من ${workflowItems.length.toLocaleString("ar-EG")}`;
    resetButton.disabled = completedCount === 0;

    if (completedCount === workflowItems.length) {
      workflowStatus.textContent = "ممتاز! اكتملت كل خطوات تجهيز الفيديو.";
    } else if (storageAvailable) {
      workflowStatus.textContent = "حدّد الخطوات التي أنجزتها.";
    }
  }

  resetButton.addEventListener("click", () => {
    completedItems.clear();
    if (storageAvailable) {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        storageAvailable = false;
        workflowStatus.textContent = "تعذّر مسح التقدم المحفوظ؛ أُعيد ضبط القائمة الحالية فقط.";
      }
    }
    renderWorkflow();
  });

  renderWorkflow();
}

const revealTargets = document.querySelectorAll(
  ".hero-text, .hero-image-wrap, .about-copy, .highlight-item, .section-heading, " +
  ".portfolio-card, .text-link, .code-project-intro, .workflow-app, .timeline-item, " +
  ".skill-card, .education-card, .contact-section > *"
);

if (revealTargets.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -36px 0px" });

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    revealObserver.observe(target);
  });

  document.body.classList.add("reveal-ready");
}

const sectionLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const navigationSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);

if (navigationSections.length && "IntersectionObserver" in window) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      sectionLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  navigationSections.forEach((section) => activeSectionObserver.observe(section));
}
