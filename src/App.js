import React, { useState, useEffect } from 'react';
import { Container, Button, Form, ListGroup, Row, Col, Card } from 'react-bootstrap';
import { FiChevronDown, FiChevronRight, FiArrowUp, FiArrowDown, FiMoon, FiSun } from 'react-icons/fi';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import presets from './presets.js';
import { shouldAutoReset, resetTask } from './utils/timeUtils';

const presetCategories = presets;

function App() {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : presetCategories;
  });
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0]);
  const [selectedGame, setSelectedGame] = useState(categories[selectedCategory].length > 0 ? categories[selectedCategory][0].id : null);
  const [newGameName, setNewGameName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortMethod, setSortMethod] = useState('timeLeft');
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(() => {
    const savedState = localStorage.getItem('categoriesCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [gamesCollapsed, setGamesCollapsed] = useState(() => {
    const savedState = localStorage.getItem('gamesCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [addTaskCollapsed, setAddTaskCollapsed] = useState(() => {
    const savedState = localStorage.getItem('addTaskCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showCompleted, setShowCompleted] = useState(true);
  const [moveCompletedToBottom, setMoveCompletedToBottom] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [settingsCollapsed, setSettingsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('settingsCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('categoriesCollapsed', JSON.stringify(categoriesCollapsed));
  }, [categoriesCollapsed]);

  useEffect(() => {
    localStorage.setItem('gamesCollapsed', JSON.stringify(gamesCollapsed));
  }, [gamesCollapsed]);

  useEffect(() => {
    localStorage.setItem('addTaskCollapsed', JSON.stringify(addTaskCollapsed));
  }, [addTaskCollapsed]);

  useEffect(() => {
    localStorage.setItem('settingsCollapsed', JSON.stringify(settingsCollapsed));
  }, [settingsCollapsed]);

  // Auto-reset tasks when their time expires
  useEffect(() => {
    const checkAndResetTasks = () => {
      let hasChanges = false;
      const updatedCategories = { ...categories };

      Object.keys(updatedCategories).forEach(categoryKey => {
        updatedCategories[categoryKey] = updatedCategories[categoryKey].map(game => ({
          ...game,
          tasks: game.tasks.map(task => {
            if (task.completed && shouldAutoReset(task)) {
              hasChanges = true;
              return resetTask(task);
            }
            return task;
          })
        }));
      });

      if (hasChanges) {
        setCategories(updatedCategories);
      }
    };

    // Check for task resets every 30 seconds
    const resetInterval = setInterval(checkAndResetTasks, 30000);
    
    // Also check immediately on component mount
    checkAndResetTasks();

    return () => clearInterval(resetInterval);
  }, [categories]);

  const addCategory = () => {
    if (newCategoryName && !categories[newCategoryName]) {
      setCategories({
        ...categories,
        [newCategoryName]: []
      });
      setNewCategoryName('');
    }
  };

  const removeCategory = (category) => {
    const updatedCategories = { ...categories };
    delete updatedCategories[category];
    setCategories(updatedCategories);
    setSelectedCategory(Object.keys(updatedCategories)[0]);
  };

  const addGame = () => {
    const newGame = { id: Date.now(), name: newGameName, tasks: [] };
    setCategories({
      ...categories,
      [selectedCategory]: [...categories[selectedCategory], newGame]
    });
    setSelectedGame(newGame.id);
    setNewGameName('');
  };

  const removeGame = (id) => {
    setCategories({
      ...categories,
      [selectedCategory]: categories[selectedCategory].filter(game => game.id !== id)
    });
    if (selectedGame === id) {
      setSelectedGame(categories[selectedCategory].length > 1 ? categories[selectedCategory][0].id : null);
    }
  };

  const addTask = (gameId, task) => {
    setCategories({
      ...categories,
      [selectedCategory]: categories[selectedCategory].map(game => game.id === gameId ? { ...game, tasks: [...game.tasks, task] } : game)
    });
  };

  const completeTask = (gameId, taskId) => {
    setCategories({
      ...categories,
      [selectedCategory]: categories[selectedCategory].map(game => game.id === gameId ? {
        ...game,
        tasks: game.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
      } : game)
    });
  };

  const removeTask = (gameId, taskId) => {
    setCategories({
      ...categories,
      [selectedCategory]: categories[selectedCategory].map(game => game.id === gameId ? {
        ...game,
        tasks: game.tasks.filter(task => task.id !== taskId)
      } : game)
    });
  };

  const reorderTasks = (gameId, startIndex, endIndex) => {
    const game = categories[selectedCategory].find(game => game.id === gameId);
    const [removed] = game.tasks.splice(startIndex, 1);
    game.tasks.splice(endIndex, 0, removed);
    setCategories({ ...categories });
  };

  const exportData = () => {
    const dataToExport = {
      categories,
      settings: {
        darkMode,
        categoriesCollapsed,
        gamesCollapsed,
        addTaskCollapsed,
        settingsCollapsed,
        showCompleted,
        moveCompletedToBottom,
        sortMethod,
        sortOrder,
        selectedCategory,
        selectedGame
      },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `just-dailies-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate the imported data structure
        if (importedData.categories && typeof importedData.categories === 'object') {
          setCategories(importedData.categories);
          
          // Restore settings if available
          if (importedData.settings) {
            const settings = importedData.settings;
            if (typeof settings.darkMode === 'boolean') setDarkMode(settings.darkMode);
            if (typeof settings.categoriesCollapsed === 'boolean') setCategoriesCollapsed(settings.categoriesCollapsed);
            if (typeof settings.gamesCollapsed === 'boolean') setGamesCollapsed(settings.gamesCollapsed);
            if (typeof settings.addTaskCollapsed === 'boolean') setAddTaskCollapsed(settings.addTaskCollapsed);
            if (typeof settings.settingsCollapsed === 'boolean') setSettingsCollapsed(settings.settingsCollapsed);
            if (typeof settings.showCompleted === 'boolean') setShowCompleted(settings.showCompleted);
            if (typeof settings.moveCompletedToBottom === 'boolean') setMoveCompletedToBottom(settings.moveCompletedToBottom);
            if (settings.sortMethod) setSortMethod(settings.sortMethod);
            if (settings.sortOrder) setSortOrder(settings.sortOrder);
            if (settings.selectedCategory && importedData.categories[settings.selectedCategory]) {
              setSelectedCategory(settings.selectedCategory);
            }
          }
          
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be imported again
    event.target.value = '';
  };

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const currentGame = categories[selectedCategory].find(game => game.id === selectedGame);

  return (
    <Container>
      <Row className="justify-content-center align-items-center mb-4">
        <Col>
          <h1 className="app-heading">JUST Daily Tracker</h1>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h2>
                Categories
                <Button
                  variant="link"
                  onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
                  aria-controls="categories-list"
                  aria-expanded={!categoriesCollapsed}
                  className="float-right"
                >
                  {categoriesCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                </Button>
              </h2>
            </Card.Header>
            {!categoriesCollapsed && (
              <Card.Body>
                <ListGroup className="mb-3">
                  {Object.keys(categories).map(category => (
                    <ListGroup.Item
                      key={category}
                      active={category === selectedCategory}
                      onClick={() => setSelectedCategory(category)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>{category}</span>
                      <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); removeCategory(category); }} className="btn-remove">
                        &times;
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Form onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
                  <Form.Group>
                    <Form.Label>New Category</Form.Label>
                    <Form.Control type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit" className="mt-2">Add Category</Button>
                </Form>
              </Card.Body>
            )}
          </Card>
          <Card className="mt-3">
            <Card.Header>
              <h2>
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                <Button
                  variant="link"
                  onClick={() => setGamesCollapsed(!gamesCollapsed)}
                  aria-controls="games-list"
                  aria-expanded={!gamesCollapsed}
                  className="float-right"
                >
                  {gamesCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                </Button>
              </h2>
            </Card.Header>
            {!gamesCollapsed && (
              <Card.Body>
                <ListGroup className="mb-3">
                  {categories[selectedCategory].map(game => (
                    <ListGroup.Item
                      key={game.id}
                      active={game.id === selectedGame}
                      onClick={() => setSelectedGame(game.id)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>{game.name}</span>
                      <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); removeGame(game.id); }} className="btn-remove">
                        &times;
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Form onSubmit={(e) => { e.preventDefault(); addGame(); }}>
                  <Form.Group>
                    <Form.Label>New {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Form.Label>
                    <Form.Control type="text" value={newGameName} onChange={(e) => setNewGameName(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit" className="mt-2">Add {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Button>
                </Form>
              </Card.Body>
            )}
          </Card>
          <Card className="mt-3">
            <Card.Header>
              <h2>
                Settings
                <Button
                  variant="link"
                  onClick={() => setSettingsCollapsed(!settingsCollapsed)}
                  aria-controls="settings-list"
                  aria-expanded={!settingsCollapsed}
                  className="float-right"
                >
                  {settingsCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                </Button>
              </h2>
            </Card.Header>
            {!settingsCollapsed && (
              <Card.Body>
                <div className="text-center mb-3">
                  <Button variant="link" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle Dark Mode">
                    {darkMode ? <FiSun /> : <FiMoon />}
                  </Button>
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button variant="outline-primary" size="sm" onClick={exportData}>
                    Export Data
                  </Button>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      style={{ display: 'none' }}
                      id="import-file"
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={() => document.getElementById('import-file').click()}
                      className="w-100"
                    >
                      Import Data
                    </Button>
                  </div>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
        <Col md={9}>
          {currentGame ? (
            <>
              <Card className="mb-3">
                <Card.Header>
                  <h2>
                    {currentGame.name} Tasks
                    <Button
                      variant="link"
                      onClick={() => setAddTaskCollapsed(!addTaskCollapsed)}
                      aria-controls="add-task-form"
                      aria-expanded={!addTaskCollapsed}
                      className="float-right"
                    >
                      {addTaskCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                    </Button>
                  </h2>
                </Card.Header>
                {!addTaskCollapsed && (
                  <Card.Body>
                    <AddTask addTask={(task) => addTask(currentGame.id, task)} />
                  </Card.Body>
                )}
              </Card>
              <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label className="mb-0 mr-2">Sort By</Form.Label>
                <Form.Control as="select" value={sortMethod} onChange={(e) => setSortMethod(e.target.value)} style={{ width: 'auto', marginRight: '10px' }}>
                  <option value="name">Name</option>
                  <option value="timeLeft">Reset In</option>
                  <option value="custom">Custom</option>
                </Form.Control>
                <Button variant="link" onClick={toggleSortOrder} className="p-0">
                  {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                </Button>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="show-completed-switch"
                  label="Show Completed"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                />
              </Form.Group>
              {showCompleted && (
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="move-completed-switch"
                    label="Move Completed to Bottom"
                    checked={moveCompletedToBottom}
                    onChange={(e) => setMoveCompletedToBottom(e.target.checked)}
                  />
                </Form.Group>
              )}
              <TaskList
                tasks={currentGame.tasks}
                completeTask={(taskId) => completeTask(currentGame.id, taskId)}
                removeTask={(taskId) => removeTask(currentGame.id, taskId)}
                sortMethod={sortMethod}
                sortOrder={sortOrder}
                reorderTasks={(startIndex, endIndex) => reorderTasks(currentGame.id, startIndex, endIndex)}
                showCompleted={showCompleted}
                moveCompletedToBottom={moveCompletedToBottom}
              />
            </>
          ) : (
            <p>Select a {selectedCategory} to view its tasks.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
