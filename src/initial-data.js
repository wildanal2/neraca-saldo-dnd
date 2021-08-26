const initialData = {
  task: {
    "task-1": { id: "task-1", content: "Kas" },
    "task-2": { id: "task-2", content: "Modal PT" },
    "task-3": { id: "task-3", content: "Penjualan" },
    "task-4": { id: "task-4", content: "Return Penjualan" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    "column-2": {
      id: "column-2",
      title: "Kredit",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Debit",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

export default initialData;
