import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import tw from "tailwind-styled-components";
import Itemsharga from "./itemsharga";

const Datarow = tw.div`
    flex 
    flex-row 
    justify-evenly 
`;
const Data = tw.div`
    py-2 
    w-full    
    border
    text-center 
    flex
    flex-col 
`;
const TaskList = tw.div` 
    flex-grow 
    `;

function Dataneracasaldo(props) {
  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  const { noakun, namaakun, nilai, status } = props;
  const datanilai = toRp(nilai);
  const [istrue, setistrue] = useState(false);
  const [dataUt, setDataUt] = useState({
    asal: {
      id: "asal",
      data: [datanilai],
    },
    debet: {
      id: "debet",
      data: [],
    },
    kredit: {
      id: "kredit",
      data: [],
    },
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const dataStart = Array.from(dataUt[source.droppableId].data);
    const dataFinish = Array.from(dataUt[destination.droppableId].data);
    if (source.droppableId !== destination.droppableId) {
      dataStart.splice(source.index, 1);
      const newStart = {
        ...dataUt[source.droppableId],
        data: dataStart,
      };

      dataFinish.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...dataUt[destination.droppableId],
        data: dataFinish,
      };

      setistrue(newFinish.id === status ? true : false);
      setDataUt({
        ...dataUt,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Datarow>
        <Data>
          <span className="m-1 py-1"> {noakun}</span>
        </Data>
        <Data>
          <span className="m-1 py-1">{namaakun}</span>
        </Data>
        <Data>
          <Droppable droppableId={"asal"}>
            {(provided, snapshot) => (
              <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                {dataUt.asal.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Data>
        <Data>
          <Droppable droppableId={"debet"}>
            {(provided, snapshot) => (
              <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                {dataUt.debet.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Data>
        <Data>
          <Droppable droppableId={"kredit"}>
            {(provided, snapshot) => (
              <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                {dataUt.kredit.data.map((items, index) => (
                  <Itemsharga
                    key={index}
                    data={items}
                    stat={istrue}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
        </Data>
      </Datarow>
    </DragDropContext>
  );
}

export default Dataneracasaldo;
