import React, { useState } from 'react';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';

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
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate task name
    if (!name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Task name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Task name must be less than 100 characters';
    }

    // Validate reset time
    if (!resetTime) {
      newErrors.resetTime = 'Reset time is required';
    }

    // Validate reset date for monthly and custom frequencies
    if ((frequency === 'monthly' || frequency === 'custom') && !resetDate) {
      newErrors.resetDate = 'Reset date is required for this frequency';
    }

    // Validate custom frequency
    if (frequency === 'custom') {
      const totalMs = customFrequency.days * 24 * 60 * 60 * 1000 +
                      customFrequency.hours * 60 * 60 * 1000 +
                      customFrequency.minutes * 60 * 1000;
      
      if (totalMs <= 0) {
        newErrors.customFrequency = 'Custom frequency must be greater than 0';
      }

      // Check for reasonable limits
      if (customFrequency.days > 365) {
        newErrors.customFrequency = 'Days cannot exceed 365';
      }
      if (customFrequency.hours > 23) {
        newErrors.customFrequency = 'Hours cannot exceed 23';
      }
      if (customFrequency.minutes > 59) {
        newErrors.customFrequency = 'Minutes cannot exceed 59';
      }
    }

    // Validate date format and reasonable date
    if (resetDate) {
      const dateObj = new Date(resetDate);
      if (isNaN(dateObj.getTime())) {
        newErrors.resetDate = 'Invalid date format';
      } else {
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        
        if (dateObj < oneYearAgo || dateObj > oneYearFromNow) {
          newErrors.resetDate = 'Date must be within one year from today';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    try {
      const resetTimeParts = resetTime.split(':');
      const resetDateParts = resetDate ? resetDate.split('-') : [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
      
      const nextReset = new Date(
        resetDateParts[0],
        resetDateParts[1] - 1,
        resetDateParts[2],
        resetTimeParts[0],
        resetTimeParts[1]
      );

      // Validate the constructed date
      if (isNaN(nextReset.getTime())) {
        setErrors({ general: 'Invalid date/time combination' });
        return;
      }

      let customFrequencyInMs = 0;
      if (frequency === 'custom') {
        customFrequencyInMs =
          customFrequency.days * 24 * 60 * 60 * 1000 +
          customFrequency.hours * 60 * 60 * 1000 +
          customFrequency.minutes * 60 * 1000;
      }

      const newTask = {
        id: Date.now(),
        name: name.trim(),
        frequency,
        resetTime: nextReset.getTime(),
        resetDay: frequency.includes('weekly') ? resetDay : '',
        resetDate: (frequency === 'monthly' || frequency === 'custom') ? resetDate : '',
        customFrequency: customFrequencyInMs,
        completed: false,
      };

      addTask(newTask);
      
      // Reset form on success
      setName('');
      setFrequency('daily');
      setResetTime('');
      setResetDate('');
      setResetDay('Sunday');
      setCustomFrequency({ days: 0, hours: 0, minutes: 0 });
      setErrors({});
      setShowErrors(false);
    } catch (error) {
      setErrors({ general: 'Failed to create task. Please check your inputs.' });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      {showErrors && errors.general && (
        <Alert variant="danger">{errors.general}</Alert>
      )}
      
      <Form.Group controlId="formTaskName">
        <Form.Label>Task Name</Form.Label>
        <Form.Control 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          isInvalid={showErrors && errors.name}
          required 
        />
        {showErrors && errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        )}
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
          <Form.Control 
            type="date" 
            value={resetDate} 
            onChange={(e) => setResetDate(e.target.value)} 
            isInvalid={showErrors && errors.resetDate}
            required 
          />
          {showErrors && errors.resetDate && (
            <Form.Control.Feedback type="invalid">
              {errors.resetDate}
            </Form.Control.Feedback>
          )}
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
                min="0"
                max="365"
                value={customFrequency.days}
                onChange={(e) => setCustomFrequency({ ...customFrequency, days: parseInt(e.target.value) || 0 })}
                isInvalid={showErrors && errors.customFrequency}
              />
            </Col>
            <Col>
              <Form.Label>Hours</Form.Label>
              <Form.Control
                type="number"
                placeholder="Hours"
                min="0"
                max="23"
                value={customFrequency.hours}
                onChange={(e) => setCustomFrequency({ ...customFrequency, hours: parseInt(e.target.value) || 0 })}
                isInvalid={showErrors && errors.customFrequency}
              />
            </Col>
            <Col>
              <Form.Label>Minutes</Form.Label>
              <Form.Control
                type="number"
                placeholder="Minutes"
                min="0"
                max="59"
                value={customFrequency.minutes}
                onChange={(e) => setCustomFrequency({ ...customFrequency, minutes: parseInt(e.target.value) || 0 })}
                isInvalid={showErrors && errors.customFrequency}
              />
            </Col>
          </Row>
          {showErrors && errors.customFrequency && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
              {errors.customFrequency}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}

      <Form.Group controlId="formResetTime">
        <Form.Label>Reset Time</Form.Label>
        <Form.Control 
          type="time" 
          value={resetTime} 
          onChange={(e) => setResetTime(e.target.value)} 
          isInvalid={showErrors && errors.resetTime}
          required 
        />
        {showErrors && errors.resetTime && (
          <Form.Control.Feedback type="invalid">
            {errors.resetTime}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-2">
        Add Task
      </Button>
    </Form>
  );
}

export default AddTask;
