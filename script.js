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
