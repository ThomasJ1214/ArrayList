const LEVELS = [
  {
    id: 1,
    title: "Level 1: Summon Your First ArrayList",
    learn: "Import java.util.ArrayList and create a typed list: ArrayList<String> party = new ArrayList<>();",
    codeMustInclude: ["import java.util.ArrayList", "ArrayList<String>", "new ArrayList<"],
    miniPrompt: "Pick the safest declaration:",
    miniChoices: [
      "ArrayList team = new ArrayList();",
      "ArrayList<String> team = new ArrayList<>();",
      "ArrayList team<String> = new ArrayList();"
    ],
    miniAnswer: 1,
    quizQ: "ArrayList is in which package?",
    quizChoices: ["java.io", "java.util", "java.lang"],
    quizAnswer: 1,
    puzzleTemplate: ["ArrayList<String>", "loot", "=", "new", "ArrayList<>();"],
    puzzleBank: ["ArrayList<String>", "loot", "=", "new", "ArrayList<>();", "int", "[]"]
  },
  {
    id: 2,
    title: "Level 2: Add and Collect",
    learn: "Use add() to place new items in the list. ArrayList grows automatically.",
    codeMustInclude: ["add("],
    miniPrompt: "Which method appends an item?",
    miniChoices: ["insert()", "add()", "append()"],
    miniAnswer: 1,
    quizQ: "First index of an ArrayList is:",
    quizChoices: ["1", "0", "-1"],
    quizAnswer: 1,
    puzzleTemplate: ["bag.add(\"potion\")", ";"],
    puzzleBank: ["bag.add(\"potion\")", ";", "bag.push(\"potion\")"]
  },
  {
    id: 3,
    title: "Level 3: Read + Update",
    learn: "get(index) reads values and set(index, value) updates existing values.",
    codeMustInclude: ["get(", "set("],
    miniPrompt: "Choose valid update syntax:",
    miniChoices: ["names.set(1, \"Ada\")", "names.get(1, \"Ada\")", "names.update(1, \"Ada\")"],
    miniAnswer: 0,
    quizQ: "Which can crash if the index is wrong?",
    quizChoices: ["size()", "set(200, \"x\")", "isEmpty()"],
    quizAnswer: 1,
    puzzleTemplate: ["names.set(1,", "\"Ada\")", ";"],
    puzzleBank: ["names.set(1,", "\"Ada\")", ";", "names.get(1,"]
  },
  {
    id: 4,
    title: "Boss Level 4: Remove + Size Battle",
    learn: "Use remove() to drop items and size() to track how many remain.",
    codeMustInclude: ["remove(", "size("],
    miniPrompt: "How do we check item count?",
    miniChoices: ["length", "size()", "count"],
    miniAnswer: 1,
    quizQ: "remove(0) removes:",
    quizChoices: ["First item", "Last item", "Everything"],
    quizAnswer: 0,
    puzzleTemplate: ["monsters.remove(0)", ";", "int left = monsters.size()", ";"],
    puzzleBank: ["monsters.remove(0)", ";", "int left = monsters.size()", "int left = monsters.length", "delete(0)"],
    boss: {
      name: "Bug Hydra",
      hp: 3,
      attacks: [
        { prompt: "Best way to remove first enemy?", options: ["remove(0)", "delete(0)", "drop(0)"], answer: 0 },
        { prompt: "Get remaining count?", options: ["size()", "count()", "length()"], answer: 0 },
        { prompt: "remove(\"slime\") removes by...", options: ["value", "index only", "type"], answer: 0 }
      ]
    }
  },
  {
    id: 5,
    title: "Boss Level 5: Looping Champion",
    learn: "Loop through ArrayList with enhanced-for or indexed-for for processing all values.",
    codeMustInclude: ["for", ":"],
    miniPrompt: "Choose enhanced for loop:",
    miniChoices: ["for (String s : list)", "foreach (s in list)", "for (list as s)"],
    miniAnswer: 0,
    quizQ: "Why ArrayList over array in many games?",
    quizChoices: ["Resizable", "No syntax", "No memory use"],
    quizAnswer: 0,
    puzzleTemplate: ["for (String s : loot)", "{", "System.out.println(s)", ";", "}"],
    puzzleBank: ["for (String s : loot)", "{", "System.out.println(s)", ";", "}", "for loot"] ,
    boss: {
      name: "ArrayList Dragon",
      hp: 4,
      attacks: [
        { prompt: "Enhanced for syntax starts with:", options: ["for (Type x : list)", "for x in list", "loop(list)"], answer: 0 },
        { prompt: "Dynamic growth feature means:", options: ["Resizable", "Fixed forever", "Compile only"], answer: 0 },
        { prompt: "list.get(i) is common in:", options: ["indexed loop", "constructor", "package"], answer: 0 },
        { prompt: "Final strike: valid loop?", options: ["for(int i=0;i<list.size();i++)", "loop i list", "for i to list"], answer: 0 }
      ]
    }
  }
];
