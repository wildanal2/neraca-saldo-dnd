import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import tw from "tailwind-styled-components";

import initialData from "./initial-data";
import Column from "./column";

const Container = tw.div`
  flex
  mt-5
  p-3
  bg-gray-50
  max-w-7xl
  mx-auto
`;
const Content = tw.div`
  flex flex-row 
  w-full
`;
const Sidemenu = tw.div`
  m-3
`;

function App() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    // Reorder column list
    console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) return;
    //
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    //Check Asal Colomn dan tujuan
    const cstart = data.columns[source.droppableId];
    const cfinish = data.columns[destination.droppableId];

    if (cstart === cfinish) {
      const newTaskIds = Array.from(cstart.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      //
      const newColu = {
        ...cstart,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColu.id]: newColu,
        },
      });
    } else {
      const startTaskIds = Array.from(cstart.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...cstart,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(cfinish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...cfinish,
        taskIds: finishTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
    }
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Content>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.task[taskId]);

            return <Column key={columnId} column={column} tasks={tasks} />;
          })}
        </Content>
        <Sidemenu></Sidemenu>
      </DragDropContext>
    </Container>
  );
}

export default App;
