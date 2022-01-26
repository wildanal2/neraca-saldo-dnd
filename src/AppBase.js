import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const onDragEnd = (result) => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={"src_name_XCaDC_1"}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`w-full items-center p-0.5 ${
              snapshot.isDraggingOver && "bg-gray-100"
            }`}
          >
            <Draggable draggableId={0 + "_Rp 5.000_XCaDC"} index={0}>
              {(provided) => (
                <div
                  className="rounded-sm py-1 my-2 shadow border w-24"
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  Rp 5.000
                </div>
              )}
            </Draggable>

            <Draggable draggableId={1 + "_Rp 1.000_CZSXSV"} index={1}>
              {(provided) => (
                <div
                  className="rounded-sm py-1 my-2 shadow border w-24"
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  Rp 1.000
                </div>
              )}
            </Draggable>

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
