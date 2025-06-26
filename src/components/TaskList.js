import React from 'react';
import Task from './Task';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { calculateTimeLeft } from '../utils/timeUtils';

function TaskList({ tasks, completeTask, removeTask, sortMethod, sortOrder, reorderTasks, showCompleted, moveCompletedToBottom }) {
  const getTaskTimeLeft = (task) => {
    const timeLeft = calculateTimeLeft(task);
    return timeLeft.total;
  };

  const sortedTasks = [...tasks];

  if (sortMethod === 'name') {
    sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMethod === 'timeLeft') {
    sortedTasks.sort((a, b) => getTaskTimeLeft(a) - getTaskTimeLeft(b));
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
