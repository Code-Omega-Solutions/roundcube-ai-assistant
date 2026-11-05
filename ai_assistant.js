(function () {
  var rcmail = window.rcmail;
  if (!rcmail) {
    return;
  }

  var panel;
  var status;
  var instructions;
  var draftOutput;
  var generateButton;
  var insertButton;

  function editorInstance() {
    if (window.tinymce && typeof window.tinymce.get === "function") {
      return window.tinymce.get("composebody");
    }
    if (window.tinyMCE && typeof window.tinyMCE.get === "function") {
      return window.tinyMCE.get("composebody");
    }
    return null;
  }

  function composerText() {
    var editor = editorInstance();
    if (editor) {
      return editor.getContent({ format: "text" });
    }
    var field = document.getElementById("composebody");
    return field ? field.value : "";
  }

  function quoteFromHtml(html) {
    var match = /<blockquote\b/i.exec(html);
    return match ? html.slice(match.index) : "";
  }

  function quoteFromText(text) {
    var markers = [
      /\nOn .{1,200}wrote:\s*\n/im,
      /\n[-=]{3,}\s*Original Message\s*[-=]{3,}\s*\n/i,
      /\nFrom:\s[^\n]+\n/i,
      /\n>/,
    ];
    var index = -1;
    for (var i = 0; i < markers.length; i += 1) {
      var match = markers[i].exec(text);
      if (match && (index === -1 || match.index < index)) {
        index = match.index;
      }
    }
    return index >= 0 ? text.slice(index).replace(/^\n+/, "") : "";
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character];
    });
  }

  function insertDraft() {
    var draft = draftOutput.value.trim();
    if (!draft) {
      return;
    }

    var editor = editorInstance();
    if (editor) {
      var quote = quoteFromHtml(editor.getContent());
      var paragraphs = escapeHtml(draft)
        .split(/\n{2,}/)
        .map(function (paragraph) {
          return "<p>" + paragraph.replace(/\n/g, "<br>") + "</p>";
        })
        .join("");
      editor.setContent(paragraphs + quote);
      editor.save();
    } else {
      var field = document.getElementById("composebody");
      if (!field) {
        return;
      }
      var quote = quoteFromText(field.value);
      field.value = draft + (quote ? "\n\n" + quote : "");
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }

    status.textContent = "Draft inserted. Review it before sending.";
  }

  function generateDraft() {
    var context = composerText();
    var prompt = instructions.value.trim();
    generateButton.disabled = true;
    insertButton.disabled = true;
    status.textContent = "Generating draft…";
    draftOutput.value = "";

    rcmail.http_post("plugin.ai_assistant.draft", {
      context: context,
      instructions: prompt,
    });
  }

  function buildPanel() {
    if (panel) {
      return;
    }

    panel = document.createElement("aside");
    panel.id = "ai-assistant-sidebar";
    panel.className = "ai-assistant-sidebar";
    panel.hidden = true;
    panel.setAttribute("role", "complementary");
    panel.setAttribute("aria-label", "AI email assistant");
    panel.innerHTML = [
      '<div class="ai-assistant-header">',
      "<h3>AI draft</h3>",
      '<button type="button" class="btn btn-sm ai-assistant-close">Close</button>',
      "</div>",
      '<label for="ai-assistant-instructions">Instructions</label>',
      '<textarea id="ai-assistant-instructions" class="form-control" rows="4">Draft a clear, concise reply. Use connected tools such as the document management system when useful.</textarea>',
      '<button type="button" class="btn btn-secondary" id="ai-assistant-generate">Generate draft</button>',
      '<div id="ai-assistant-status" role="status" aria-live="polite"></div>',
      '<label for="ai-assistant-output">Draft</label>',
      '<textarea id="ai-assistant-output" class="form-control" rows="10"></textarea>',
      '<button type="button" class="btn btn-primary" id="ai-assistant-insert" disabled>Insert into reply</button>',
    ].join("");
    var sidebar = document.querySelector("#layout-sidebar .scroller");
    (sidebar || document.body).appendChild(panel);

    instructions = panel.querySelector("#ai-assistant-instructions");
    draftOutput = panel.querySelector("#ai-assistant-output");
    status = panel.querySelector("#ai-assistant-status");
    generateButton = panel.querySelector("#ai-assistant-generate");
    insertButton = panel.querySelector("#ai-assistant-insert");

    panel
      .querySelector(".ai-assistant-close")
      .addEventListener("click", function () {
        panel.hidden = true;
      });
    generateButton.addEventListener("click", generateDraft);
    insertButton.addEventListener("click", insertDraft);
  }

  rcmail.addEventListener("init", function () {
    if (!document.getElementById("composebody")) {
      return;
    }

    rcmail.env.compose_commands = rcmail.env.compose_commands || [];
    if (rcmail.env.compose_commands.indexOf("plugin.ai_assistant.open") < 0) {
      rcmail.env.compose_commands.push("plugin.ai_assistant.open");
    }

    buildPanel();
    rcmail.register_command(
      "plugin.ai_assistant.open",
      function () {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) {
          panel.scrollIntoView({ block: "nearest" });
        }
        instructions.focus();
      },
      true,
    );

    rcmail.addEventListener("plugin.ai_assistant.result", function (result) {
      generateButton.disabled = false;
      if (result.error) {
        status.textContent = result.error;
        return;
      }
      draftOutput.value = result.draft || "";
      insertButton.disabled = !draftOutput.value.trim();
      status.textContent = draftOutput.value
        ? "Draft ready. Review it, then insert."
        : "No draft was returned.";
    });
  });
})();
