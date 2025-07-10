import React, { useEffect } from 'react';
import { useResumeStore } from './store/resumeStore';
import { ResumeBuilder } from './components/ResumeBuilder';

function App() {
  const { theme } = useResumeStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="App">
      <ResumeBuilder />
    </div>
  );
}

export default App;