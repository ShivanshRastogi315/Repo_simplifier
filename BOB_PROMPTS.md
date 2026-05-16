Analyze all the files inside the @dummy-repo folder. For every file, I need a plain English explanation of its business logic.
Please overwrite the file at src/mockData/explainData.json with a JSON array. You MUST use this exact JSON structure, repeating the object for each file you find:
[
  {
    "filepath": "app.js",
    "summary": "This file is the main entry point of the application...",
    "keyFunctions": [
      { "name": "startApp", "purpose": "Initializes the program and checks user login status." }
    ]
  }
]
Output only the raw JSON text into the file. Do not wrap it in markdown backticks.


Analyze the code inside the @dummy-repo folder. I need you to map out how the files connect to each other.
PleaseAnalyze the execution flow of the code in the @dummy-repo folder. I need you to create a step-by-step learning roadmap for a new developer, telling them the exact order they should read the files to understand the project.

Please overwrite the file at src/mockData/roadmapData.json. You MUST use this exact JSON structure:
{
  "roadmapTitle": "Understanding the Core Application Flow",
  "steps": [
    {
      "stepNumber": 1,
      "title": "The Entry Point",
      "targetFile": "app.js",
      "description": "Start here to see how the application initializes."
    }
  ]
}
Output only the raw JSON text into the file. Do not wrap it in markdown backticks.

Analyze the code inside the @dummy-repo folder. I need you to map out how the files connect to each other.
Please overwrite the file at src/mockData/graphData.json with your findings. You MUST use this exact JSON structure:
{
  "nodes": [
    { "id": "app.js", "data": { "label": "app.js" } }
  ],
  "edges": [
    { "id": "e1", "source": "app.js", "target": "auth.js" }
  ]
}

Output only the raw JSON into the file so my React app doesn't break.