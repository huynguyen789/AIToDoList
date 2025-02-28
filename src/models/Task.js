/**
 * Task model
 * - Defines the structure for task objects
 * - Includes methods for task operations
 * - Implements Eisenhower Matrix priority system
 */
class Task {
  /**
   * Create a new task
   * Input: title (string), description (string), deadline (Date), priorityLevel (number 1-4)
   * Output: Task object
   * Logic: Initialize with provided values, calculate priority score, set default status
   */
  constructor(title, description, deadline, priorityLevel = 4) {
    this.id = Date.now().toString();
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.priorityLevel = this.validatePriorityLevel(priorityLevel);
    this.priorityScore = this.calculatePriorityScore(this.priorityLevel);
    this.completed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Validate priority level is between 1-4
   * Input: priorityLevel (number)
   * Output: validated priorityLevel (number)
   * Logic: Ensure value is between 1-4, default to 4 if invalid
   */
  validatePriorityLevel(level) {
    const validLevel = parseInt(level);
    return (validLevel >= 1 && validLevel <= 4) ? validLevel : 4;
  }

  /**
   * Calculate priority score based on level
   * Input: priorityLevel (number)
   * Output: priorityScore (number)
   * Logic: Map priority levels to scores according to Eisenhower Matrix
   */
  calculatePriorityScore(level) {
    const scoreMap = {
      1: 10, // Urgent & Important
      2: 7,  // Important but Not Urgent
      3: 5,  // Urgent but Not Important
      4: 2   // Neither Urgent nor Important
    };
    return scoreMap[level] || 2;
  }

  /**
   * Get priority label
   * Output: string description of priority level
   * Logic: Map priority level to descriptive label
   */
  getPriorityLabel() {
    const labelMap = {
      1: "Urgent & Important",
      2: "Important but Not Urgent",
      3: "Urgent but Not Important",
      4: "Neither Urgent nor Important"
    };
    return labelMap[this.priorityLevel];
  }

  /**
   * Mark task as complete
   * Input: none
   * Output: updated task
   * Logic: Set completed to true and update timestamp
   */
  complete() {
    this.completed = true;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Mark task as incomplete
   * Input: none
   * Output: updated task
   * Logic: Set completed to false and update timestamp
   */
  uncomplete() {
    this.completed = false;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Update task details
   * Input: updates object with task properties
   * Output: updated task
   * Logic: Apply provided updates, recalculate priority score if level changed
   */
  update(updates) {
    const allowedUpdates = ['title', 'description', 'deadline', 'priorityLevel', 'completed'];
    
    Object.keys(updates).forEach(update => {
      if (allowedUpdates.includes(update)) {
        if (update === 'priorityLevel') {
          this.priorityLevel = this.validatePriorityLevel(updates[update]);
          this.priorityScore = this.calculatePriorityScore(this.priorityLevel);
        } else {
          this[update] = updates[update];
        }
      }
    });
    
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = Task; 