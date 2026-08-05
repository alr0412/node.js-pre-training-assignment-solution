const fsPromises = require("node:fs/promises");
const fs = require("node:fs");
const { Transform } = require("stream");
const { pipeline } = require("node:stream/promises");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    // TODO: Initialize properties
    // - this.headers = null;
    // - this.lineNumber = 0;
    // - this.buffer = '';

    this.headers = null;
    this.lineNumber = 0;
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    // TODO: Implement CSV parsing
    // 1. Convert chunk to string and add to buffer
    // 2. Split buffer by newlines
    // 3. Keep last incomplete line in buffer
    // 4. Process complete lines:
    //    - First line: extract headers
    //    - Other lines: create objects with headers as keys
    // 5. Push objects to next stream
    this.buffer += chunk.toString("utf-8");

    const lines = this.buffer.split(/\r?\n/);

    this.buffer = lines.pop();

    for (const line of lines) {
      this.processLine(line);
    }

    callback();
  }

  processLine(line) {
    const values = line.split(/[,;]/);

    this.lineNumber++;
    console.log(`Reading line №${this.lineNumber}`);

    if (this.lineNumber === 1) {
      this.headers = values;
      return;
    }

    const newObject = {};
    this.headers.forEach((header, index) => {
      newObject[header] = values[index];
    });

    this.push(newObject);
  }

  _flush(callback) {
    // TODO: Process any remaining data in buffer
    if (this.buffer) {
      this.processLine(this.buffer);
    }

    callback();
  }
}

/**
 * Data Transformer Stream
 * Applies transformations to each record
 */
class DataTransformer extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
  }

  _transform(record, encoding, callback) {
    // TODO: Apply transformations to record
    // 1. Capitalize name using capitalizeName()
    // 2. Normalize email using normalizeEmail()
    // 3. Format phone using formatPhone()
    // 4. Standardize date using standardizeDate()
    // 5. Capitalize city name
    // 6. Push transformed record
    const transformedRecord = record;

    transformedRecord.name = capitalizeName(record.name);
    transformedRecord.email = normalizeEmail(record.email);
    transformedRecord.phone = formatPhone(record.phone);
    transformedRecord.birthdate = standardizeDate(record.birthdate);
    transformedRecord.city = capitalizeName(record.city);

    this.push(transformedRecord);

    callback();
  }
}

/**
 * CSV Writer Transform Stream
 * Converts objects back to CSV format
 */
class CSVWriter extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    // TODO: Initialize properties
    this.headerWritten = false;
  }

  _transform(record, encoding, callback) {
    // TODO: Convert object to CSV format
    // 1. Write headers on first record
    // 2. Convert record values to CSV line
    // 3. Handle special characters and quotes
    // 4. Push CSV line as string

    if (!this.headerWritten) {
      const headerLine = this.createCSVLine(Object.keys(record));
      this.push(headerLine);
      this.headerWritten = true;
    }

    const valueLine = this.createCSVLine(Object.values(record));
    this.push(valueLine);

    callback();
  }

  createCSVLine(values) {
    return values.join(",") + "\n";
  }
}

/**
 * Helper Functions
 */

/**
 * Capitalize names properly
 * @param {string} name - Name to capitalize
 * @returns {string} Capitalized name
 */
