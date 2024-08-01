import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';

function Task({ task, completeTask, removeTask }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [task]);

  function calculateTimeLeft() {
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
      // Daily or hourly
      if (nextReset <= now) {
        nextReset.setDate(now.getDate() + 1);
      }
    }

    const diff = nextReset - now;
    const timeLeft = {
      total: diff,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };

    return timeLeft;
  }

  function formatTimeLeft(time) {
    let formatted = '';
    if (time.days > 0) {
      formatted += `${time.days}d `;
    }
    if (time.hours > 0 || formatted) {
      formatted += `${time.hours}h `;
    }
    if (time.minutes > 0 || formatted) {
      formatted += `${time.minutes}m `;
    }
    if (time.seconds >= 0 || formatted) {
      formatted += `${time.seconds}s`;
    }
    return formatted.trim();
  }

  return (
    <Card className={`mb-3 ${task.completed ? 'completed-task' : ''}`}>
      <Card.Body>
        <Row>
          <Col xs="auto" className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              checked={task.completed}
              onChange={() => completeTask(task.id)}
              label=""
              className="large-checkbox"
            />
          </Col>
          <Col>
            <Card.Title>{task.name}</Card.Title>
            <Card.Text>
              Reset in: {formatTimeLeft(timeLeft)}
            </Card.Text>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <Button variant="danger" size="sm" onClick={() => removeTask(task.id)} className="btn-remove">
              &times;
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default Task;
