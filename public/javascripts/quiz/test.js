async function fetchQuizData() {
    try {
      const response = await fetch('/api/quiz-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      // Use the data to display your quiz
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  }
  
  fetchQuizData();