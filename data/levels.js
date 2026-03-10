const LEVELS = [
  {
    id: 1,
    title: 'Level 1 · What is an ArrayList?',
    learn: 'ArrayList is a resizable list in java.util. You usually create it with a type, like ArrayList<String>.',
    codeMustInclude: ['import java.util.ArrayList', 'ArrayList<String>', 'new ArrayList<>()'],
    miniPrompt: 'Which declaration uses generics correctly?',
    miniChoices: ['ArrayList names = new ArrayList();', 'ArrayList<String> names = new ArrayList<>();', 'ArrayList names<String> = new ArrayList();'],
    miniAnswer: 1,
    quizQ: 'What makes ArrayList different from a normal array?',
    quizChoices: ['Resizable length', 'No indexes', 'No imports required'],
    quizAnswer: 0,
    puzzleTemplate: ['ArrayList<String>', 'names', '=', 'new ArrayList<>();'],
    puzzleBank: ['ArrayList<String>', 'names', '=', 'new ArrayList<>();', 'String[]']
  },
  {
    id: 2,
    title: 'Level 2 · add() Basics',
    learn: 'Use add(value) to append values at the end of the list.',
    codeMustInclude: ['add('],
    miniPrompt: 'Which line adds a value to the end?',
    miniChoices: ['items.push("A")', 'items.add("A")', 'items.insert("A")'],
    miniAnswer: 1,
    quizQ: 'After adding 3 values, size() returns:',
    quizChoices: ['2', '3', '4'],
    quizAnswer: 1,
    puzzleTemplate: ['fruits.add("apple")', ';'],
    puzzleBank: ['fruits.add("apple")', ';', 'fruits.push("apple")']
  },
  {
    id: 3,
    title: 'Level 3 · get() and set()',
    learn: 'Use get(index) to read a value. Use set(index, value) to replace one.',
    codeMustInclude: ['get(', 'set('],
    miniPrompt: 'Which line updates index 1?',
    miniChoices: ['list.get(1, "Ada")', 'list.set(1, "Ada")', 'list.update(1, "Ada")'],
    miniAnswer: 1,
    quizQ: 'Which can throw IndexOutOfBoundsException?',
    quizChoices: ['set(999, "x") on a short list', 'size()', 'isEmpty()'],
    quizAnswer: 0,
    puzzleTemplate: ['students.set(1,', '"Ada")', ';'],
    puzzleBank: ['students.set(1,', '"Ada")', ';', 'students.get(1,']
  },
  {
    id: 4,
    title: 'Level 4 · remove() and clear()',
    learn: 'remove(index) deletes one value. clear() removes everything.',
    codeMustInclude: ['remove(', 'clear('],
    miniPrompt: 'How do you empty the whole list?',
    miniChoices: ['deleteAll()', 'clear()', 'reset()'],
    miniAnswer: 1,
    quizQ: 'remove(0) removes:',
    quizChoices: ['The first item', 'The last item', 'Nothing'],
    quizAnswer: 0,
    puzzleTemplate: ['tasks.remove(0)', ';', 'tasks.clear()', ';'],
    puzzleBank: ['tasks.remove(0)', ';', 'tasks.clear()', 'tasks.delete(0)']
  },
  {
    id: 5,
    title: 'Level 5 · contains() and indexOf()',
    learn: 'contains(value) checks existence. indexOf(value) gives first matching index or -1.',
    codeMustInclude: ['contains(', 'indexOf('],
    miniPrompt: 'What means "not found" for indexOf?',
    miniChoices: ['0', '-1', 'null'],
    miniAnswer: 1,
    quizQ: 'contains("red") returns:',
    quizChoices: ['boolean', 'int', 'String'],
    quizAnswer: 0,
    puzzleTemplate: ['if (colors.contains("red"))', '{', '}'],
    puzzleBank: ['if (colors.contains("red"))', '{', '}', 'if colors has red']
  },
  {
    id: 6,
    title: 'Boss Level 6 · Looping Arena',
    learn: 'Use loops to process all elements. Enhanced-for is clean for reading.',
    codeMustInclude: ['for', ':'],
    miniPrompt: 'Pick enhanced-for syntax:',
    miniChoices: ['for (String x : list)', 'foreach x in list', 'for list as x'],
    miniAnswer: 0,
    quizQ: 'What does this do: for (String s : list)?',
    quizChoices: ['Iterates every element', 'Sorts automatically', 'Removes duplicates'],
    quizAnswer: 0,
    puzzleTemplate: ['for (String s : loot)', '{', 'System.out.println(s)', ';', '}'],
    puzzleBank: ['for (String s : loot)', '{', 'System.out.println(s)', ';', '}', 'loop loot'],
    boss: {
      name: 'Loop Warden',
      hp: 3,
      attacks: [
        { prompt: 'Which is valid indexed loop condition?', options: ['i < list.size()', 'i <= list.size()', 'i == list.size()'], answer: 0 },
        { prompt: 'Enhanced-for variable type should be:', options: ['Element type', 'int always', 'ArrayList always'], answer: 0 },
        { prompt: 'for-each is best when you need:', options: ['Read values', 'Direct index edits', 'Random insert positions'], answer: 0 }
      ]
    }
  },
  {
    id: 7,
    title: 'Boss Level 7 · Sorting & Utilities',
    learn: 'Collections.sort(list) sorts compatible elements. Great for scoreboards.',
    codeMustInclude: ['Collections.sort(', 'import java.util.Collections'],
    miniPrompt: 'What import is needed for sort?',
    miniChoices: ['java.util.Collections', 'java.sort.Collections', 'java.lang.Collections'],
    miniAnswer: 0,
    quizQ: 'Collections.sort(list) changes the list:',
    quizChoices: ['In place', 'In a copy only', 'Not at all'],
    quizAnswer: 0,
    puzzleTemplate: ['import java.util.Collections', ';', 'Collections.sort(scores)', ';'],
    puzzleBank: ['import java.util.Collections', ';', 'Collections.sort(scores)', 'scores.sortAll()'],
    boss: {
      name: 'Order Titan',
      hp: 3,
      attacks: [
        { prompt: 'Which sorts ascending by default?', options: ['Collections.sort(list)', 'list.order()', 'sort(list, down)'], answer: 0 },
        { prompt: 'sort requires list elements to be:', options: ['Comparable', 'Serializable only', 'Primitive only'], answer: 0 },
        { prompt: 'After sort, where is smallest?', options: ['Index 0', 'Last index', 'Random index'], answer: 0 }
      ]
    }
  },
  {
    id: 8,
    title: 'Final Boss Level 8 · Build a Party System',
    learn: 'Combine add/get/set/remove/loops into one mini challenge, like a game party manager.',
    codeMustInclude: ['add(', 'get(', 'set(', 'remove('],
    miniPrompt: 'Which combo feels like a real app flow?',
    miniChoices: ['add -> get -> set -> remove', 'set -> clear everything every time', 'only size()'],
    miniAnswer: 0,
    quizQ: 'Best reason to use ArrayList in games:',
    quizChoices: ['Dynamic collections of changing size', 'No memory use', 'No syntax required'],
    quizAnswer: 0,
    puzzleTemplate: ['party.add("Mage")', ';', 'party.set(0, "Knight")', ';'],
    puzzleBank: ['party.add("Mage")', ';', 'party.set(0, "Knight")', 'party.replaceAll()'],
    boss: {
      name: 'ArrayList Overlord',
      hp: 4,
      attacks: [
        { prompt: 'Need the number of members:', options: ['party.size()', 'party.length', 'party.count()'], answer: 0 },
        { prompt: 'Replace one member:', options: ['party.set(i, value)', 'party.get(i, value)', 'party.swap(value)'], answer: 0 },
        { prompt: 'Remove by value:', options: ['party.remove("Mage")', 'party.delete("Mage")', 'party.drop("Mage")'], answer: 0 },
        { prompt: 'Victory syntax for creation:', options: ['new ArrayList<>()', 'new ListArray()', 'ArrayList.create()'], answer: 0 }
      ]
    }
  }
];
