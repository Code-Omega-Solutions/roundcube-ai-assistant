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
  var englishFallback = {
    ai_draft_button: "AI draft",
    ai_assistant_label: "AI email assistant",
    ai_assistant_heading: "AI draft",
    close: "Close",
    instructions: "Instructions",
    default_instructions: "Draft a clear, concise email body. If the context contains an incoming email, draft a suitable reply; otherwise, write a new email based on my instructions.",
    generate_draft: "Generate draft",
    draft_output: "Draft",
    insert_into_reply: "Insert into reply",
    status_inserted: "Draft inserted. Review it before sending.",
    status_generating: "Generating draft…",
    status_ready: "Draft ready. Review it, then insert.",
    status_no_draft: "No draft was returned.",
    error_too_long: "The message or instructions are too long.",
    error_not_configured: "The AI service is not configured.",
    error_request_failed: "The AI request failed. Check the Open WebUI connection and model configuration.",
  };
  var errorLabels = {
    too_long: "error_too_long",
    not_configured: "error_not_configured",
    request_failed: "error_request_failed",
  };

  function localizedText(key) {
    var translated =
      typeof rcmail.gettext === "function"
        ? rcmail.gettext(key, "ai_assistant")
        : "";
    if (
      typeof translated === "string" &&
      translated.trim() !== "" &&
      translated !== key &&
      translated !== "[" + key + "]" &&
      translated !== "[ai_assistant." + key + "]"
    ) {
      return translated;
    }

    return englishFallback[key] || englishFallback.error_request_failed;
  }

  function resultErrorText(error) {
    return localizedText(errorLabels[error] || "error_request_failed");
  }

  function promptForInstructions(value) {
    return value.trim() || englishFallback.default_instructions;
  }

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

    status.textContent = localizedText("status_inserted");
  }

  function generateDraft() {
    var context = composerText();
    var prompt = promptForInstructions(instructions.value);
    generateButton.disabled = true;
    insertButton.disabled = true;
    status.textContent = localizedText("status_generating");
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
    panel.setAttribute("aria-label", localizedText("ai_assistant_label"));
    panel.innerHTML = [
      '<div class="ai-assistant-header">',
      '<h3 class="ai-assistant-heading"></h3>',
      '<button type="button" class="btn btn-sm ai-assistant-close"></button>',
      "</div>",
      '<label for="ai-assistant-instructions" class="ai-assistant-instructions-label"></label>',
      '<textarea id="ai-assistant-instructions" class="form-control" rows="4"></textarea>',
      '<button type="button" class="btn btn-secondary" id="ai-assistant-generate"></button>',
      '<div id="ai-assistant-status" role="status" aria-live="polite"></div>',
      '<label for="ai-assistant-output" class="ai-assistant-output-label"></label>',
      '<textarea id="ai-assistant-output" class="form-control" rows="10"></textarea>',
      '<button type="button" class="btn btn-primary" id="ai-assistant-insert" disabled></button>',
    ].join("");
    var sidebar = document.querySelector("#layout-sidebar .scroller");
    (sidebar || document.body).appendChild(panel);

    instructions = panel.querySelector("#ai-assistant-instructions");
    draftOutput = panel.querySelector("#ai-assistant-output");
    status = panel.querySelector("#ai-assistant-status");
    generateButton = panel.querySelector("#ai-assistant-generate");
    insertButton = panel.querySelector("#ai-assistant-insert");
    panel.querySelector(".ai-assistant-heading").textContent =
      localizedText("ai_assistant_heading");
    panel.querySelector(".ai-assistant-close").textContent =
      localizedText("close");
    panel.querySelector(".ai-assistant-instructions-label").textContent =
      localizedText("instructions");
    instructions.placeholder = localizedText("default_instructions");
    generateButton.textContent = localizedText("generate_draft");
    panel.querySelector(".ai-assistant-output-label").textContent =
      localizedText("draft_output");
    insertButton.textContent = localizedText("insert_into_reply");

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
        status.textContent = resultErrorText(result.error);
        return;
      }
      draftOutput.value = result.draft || "";
      insertButton.disabled = !draftOutput.value.trim();
      status.textContent = draftOutput.value
        ? localizedText("status_ready")
        : localizedText("status_no_draft");
    });
  });
})();
