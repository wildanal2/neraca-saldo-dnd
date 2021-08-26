import tw from "tailwind-styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = tw.div` 
    rounded
    m-1
    py-1
    shadow
    border
    bg-white
    ${(p) => p.$stat && "border-green-300"}
`;

function Itemsharga(props) {
  return (
    <Draggable draggableId={props.data} index={props.index}>
      {(provided) => (
        <Container
          $stat={props.stat}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {props.data}
        </Container>
      )}
    </Draggable>
  );
}

export default Itemsharga;