function capitalizeName(name) {
  // TODO: Implement name capitalization
  // 1. Handle empty/null names
  // 2. Split by spaces and hyphens
  // 3. Capitalize each part
  // 4. Join back together
  // Examples:
  // "john doe" → "John Doe"
  // "mary-jane smith" → "Mary-Jane Smith"
  if (!name) {
    return "";
  }
  name = name.toLowerCase();

  const words = name.split(/([- ]+)/);

  const capitalizedWords = words.map((word) => {
    if (word === " " || word === "-") {
      return word;
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join("");
}

/**
 * Normalize email addresses
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email or original if invalid
 */
function normalizeEmail(email) {
  // TODO: Implement email normalization
  // 1. Convert to lowercase
  // 2. Validate basic email format (contains @ and .)
  // 3. Return normalized email or original if invalid
  const emailString = email.toLowerCase();

  if (emailString.includes("@") && emailString.includes(".")) {
    return emailString;
  } else {
    return email;
  }
}

/**
 * Format phone numbers
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone or "INVALID"
 */
function formatPhone(phone) {
  // TODO: Implement phone formatting
  // 1. Extract only digits
  // 2. Check if exactly 10 digits
  // 3. Format as (XXX) XXX-XXXX
  // 4. Return "INVALID" if not valid
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else {
    return "INVALID";
  }
}

/**
 * Standardize date formats
 * @param {string} date - Date to standardize
 * @returns {string} Date in YYYY-MM-DD format
 */
function standardizeDate(date) {
  // TODO: Implement date standardization
  // 1. Handle different input formats:
  //    - MM/DD/YYYY
  //    - YYYY-MM-DD
  //    - YYYY/MM/DD
  // 2. Convert to YYYY-MM-DD format
  // 3. Validate date is real
  // 4. Return original if invalid
  const parts = date.split(/[/-]/);

  if (parts.length !== 3) {
    return date;
  }

  let year, month, day;

  if (parts[0].length === 4) {
    [year, month, day] = parts.map(Number);
  } else {
    [month, day, year] = parts.map(Number);
  }

  const dateObject = new Date(year, month - 1, day);

  if (
    dateObject.getFullYear() === year &&
    dateObject.getMonth() + 1 === month &&
    dateObject.getDate() === day
  ) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return date;
}

/**
 * Main function to process CSV file
 * @param {string} inputPath - Path to input CSV file
 * @param {string} outputPath - Path to output CSV file
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function processCSVFile(inputPath, outputPath) {
  // TODO: Implement the main processing pipeline
  // 1. Create read stream from input file
  // 2. Create transform streams (CSVParser, DataTransformer, CSVWriter)
  // 3. Create write stream to output file
  // 4. Use pipeline() to connect all streams
  // 5. Handle errors appropriately
  // 6. Return promise that resolves when complete

  try {
    // Implementation goes here
    const readStream = fs.createReadStream(inputPath);

    const parser = new CSVParser();
    const transformer = new DataTransformer();
    const writer = new CSVWriter();

    const writeStream = fs.createWriteStream(outputPath);

    return await pipeline(readStream, parser, transformer, writer, writeStream);
  } catch (error) {
    throw new Error(`Failed to process CSV file: ${error.message}`);
  }
}

/**
 * Create sample input data for testing
 */
async function createSampleData(inputContent) {
  // TODO: Create data directory and sample CSV file
  // 1. Create 'data' directory if it doesn't exist
  // 2. Write sample CSV data as specified in task description
  const targetDist = path.join(__dirname, "data");
  const inputFilePath = path.join(targetDist, "users.csv");
  const outputFilePath = path.join(targetDist, "users_transformed.csv");

  try {
    await fsPromises.mkdir(targetDist, { recursive: true });
    await fsPromises.writeFile(inputFilePath, inputContent, "utf-8");
    await fsPromises.writeFile(outputFilePath, "", "utf-8");
  } catch (error) {
    console.error(`Sample data creation failed: ${error.message}`);
  }
}

async function displayMenu() {
  const rl = readline.createInterface({ input, output });
  while (true) {
    const answer = await rl.question("1. Transfrom CSV\n2. Exit\n-");

    switch (answer) {
      case "1": {
        const csvInput = await rl.question(
          "Enter input CSV (\\n for a new line): \n",
        );
        const formattedInput = csvInput.replace(/\\n/g, "\n");
        await createSampleData(formattedInput);

        try {
          await processCSVFile("data/users.csv", "data/users_transformed.csv");

          console.log("✅ File transformation completed successfully!");

          const fileContent = fs.readFileSync(
            "data/users_transformed.csv",
            "utf-8",
          );
          console.log("\n📄 Transformed CSV output:");
          console.log(fileContent);
        } catch (error) {
          console.error("❌ Error processing file:", error.message);
        }
        break;
      }
      case "2":
        rl.close();
        return;
      default:
        console.error("Choose 1 or 2");
        break;
    }
  }
}
// Export classes and functions
module.exports = {
  CSVParser,
  DataTransformer,
  CSVWriter,
  processCSVFile,
  capitalizeName,
  normalizeEmail,
  formatPhone,
  standardizeDate,
  createSampleData,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  (async () => {
    // Create sample data
    await createSampleData(
      "name,email,phone,birthdate,city\njohn doe,JOHN.DOE@EXAMPLE.COM,1234567890,12/25/1990,new york\njane smith,Jane.Smith@Gmail.Com,555-123-4567,1985-03-15,los angeles\nbob johnson,BOB@TEST.COM,invalid-phone,03/22/1992,chicago\nalice brown,alice.brown@company.org,9876543210,1988/07/04,houston",
    );

    // Process the file
    processCSVFile("data/users.csv", "data/users_transformed.csv")
      .then(() => {
        console.log("✅ File transformation completed successfully!");

        // Read and display results
        const output = fs.readFileSync("data/users_transformed.csv", "utf-8");
        console.log("\n📄 Transformed CSV output:");
        console.log(output);
        displayMenu();
      })
      .catch((error) => {
        console.error("❌ Error processing file:", error.message);
      });
  })();
}
