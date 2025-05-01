const calculateTaskProgress = (task) => {
  if(!task) return null;
    const { subTasks, status } = task;
  
    if (!subTasks || subTasks.length === 0) {
      return status === "Completed" ? 100 : 0;
    }
  
    const completedCount = subTasks.filter(st => st.isCompleted).length;
    const total = subTasks.length;
  
    return Math.round((completedCount / total) * 100);
  };

  export default calculateTaskProgress;
  