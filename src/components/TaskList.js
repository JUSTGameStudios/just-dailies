import React from 'react';
import Task from './Task';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TaskList({ tasks, completeTask, removeTask, sortMethod, sortOrder, reorderTasks, showCompleted, moveCompletedToBottom }) {
  const calculateTimeLeft = (task) => {
    const now = new Date();
    let nextReset = new Date(task.resetTime);

    if (task.frequency === 'custom') {
      const customFrequencyInMs = task.customFrequency;
      nextReset = new Date(nextReset.getTime() + customFrequencyInMs);
    } else if (task.frequency === 'weekly') {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayIndex = daysOfWeek.indexOf(task.resetDay);
      nextReset = new Date(now);
      nextReset.setDate(now.getDate() + ((7 - now.getDay() + dayIndex) % 7));
      nextReset.setHours(new Date(task.resetTime).getHours(), new Date(task.resetTime).getMinutes(), 0, 0);
      if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 7);
      }
    } else if (task.frequency === 'monthly') {
      nextReset.setMonth(now.getMonth() + 1);
    } else {
      // daily or hourly
      if (nextReset <= now) {
        nextReset.setDate(now.getDate() + 1);
      }
    }

    const diff = nextReset - now;
    return diff;
  };

  const sortedTasks = [...tasks];

  if (sortMethod === 'name') {
    sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMethod === 'timeLeft') {
    sortedTasks.sort((a, b) => calculateTimeLeft(a) - calculateTimeLeft(b));
  }

  if (sortOrder === 'desc') {
    sortedTasks.reverse();
  }

  const filteredTasks = showCompleted ? sortedTasks : sortedTasks.filter(task => !task.completed);

  if (moveCompletedToBottom) {
    filteredTasks.sort((a, b) => a.completed - b.completed);
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task task={task} completeTask={completeTask} removeTask={removeTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;
