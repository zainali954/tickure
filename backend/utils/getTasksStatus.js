export const getTaskStatus = ({ startDate, dueDate, subTasks = [], currentStatus }) => {
    const now = new Date();
  
    const allCompleted = subTasks.length > 0 && subTasks.every(t => t.isCompleted);
    const noneCompleted = subTasks.length > 0 && subTasks.every(t => !t.isCompleted);
  
    // Respect already completed status
    if (currentStatus === "Completed") return "Completed";
  
    // All subtasks completed → set as Completed
    if (allCompleted) return "Completed";
  
    // If task hasn't started yet and no subtasks are done
    if (noneCompleted && now < new Date(startDate)) {
      return "Not Started";
    }
  
    if(now < new Date(startDate)){
        return "Not Started"
    }
    // If current time is after dueDate → Overdue
    if (now > new Date(dueDate)) {
      return "Overdue";
    }
  
    // Default case → something started
    return "In Progress";
  };
  