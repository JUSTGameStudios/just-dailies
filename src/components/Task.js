import React, { useEffect, useState, useCallback } from 'react';
import { Button, Card, Row, Col, Form } from 'react-bootstrap';
import { calculateTimeLeft, formatTimeLeft } from '../utils/timeUtils';

function Task({ task, completeTask, removeTask }) {
  const calculateCurrentTimeLeft = useCallback(() => {
    return calculateTimeLeft(task);
  }, [task]);

  const [timeLeft, setTimeLeft] = useState(calculateCurrentTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateCurrentTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateCurrentTimeLeft]);


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
