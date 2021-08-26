import tw from "tailwind-styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = tw.div`
    border
    p-3
    my-2
    bg-white
`;

function Task(props) {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {props.task.content}
        </Container>
      )}
    </Draggable>
  );
}

export default Task;
