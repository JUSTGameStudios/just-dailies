/**
 * Utility functions for handling task time calculations and resets
 */

/**
 * Calculate the next reset time for a task based on its frequency
 * @param {Object} task - The task object
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Date} The next reset time
 */
export function calculateNextResetTime(task, currentTime = new Date()) {
  const now = currentTime;
  let nextReset = new Date(task.resetTime);

  switch (task.frequency) {
    case 'hourly':
      // For hourly tasks, calculate the next hour reset
      nextReset = new Date(now);
      nextReset.setMinutes(new Date(task.resetTime).getMinutes());
      nextReset.setSeconds(0);
      nextReset.setMilliseconds(0);
      
      // If the reset time has passed this hour, move to next hour
      if (nextReset <= now) {
        nextReset.setHours(nextReset.getHours() + 1);
      }
      break;

    case 'daily':
      // For daily tasks, set to the next occurrence of the reset time
      nextReset = new Date(now);
      nextReset.setHours(
        new Date(task.resetTime).getHours(),
        new Date(task.resetTime).getMinutes(),
        0,
        0
      );
      
      // If the reset time has passed today, move to tomorrow
      if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1);
      }
      break;

    case 'weekly':
      // For weekly tasks, find the next occurrence of the specified day
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDayIndex = daysOfWeek.indexOf(task.resetDay);
      const currentDayIndex = now.getDay();
      
      nextReset = new Date(now);
      nextReset.setHours(
        new Date(task.resetTime).getHours(),
        new Date(task.resetTime).getMinutes(),
        0,
        0
      );
      
      // Calculate days until target day
      let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
      
      // If target day is today but time has passed, move to next week
      if (daysUntilTarget === 0 && nextReset <= now) {
        daysUntilTarget = 7;
      }
      
      nextReset.setDate(nextReset.getDate() + daysUntilTarget);
      break;

    case 'monthly':
      // For monthly tasks, find the next occurrence of the date
      const targetDate = new Date(task.resetDate);
      nextReset = new Date(now.getFullYear(), now.getMonth(), targetDate.getDate());
      nextReset.setHours(
        new Date(task.resetTime).getHours(),
        new Date(task.resetTime).getMinutes(),
        0,
        0
      );
      
      // If the date has passed this month, move to next month
      if (nextReset <= now) {
        nextReset.setMonth(nextReset.getMonth() + 1);
      }
      break;

    case 'custom':
      // For custom frequency, calculate next reset from the task's last completion/creation time
      const customFrequencyMs = task.customFrequency || 0;
      
      // If task has a lastReset time, use that as the base, otherwise use resetTime
      const baseTime = task.lastReset ? new Date(task.lastReset) : new Date(task.resetTime);
      nextReset = new Date(baseTime.getTime() + customFrequencyMs);
      
      // If the calculated time is in the past, keep adding intervals until we get a future time
      while (nextReset <= now) {
        nextReset = new Date(nextReset.getTime() + customFrequencyMs);
      }
      break;

    default:
      // Default to daily if frequency is unknown
      nextReset = new Date(now);
      nextReset.setHours(
        new Date(task.resetTime).getHours(),
        new Date(task.resetTime).getMinutes(),
        0,
        0
      );
      if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1);
      }
  }

  return nextReset;
}

/**
 * Calculate the time remaining until the next reset
 * @param {Object} task - The task object
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Object} Object containing total ms and formatted time components
 */
export function calculateTimeLeft(task, currentTime = new Date()) {
  const nextReset = calculateNextResetTime(task, currentTime);
  const diff = nextReset - currentTime;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    };
  }

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false
  };
}

/**
 * Format time left object into a readable string
 * @param {Object} timeLeft - Time left object from calculateTimeLeft
 * @returns {string} Formatted time string
 */
export function formatTimeLeft(timeLeft) {
  if (timeLeft.expired || timeLeft.total <= 0) {
    return 'Reset available';
  }

  let formatted = '';
  if (timeLeft.days > 0) {
    formatted += `${timeLeft.days}d `;
  }
  if (timeLeft.hours > 0 || formatted) {
    formatted += `${timeLeft.hours}h `;
  }
  if (timeLeft.minutes > 0 || formatted) {
    formatted += `${timeLeft.minutes}m `;
  }
  if (timeLeft.seconds >= 0 || formatted) {
    formatted += `${timeLeft.seconds}s`;
  }
  
  return formatted.trim() || '0s';
}

/**
 * Check if a task should be automatically reset based on time
 * @param {Object} task - The task object
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {boolean} True if the task should be reset
 */
export function shouldAutoReset(task, currentTime = new Date()) {
  const timeLeft = calculateTimeLeft(task, currentTime);
  return timeLeft.expired;
}

/**
 * Reset a task by setting completed to false and updating reset time
 * @param {Object} task - The task object
 * @param {Date} currentTime - Current time (optional, defaults to now)
 * @returns {Object} Updated task object
 */
export function resetTask(task, currentTime = new Date()) {
  const updatedTask = {
    ...task,
    completed: false,
    lastReset: currentTime.getTime()
  };
  
  // For custom frequency tasks, we keep the original resetTime but update lastReset
  // For other frequencies, we can update resetTime to the next occurrence
  if (task.frequency !== 'custom') {
    const nextResetTime = calculateNextResetTime(updatedTask, currentTime);
    updatedTask.resetTime = nextResetTime.getTime();
  }
  
  return updatedTask;
}