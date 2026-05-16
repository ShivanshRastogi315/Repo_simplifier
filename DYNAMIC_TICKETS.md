# 🎫 Dynamic "Good First Issue" Ticket Generator

## Overview

The Repo_simplifier now includes an **intelligent ticket generation system** that automatically analyzes your codebase and creates tailored "Good First Issue" onboarding tasks based on **actual code problems** it discovers.

## How It Works

### 1. Automatic Code Analysis

When you run `node generateData.js`, the system:

1. **Scans all files** in `src/dummy-repo/`
2. **Analyzes code patterns** using regex and structural inspection
3. **Detects real issues** like:
   - Duplicate files (e.g., `Login.jsx` and `Login (2).jsx`)
   - Improper naming conventions (spaces, special characters)
   - Missing error handling in fetch calls
   - Lack of documentation (JSDoc comments)

### 2. Dynamic Ticket Generation

The `generateTicketData()` function in `generateData.js` creates a comprehensive ticket with:

- **Ticket ID**: Auto-generated (e.g., `AEGIS-611`)
- **Title**: Descriptive and specific to the issue found
- **Difficulty Level**: Easy, Medium, or Hard
- **Context**: Explains what the issue is and why it matters
- **Instructions**: Step-by-step guide to fix the issue
- **Files to Investigate**: List of relevant files
- **Acceptance Criteria**: Measurable completion conditions
- **Knowledge Check**: 5 repository-specific questions

### 3. Priority System

The system prioritizes issues in this order:

1. **Duplicate Files** (highest priority) - Confuses visualization
2. **Naming Conventions** - Violates best practices
3. **Error Handling** - Improves code robustness
4. **Documentation** (fallback) - Enhances maintainability

## Generated Ticket Structure

```json
{
  "ticketId": "AEGIS-611",
  "title": "Remove Duplicate Login (2) Component",
  "difficulty": "Easy",
  "type": "duplicate_file",
  "context": "The dummy-repo contains a duplicate file...",
  "instructions": "Delete the file \"src/dummy-repo/Login.jsx\"...",
  "filesToInvestigate": ["Login.jsx", "Login (2).jsx", "generateData.js"],
  "acceptanceCriteria": [
    "The file has been deleted",
    "Mock data has been regenerated"
  ],
  "knowledgeCheck": [
    {
      "question": "What is the primary purpose of...",
      "hint": "Check line 15 of generateData.js"
    }
  ]
}
```

## Usage

### For Repository Maintainers

1. Add your codebase files to `src/dummy-repo/`
2. Run the generator:
   ```bash
   cd Repo_simplifier
   node generateData.js
   ```
3. The system automatically creates `ticketData.json` with a tailored issue

### For New Developers

1. Start the application:
   ```bash
   npm start
   ```
2. Click on any file in the architecture graph
3. In the right panel, click **"Synthesize Starter Ticket"**
4. View your personalized onboarding task with:
   - Clear context and instructions
   - Files to investigate
   - Acceptance criteria
   - Knowledge check questions

## Key Features

### ✅ Repository-Specific

- Questions reference **actual functions** from your code
- File paths point to **real files** in the repository
- Issues are based on **genuine code problems**

### ✅ Educational

- Helps new developers understand:
  - Data flow (dummy-repo → generateData.js → JSON → React)
  - Architecture patterns (ReactFlow, state management)
  - Best practices (naming, error handling, documentation)

### ✅ Adaptive

- Different repositories generate different tickets
- Priority system ensures most important issues surface first
- Fallback to generic tasks if no issues found

## Example Tickets Generated

### Duplicate File Detection
```
Title: Remove Duplicate Login (2) Component
Type: duplicate_file
Difficulty: Easy
```

### Naming Convention
```
Title: Fix File Naming Convention for Login (2).jsx
Type: naming_convention
Difficulty: Easy
```

### Error Handling
```
Title: Add Error Handling to API Calls in Dashboard.jsx
Type: error_handling
Difficulty: Medium
```

### Documentation
```
Title: Add JSDoc Comments to Hangar.jsx
Type: code_review
Difficulty: Easy
```

## Technical Implementation

### Core Functions

**`generateTicketData(files, explainData)`**
- Analyzes all files for common issues
- Returns the highest-priority issue as a ticket

**`generateKnowledgeQuestions(files, explainData, focusFile)`**
- Creates 5 repository-specific questions
- References actual functions, files, and architecture

### Integration Points

1. **generateData.js** (line 70-230): Ticket generation logic
2. **FileSummaries.jsx** (line 98-150): Enhanced UI display
3. **ticketData.json**: Auto-generated ticket storage

## Benefits

### For Onboarding
- New developers get **real tasks** instead of generic tutorials
- Learn by fixing **actual code issues**
- Understand the codebase through **hands-on work**

### For Code Quality
- Automatically surfaces **technical debt**
- Encourages **best practices** (naming, error handling, docs)
- Creates a **feedback loop** for continuous improvement

### For Maintainers
- **Zero manual effort** - tickets generate automatically
- **Always relevant** - based on current codebase state
- **Scalable** - works for any repository structure

## Future Enhancements

Potential improvements:
- Detect unused imports
- Find missing PropTypes/TypeScript types
- Identify performance bottlenecks
- Suggest refactoring opportunities
- Generate multiple tickets (backlog)

## Troubleshooting

**Issue**: Ticket shows generic content
- **Solution**: Ensure files exist in `src/dummy-repo/` and run `node generateData.js`

**Issue**: Knowledge questions seem irrelevant
- **Solution**: The questions are based on actual code - verify the files contain the referenced functions

**Issue**: No ticket appears in UI
- **Solution**: Check that `ticketData.json` exists in `src/mockData/` and contains valid JSON

## Contributing

To add new issue detection patterns:

1. Edit `generateTicketData()` in `generateData.js`
2. Add your detection logic (e.g., check for console.logs)
3. Create a ticket object with all required fields
4. Add to the `issues` array with appropriate priority

---

**Built with ❤️ for better developer onboarding**