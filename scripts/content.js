function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const BUTTON_CLASS_NAME = "copy-custom-button";
const COPY_WADD_TEXT = "Copy !wadd";
const COPY_SUMMARY_TEXT = "Copy markdown";
const COPIED_TEXT = "✔ Copied!";
const BUTTON_COLOR = "#c22169";

function addStyles() {
  const head = document.querySelector("head");

  head.innerHTML += `
  <style>
  .${BUTTON_CLASS_NAME} {
    margin-left: 10px;
    color: ${BUTTON_COLOR};
    border: 1px solid ${BUTTON_COLOR};
    background: none;
    box-shadow: none;
    border-radius: 4px;
    transition: color 0.3s ease-in-out;
  }
  
  .${BUTTON_CLASS_NAME}:hover {
    background: #f5f0f2;
    border: 1px solid ${BUTTON_COLOR};
  }
  
  .${BUTTON_CLASS_NAME}:focus {
    outline: none;
    box-shadow: none;
  }
  
  .${BUTTON_CLASS_NAME}.success-feedback {
    color: #4CAF50;
    border: 1px solid #4CAF50;
  }
  </style>
  `;
}

const getCopyToClipboardCallback = (text) =>
  async function () {
    const _this = this;
    const textToCopy = text instanceof Function ? await text() : text;

    navigator.clipboard.writeText(textToCopy);

    const previousText = _this.innerText;
    _this.blur();
    _this.innerText = COPIED_TEXT;
    _this.className = BUTTON_CLASS_NAME + " success-feedback";

    setTimeout(() => {
      _this.innerText = previousText;
      _this.className = BUTTON_CLASS_NAME;
    }, 1500);
  };

function createButton(content, onClick) {
  const button = document.createElement("button");
  button.onclick = onClick;
  button.innerText = content;
  button.className = BUTTON_CLASS_NAME;
  return button;
}

function addCopyWaddButton() {
  const header = document.querySelector(
    "#UQ0_10 > div.phui-formation-view-content > div.phui-two-column-view.phui-side-column-right.with-subheader > div > div.phui-two-column-header > div > h1 > div > div.phui-header-col2 > span"
  );

  if (header) {
    const button = createButton(
      COPY_WADD_TEXT,
      getCopyToClipboardCallback(`!wadd ${window.location.href}`)
    );
    header.appendChild(button);
  }
}

async function extractMarkdown() {
  const timelineItems = Array.from(
    document.querySelectorAll(
      ".phui-timeline-title.phui-timeline-title-with-icon"
    )
  );
  const editSummaryLineItem = timelineItems.find((item) =>
    item.textContent.includes("edited the summary of this revision")
  );
  const detailsLinks = Array.from(
    editSummaryLineItem.querySelectorAll("a")
  ).filter((link) => link.textContent.includes("Show Details"));

  const detailsLink = detailsLinks[detailsLinks.length - 1];
  detailsLink.click();

  await sleep(400);

  const newButton = [...document.querySelectorAll(".phui-list-item-href")].find(
    (t) => t.textContent === "New"
  );
  newButton.click();

  await sleep(100);
  const text = document.querySelector(".prose-diff").textContent;

  const doneButton = document.querySelector(
    "body > div.jx-client-dialog > form > div.aphront-dialog-tail.grouped > a"
  );
  doneButton.click();

  return text;
}

function addCopySummary() {
  const summaryHeader = document.querySelector(
    "#UQ0_10 > div.phui-formation-view-content > div.phui-two-column-view.phui-side-column-right.with-subheader > div > div:nth-child(3) > div > div.phui-main-column > div:nth-child(1) > div.phui-property-list-section > div.phui-property-list-section-header"
  );
  const button = createButton(
    COPY_SUMMARY_TEXT,
    getCopyToClipboardCallback(extractMarkdown)
  );
  summaryHeader.appendChild(button);
}

addStyles();
addCopyWaddButton();
addCopySummary();
