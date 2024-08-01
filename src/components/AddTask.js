import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';

function AddTask({ addTask }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [resetTime, setResetTime] = useState('');
  const [resetDate, setResetDate] = useState('');
  const [resetDay, setResetDay] = useState('Sunday');
  const [customFrequency, setCustomFrequency] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const resetTimeParts = resetTime.split(':');
    const resetDateParts = resetDate.split('-');
    const now = new Date();
    const nextReset = new Date(
      resetDateParts[0],
      resetDateParts[1] - 1,
      resetDateParts[2],
      resetTimeParts[0],
      resetTimeParts[1]
    );

    let customFrequencyInMs = 0;
    if (frequency === 'custom') {
      customFrequencyInMs =
        customFrequency.days * 24 * 60 * 60 * 1000 +
        customFrequency.hours * 60 * 60 * 1000 +
        customFrequency.minutes * 60 * 1000;
    }

    const newTask = {
      id: Date.now(),
      name,
      frequency,
      resetTime: nextReset,
      resetDay: frequency.includes('weekly') ? resetDay : '',
      resetDate: (frequency === 'monthly' || frequency === 'custom') ? resetDate : '',
      customFrequency: customFrequencyInMs,
      completed: false,
    };

    addTask(newTask);
    setName('');
    setFrequency('daily');
    setResetTime('');
    setResetDate('');
    setResetDay('Sunday');
    setCustomFrequency({ days: 0, hours: 0, minutes: 0 });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group controlId="formTaskName">
        <Form.Label>Task Name</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="formFrequency">
        <Form.Label>Frequency</Form.Label>
        <Form.Control as="select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </Form.Control>
      </Form.Group>

      {frequency.includes('weekly') && (
        <Form.Group controlId="formResetDay">
          <Form.Label>Reset Day</Form.Label>
          <Form.Control as="select" value={resetDay} onChange={(e) => setResetDay(e.target.value)}>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </Form.Control>
        </Form.Group>
      )}

      {(frequency === 'monthly' || frequency === 'custom') && (
        <Form.Group controlId="formResetDate">
          <Form.Label>Reset Date</Form.Label>
          <Form.Control type="date" value={resetDate} onChange={(e) => setResetDate(e.target.value)} required />
        </Form.Group>
      )}

      {frequency === 'custom' && (
        <Form.Group controlId="formCustomFrequency">
          <Form.Label>Custom Frequency</Form.Label>
          <Row>
            <Col>
              <Form.Label>Days</Form.Label>
              <Form.Control
                type="number"
                placeholder="Days"
                value={customFrequency.days}
                onChange={(e) => setCustomFrequency({ ...customFrequency, days: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Label>Hours</Form.Label>
              <Form.Control
                type="number"
                placeholder="Hours"
                value={customFrequency.hours}
                onChange={(e) => setCustomFrequency({ ...customFrequency, hours: e.target.value })}
              />
            </Col>
            <Col>
              <Form.Label>Minutes</Form.Label>
              <Form.Control
                type="number"
                placeholder="Minutes"
                value={customFrequency.minutes}
                onChange={(e) => setCustomFrequency({ ...customFrequency, minutes: e.target.value })}
              />
            </Col>
          </Row>
        </Form.Group>
      )}

      <Form.Group controlId="formResetTime">
        <Form.Label>Reset Time</Form.Label>
        <Form.Control type="time" value={resetTime} onChange={(e) => setResetTime(e.target.value)} required />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-2">
        Add Task
      </Button>
    </Form>
  );
}

export default AddTask;
