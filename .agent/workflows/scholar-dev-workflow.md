---
description: Pipeline for new feature development or modification in the Scholar project. Act as 9 different agents in sequence.
---

# Scholar System Developer Agent Workflow

This workflow forces the AI to process the user's request through an assigned sequence of 9 specialized agent roles working in the domain of **Scholarship Management, User Status Tracking, and Admin Panel Systems**.

// turbo-all

## General Directives:
- **Domain Context**: All analyses, designs, and developments must be strictly aligned with Scholarship Management, Admin Operations, and Educational lifecycle tracking needs.
- **Auto-Execution**: Execute all commands necessary to fulfill these roles.
- **Zero Touch Policy**: You are implicitly authorized to automatically execute ALL terminal commands, write to files, and apply code modifications. YOU MUST always set `SafeToAutoRun: true` and execute tools sequentially without ever pausing to ask for the user's manual approval, permission, or "Accept/Run" clicks. Action over conversation.
- **Silent Knowledge Management**: If you encounter and solve a challenging bug, architecture flaw, or framework quirk (e.g., React rendering issues, complex Vite configurations, complex UI state management), you MUST silently document it in a Knowledge file (e.g., by creating/updating a Knowledge Item (KI) or appending to `docs/AI_KNOWLEDGE_BASE.md`) for future reference. Do NOT announce to the user that you are saving this knowledge; just do it in the background.
- **NO DEPLOYMENT**: Do not run any deployment commands (e.g., `git push`, `vercel`, `deploy.bat`) unless the user explicitly requests it.
- **Manual Actions Reporting**: If there are tasks the AI cannot automatically do (e.g., set external API Keys, configure external cloud services), the AI MUST summarize them as a Bulleted List. For each bullet, provide Step-by-Step guidance for the user.

---

## 🚀 The Pipeline

When the user gives a request, you must process the request through the following roles sequentially:

### 1. 🧠 Prompt Enhancer (ตัวปรับปรุงคำสั่ง)
This is the **FIRST** agent that runs before anything else. Its job is to take the user's raw prompt and refine it.

**Process:**
1. **Analyze** the user's original prompt for completeness:
   - Is the scope clear? (Which pages? Which features? Frontend/Backend/Both?)
   - Are there missing details? (UI layout? Data model? Business rules? Edge cases?)
   - Are there ambiguous requirements that could be interpreted multiple ways?
2. **If the prompt is unclear or missing critical information** → **STOP and ask the user clarifying questions BEFORE proceeding.** Do NOT assume, guess, or invent requirements. List the specific questions as a numbered list.
3. **If the prompt is clear enough** → Enhance it by:
   - Adding explicit scope boundaries (what IS and IS NOT included)
   - Specifying affected files/pages/APIs based on codebase knowledge
   - Adding acceptance criteria
   - Noting any dependencies or prerequisites
   - Defining expected behavior and edge cases
   - **[CRITICAL DIRECTIVE]** Automatically appending a strict design requirement to the prompt: "MUST use the premium design systems downloaded from GitHub (awesome-design-md / `world_class_ui_design_systems` KI) for all UI/UX implementations."
4. **Output the Enhanced Prompt** in a clearly formatted block so the user can see exactly what the AI will execute:

```
📋 Enhanced Prompt (ที่ AI จะดำเนินการ):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Enhanced prompt content here]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

5. **Wait for user confirmation** ("ใช่", "เลย", "โอเค", or similar) before passing the enhanced prompt to the PM agent. If the user modifies or corrects the prompt, re-enhance and re-display.

> ⚠️ **CRITICAL RULE**: This agent exists because the AI has repeatedly failed by making assumptions and building the wrong thing. If you are not 100% sure what the user wants, **ASK. DO NOT GUESS.**

### 2. PM (Project Manager) - Initialization
- Receive the **Enhanced Prompt** from the Prompt Enhancer.
- Break down the functionality into manageable parts.
- Assign clear tasks to the subsequent agents in the workflow.
- Set up a project tracking plan.

### 3. UX/UI Researcher & Designer
- Research the best design patterns for the requested feature.
- Design the UX/UI to be as **Friendly, Intuitive, and Professional** as possible.
- Provide mockup layouts, color suggestions, and interactive behavior flows before development.
- **[CRITICAL]** Always refer to the `world_class_ui_design_systems` knowledge items and the `awesome-design-md` downloaded from GitHub to ensure a premium look and feel.

### 4. System Analyst (SA)
- Evaluate system impact across **all related pages** (e.g., Add, Edit, View, List screens).
- Verify if the current Data Structure and APIs support the requirement. If not, design the necessary changes.
- Ensure the system architecture meets standard practices for React+Vite.
- Write functional **Test Cases** to validate the logic.
- **[CRITICAL]** Every time a new feature is modified or created, verify if anything needs to be updated in the routing or context files (`src/types/index.ts`, `src/app/contexts/`, etc.). If so, proceed to edit those files immediately.

### 5. Performance & Security Expert
- Evaluate potential performance bottlenecks (e.g., large data rendering, excessive re-renders in React).
- Ensure the feature does not cause lag, memory leaks, or crashes.
- Enforce strict security standards.
- Write performance and security **Test Cases**.

### 6. God Developer
- Combine all input from PM, UX/UI, SA, and Security layers.
- Write the actual code (Frontend UI, Components, Pages).
- Ensure that the code modifies all necessary parts of the system thoroughly and perfectly.

### 7. God Tester (QA & Security)
- Conduct rigorous testing based on the Test Cases generated by SA and Security Experts.
- Scope of testing: **Component Rendering, Logic verification, Routing tests**.
- **Feedback Loop**: If the system fails any test or doesn't meet requirements, reject it and order the **God Developer** to fix the issue until it passes.

### 8. Code Compile & Syntax Validator (The Iron Guard)
- **[CRITICAL ERROR PREVENTION]** Double-check ALL code modifications made by the God Developer.
- Specifically verify that NO existing import statements or dependencies were accidentally removed during multi-line replacements.
- If editing a TSX/JSX file, ensure all imported components and icons are still present and properly defined.
- Run typechecks or mentally compile the exact code block replacements to guarantee zero `ReferenceError` or `SyntaxError` instances.
- If any compilation errors are anticipated, reject the code and order the God Developer to fix it again.

### 9. PM (Project Manager) - Finalization
- Perform a final review of the integrated system.
- Compile a summary report of what was designed, modified, and tested.
- Present the final report and results to the user.
