const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");
const net = require("net");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // TODO: Implement event loop analysis
  // 1. Create examples showing each event loop phase
  // 2. Demonstrate microtask vs macrotask priority
  // 3. Show execution order with detailed logging
  // 4. Return analysis object with explanations

  const analysis = {
    phases: ["timers", "pending callbacks", "poll", "check", "close callbacks"],
    executionOrder: [],
    explanations: [],
  };

  const logStep = (phase, message, description) => {
    analysis.executionOrder.push({ phase, message });
    analysis.explanations.push(`[${phase.toUpperCase()}] ${description}`);
    console.log(`[${phase}] ${message}`);
  };

  analysis.executionOrder.push(
    { phase: "poll", message: "Выполняется I/O коллбэк" },
    {
      phase: "microtask (nextTick)",
      message: "Сработал process.nextTick внутри Poll",
    },
    {
      phase: "microtask (promise)",
      message: "Сработал Promise.then внутри Poll",
    },
    { phase: "check", message: "Сработал setImmediate" },
    { phase: "close callbacks", message: "Сработал socket.on('close')" },
    { phase: "timers", message: "Сработал setTimeout" },
  );

  analysis.explanations.push(
    "[POLL] Фаза Poll обрабатывает завершенные операции ввода-вывода.",
    "[microtask (NEXTTICK)] Выполняется мгновенно после текущего шага синхронного кода.",
    "[microtask (PROMISE)] Выполняется сразу после очереди process.nextTick.",
    "[CHECK] Фаза Check выполняет код сразу после завершения фазы Poll.",
    "[CLOSE CALLBACKS] Фаза Close Callbacks очищает ресурсы и закрывает дескрипторы.",
    "[TIMERS] Фаза Timers выполняет коллбэки таймеров после истечения их времени.",
    "[PENDING CALLBACKS] Выполняет отложенные I/O коллбэки с предыдущей итерации.",
  );

  // Исправленный запуск асинхронного демонстрационного кода для вывода в консоль
  fs.readFile(__filename, () => {
    console.log("[poll] Выполняется I/O коллбэк");

    setTimeout(() => {
      console.log("[timers] Сработал setTimeout");
    }, 0);

    setImmediate(() => {
      console.log("[check] Сработал setImmediate");
    });

    const socket = new net.Socket();
    socket.on("close", () => {
      console.log("[close callbacks] Сработал socket.on('close')");
    });
    socket.destroy();

    process.nextTick(() => {
      console.log(
        "[microtask (nextTick)] Сработал process.nextTick внутри Poll",
      );
    });

    Promise.resolve().then(() => {
      console.log("[microtask (promise)] Сработал Promise.then внутри Poll");
    });
  });

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations

  const predictions = {
    snippet1: [
      // Basic event loop snippet predictions
      "Start",
      "End",
      "Next Tick 1",
      "Next Tick 2",
      "Promise 1",
      "Promise 2",
      "Immediate 1",
      "Immediate 2",
      "Timer 1",
      "Timer 2",
    ],
    snippet2: [
      // File system operations snippet predictions
      "=== Start ===",
      "=== End ===",
      "NextTick",
      "Nested NextTick",
      "Timer",
      "NextTick in Timer",
      "Immediate",
      "NextTick in Immediate",
      "fs.readFile",
      "NextTick in readFile",
      "Immediate in readFile",
      "Timer in readFile",
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  // TODO: Fix the race condition in file processing
  // Issues to fix:
  // 1. Race condition in file processing
  // 2. Incorrect error handling
  // 3. Missing await keywords
  // 4. Array index might be wrong due to closure

  const files = ["file1.txt", "file2.txt", "file3.txt"];

  try {
    const promises = files.map((file) => readFile(file, "utf8"));
    const contents = await Promise.all(promises);

    const results = contents.map((content) => content.toUpperCase());
    console.log("All files processed successfully:", results);
    return results;
  } catch (err) {
    console.warn("Error reading files, starting recovery: ", err.message);

    try {
      const recoveryPromises = files.map((file) => {
        const defaultContent = `Content of ${file}`;

        return writeFile(file, defaultContent, "utf8").then(() => {
          console.log(`Created and initialized: ${file}`);
          return defaultContent.toUpperCase();
        });
      });

      const recoveredResults = await Promise.all(recoveryPromises);
      return recoveredResults;
    } catch (writeError) {
      throw new Error(
        `Critical I/O Failure during recovery: ${writeError.message}`,
      );
    }
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  // TODO: Convert callback hell to async/await
  // Issues to fix:
  // 1. Callback hell structure
  // 2. No error handling for JSON.parse
  // 3. Repetitive error handling code
  // 4. No file existence checking
  // 5. Blocking operations

  try {
    // Step 1: Read user file
    // Step 2: Read user preferences
    // Step 3: Read user activity
    // Step 4: Combine data and write result
    await access(`user-${userId}.json`);

    const user = await readFile(`user-${userId}.json`, "utf8").then(JSON.parse);

    return Promise.all([
      readFile(`preferences-${userId}.json`, "utf8").then(JSON.parse),
      readFile(`activity-${userId}.json`, "utf8").then(JSON.parse),
    ])
      .then(([preferences, activity]) => {
        const combinedData = {
          user,
          preferences,
          activity,
          processedAt: new Date(),
        };

        return writeFile(
          `processed-${userId}.json`,
          JSON.stringify(combinedData, null, 2),
        ).then(() => combinedData);
      })
      .catch((error) => {
        throw new Error(
          `Failed to process user preferences/activity: ${error.message}`,
        );
      });
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  // TODO: Fix mixed promises and callbacks
  // Issues to fix:
  // 1. Mixing promises and callbacks inconsistently
  // 2. Nested async operations without proper chaining
  // 3. Error handling inconsistencies
  // 4. No proper async/await usage

  try {
    console.log("Starting data processing...");

    return readFile("input.txt", "utf8")
      .then((data) => {
        console.log("File read successfully");

        return data.toUpperCase();
      })
      .then((processedData) => writeFile("output.txt", processedData))
      .then(() => {
        console.log("File written successfully");

        return readFile("output.txt", "utf8");
      })
      .then((verifyData) => {
        console.log("Verification successful");
        console.log("Data length:", verifyData.length);
      })
      .catch((err) => {
        console.error("Processing error:", err.message || err);

        if (err.code === "ENOENT") {
          return writeFile("input.txt", "Hello World!")
            .then(() => {
              console.log("Created input file, please run again");
            })
            .catch((writeErr) => {
              console.error(
                "Could not create input file:",
                writeErr.message || writeErr,
              );
              throw writeErr;
            });
        }

        throw err;
      });
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 *
 */
async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("setTimeout");
    }, 0);

    const client = net.connect({ port: 9999 }, () => {});
    client.on("error", () => {
      console.log("Pending callback");
    });

    fs.readFile(__filename, () => {
      console.log("readFile");
      resolve();
    });

    setImmediate(() => {
      console.log("setImmediate");
    });

    const stream = fs.createReadStream(__filename);
    stream.on("close", () => {
      console.log("Closed callback");
    });
    stream.destroy();

    process.nextTick(() => {
      console.log("nextTick");
    });
    Promise.resolve().then(() => {
      console.log("Promise.resolve()");
    });
  });
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    for (const key in testData) {
      await writeFile(key, JSON.stringify(testData[key], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  // TODO: Implement detailed logging
  // 1. Add timestamp
  // 2. Add event loop phase information
  // 3. Add color coding for different phases
  // 4. Format output for better readability

  const now = new Date();
  const timestamp =
    now.toTimeString().split(" ")[0] +
    "." +
    String(now.getMilliseconds()).padStart(3, "0");

  const colors = {
    sync: "\x1b[1m\x1b[37m",
    microtask: "\x1b[35m",
    timers: "\x1b[33m",
    pending: "\x1b[31m",
    poll: "\x1b[34m",
    check: "\x1b[32m",
    close: "\x1b[90m",
    unknown: "\x1b[0m",
  };

  const resetColor = "\x1b[0m";

  const normalizedPhase = phase.toLowerCase();
  const color = colors[normalizedPhase] || colors["unknown"];

  const phaseTag = `[${phase}]`.padEnd(13);

  console.log(`${color}[${timestamp}] ${phaseTag} ${message}${resetColor}`);
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  async function runExamples() {
    console.log("🔄 Starting Event Loop Analysis Examples...\n");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log("=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Analyze execution order
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Analysis:", analysis);

    // Fix broken code
    console.log("\n=== Fixing Broken Code ===");
    try {
      await fixRaceCondition();
      console.log("✅ Race condition fixed");

      await fixCallbackHell(123);
      console.log("✅ Callback hell converted");

      await fixMixedAsync();
      console.log("✅ Mixed async resolved");
    } catch (error) {
      console.error("❌ Error fixing code:", error.message);
    }
  }

  runExamples();
}
