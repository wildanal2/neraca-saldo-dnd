import { Droppable } from "react-beautiful-dnd";
import tw from "tailwind-styled-components";
import Task from "./task.js";

const Container = tw.div`
    m-3 
    border-2
    w-full
    mx-3
    flex
    flex-col
`;
const Title = tw.h3`
    p-3
`;
const TaskList = tw.div`
    p-5
    ${(props) => (props.isDraggingOver ? "bg-red-100" : "bg-white")}
    flex-grow
`;

function Column(props) {
  return (
    <Container>
      <Title>{props.column.title}</Title>
      <Droppable droppableId={props.column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {props.tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}

export default Column;
