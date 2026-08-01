const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

/**
 * Custom Event Emitter for a messaging system
 * Extend Node.js EventEmitter to create a pub-sub messaging system
 */
class MessageSystem extends EventEmitter {
  constructor() {
    super();
    // Initialize the messaging system
    this.messages = [];
    this.users = new Set([{ username: "AdminUser", role: "admin" }]);
    this.messageId = 1;

    // Initialize logging stream
    this.logPath = path.join(__dirname, "messages.log");
    this.logStream = fs.createWriteStream(this.logPath, { flags: "a" });
    this.on("message", (message) => {
      this.logStream.write(
        `[${message.type.toUpperCase()}] ${message.content}\n`,
      );
    });

    // Rate limiter window
    this.RATE_LIMIT_WINDOW = 5000;
    this.MAX_MESSAGES_IN_WINDOW = 8;
    this.lastMessagesCount = 0;
    this.windowStartTime = Date.now();
  }

  /**
   * Send a message to the system
   *
   * Create a message object with id, type, content, timestamp, sender
   * Add message to messages array
   * Keep only last 100 messages for memory management
   * Emit the message event and specific type event
   *
   * @param {string} type - Message type ('message', 'notification', 'alert')
   * @param {string} content - Message content
   * @param {string} sender - Optional sender name
   * @returns {object} Created message object
   */
  sendMessage(type, content, sender = "System") {
    // Rate limit check
    const currentTime = Date.now();

    if (currentTime - this.windowStartTime >= this.RATE_LIMIT_WINDOW) {
      this.windowStartTime = currentTime;
      this.lastMessagesCount = 0;
    }

    if (this.lastMessagesCount >= this.MAX_MESSAGES_IN_WINDOW) {
      const timeLeft = (
        (this.RATE_LIMIT_WINDOW - (currentTime - this.windowStartTime)) /
        1000
      ).toFixed(1);
      console.error(`Too many requests. Please wait ${timeLeft}s.`);
      return;
    }

    this.lastMessagesCount++;

    // Message sending
    const newMessage = {
      id: this.messageId,
      type: type,
      content: content,
      timestamp: new Date().toISOString(),
      sender: sender,
    };

    this.messages.push(newMessage);
    this.messageId++;

    if (this.messages.length > 100) {
      this.messages.shift();
    }

    this.emit("message", newMessage);
    if (newMessage.type !== "message") {
      this.emit(`${newMessage.type}`, newMessage);
    }
  }

  /**
   * Subscribe to all message types
   *
   * Listen to all messages using the 'message' event
   *
   * @param {function} callback - Callback function to handle messages
   */
  subscribeToMessages(callback) {
    this.on("message", callback);
  }

  /**
   * Subscribe to specific message type
   *
   *  Listen to specific message type events
   *
   * @param {string} type - Message type to subscribe to
   * @param {function} callback - Callback function to handle messages
   */
  subscribeToType(type, callback) {
    this.on(`${type}`, callback);
  }

  /**
   * Get current number of active users
   *
   * Return the number of users
   *
   * @returns {number} Number of active users
   */
  getUserCount() {
    return this.users.size;
  }

  /**
   * Get the last N messages (default 10)
   *
   * Return the last 'count' messages
   *
   * @param {number} count - Number of messages to retrieve
   * @returns {array} Array of recent messages
   */
  getMessageHistory(count = 10) {
    return this.messages.slice(-count);
  }

  /**
   * Add a user to the system
   *
   * Add user to users set (avoid duplicates)
   * Create and emit user-joined event
   *
   * @param {string} username - Username to add
   */
  addUser(username, role, caller) {
    if (caller.role !== "admin") {
      console.error("Only admins can add users");
      return;
    }

    if (!this.getActiveUsers().some((user) => user.username === username)) {
      this.users.add({ username: username, role: role });
      // this.emit("user-joined", username);
      this.sendMessage("user-joined", username);
    } else {
      throw new Error("Username is taken");
    }
  }

  /**
   * Remove a user from the system
   *
   * Remove user from users set
   * Create and emit user-left event
   *
   * @param {string} username - Username to remove
   */
  removeUser(username, caller) {
    if (caller.role !== "admin") {
      console.error("Only admins can remove users");
      return;
    }

    const userObject = this.findUser(username);

    if (userObject) {
      this.users.delete(userObject);
      // this.emit("user-left", username);
      this.sendMessage("user-left", username);
    } else {
      throw new Error("Username doesn't exist");
    }
  }

  /**
   * Get all active users
   *
   * Convert users Set to Array and return
   *
   * @returns {array} Array of usernames
   */
  getActiveUsers() {
    return [...this.users];
  }

  /**
   * Clear all messages
   *
   * Clear messages array
   * Emit history-cleared event
   */
  clearHistory(caller) {
    if (caller.role !== "admin") {
      console.error("Only admins can clear history");
      return;
    }
    this.messages.length = 0;

    this.emit("history-cleared");
  }

  /**
   * Get system statistics
   *
   * Calculate and return statistics
   *
   * @returns {object} System stats
   */
  getStats() {
    return `\nTotal messages: ${this.messages.length}\nTotal users: ${this.users.size}`;
  }

  // Search messages based on filters
  searchMessages(filters = {}) {
    return this.messages.filter((message) => {
      if (filters.type && filters.type !== message.type) {
        return false;
      }

      if (
        filters.content &&
        !message.content.toLowerCase().includes(filters.content.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  // Find userObject by username
  findUser(username) {
    return this.getActiveUsers().find((user) => user.username === username);
  }
}

// Export the MessageSystem class
module.exports = MessageSystem;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  const messenger = new MessageSystem();

  // Subscribe to all messages
  messenger.subscribeToMessages((message) => {
    console.log(`[${message.type.toUpperCase()}] ${message.content}`);
  });

  // Subscribe to specific alert messages
  messenger.subscribeToType("alert", (message) => {
    console.log(`🚨 ALERT: ${message.content}`);
  });

  // Subscribe to user events
  messenger.subscribeToType("user-joined", (message) => {
    console.log(`👋 ${message.content}`);
  });

  messenger.subscribeToType("user-left", (message) => {
    console.log(`👋 ${message.content}`);
  });

  // Add users
  messenger.addUser("Alice", "user", messenger.findUser("AdminUser"));
  messenger.addUser("Bob", "user", messenger.findUser("AdminUser"));

  // Send various messages
  messenger.sendMessage("message", "Hello everyone!", "Alice");
  messenger.sendMessage("notification", "System maintenance in 1 hour");
  messenger.sendMessage("alert", "Server overload detected!");

  // Remove user
  messenger.removeUser("Bob", messenger.findUser("AdminUser"));

  // Check system status
  console.log(`\nActive users: ${messenger.getUserCount()}`);
  console.log("Recent messages:", messenger.getMessageHistory()?.length);
  console.log("System stats:", messenger.getStats());

  // Check messages search and filtering
  console.log(
    "Notification messages: ",
    messenger.searchMessages({ type: "notification" }),
  );
  console.log(
    "Messages containing '!': ",
    messenger.searchMessages({ content: "!" }),
  );

  // Role based permissions check
  messenger.addUser("NewUser", "user", messenger.findUser("Alice"));
  messenger.addUser("NewUser", "user", messenger.findUser("AdminUser"));

  // Rate limit check
  messenger.sendMessage("message", "Message outside rate limit");
  setTimeout(() => {
    messenger.sendMessage("message", "Rate limit refreshed");
    messenger.logStream.end();
  }, 6000);
}
