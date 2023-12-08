import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sort";

import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import { arrayMove } from "@dnd-kit/sortable";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: " ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: " ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  //Yeu cau chuot di chuyen thi moi kinh hoat event
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  //Tim mot column theo CardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    // console.log("handleDragStart: ", event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  //Trigger trong qua trinh keo (drag) mot phan tu
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    // console.log("handleDragOver", event);

    const { active, over } = event;
    //Khong ton tai active or over thi khong lam gi ca
    if (!active || !over) return;

    //activeDraggingCard la cai card chung ta dang tuong tac
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    //overCard la cai card dang tuong tac tren hoac duoi so voi cai card
    const { id: overCardId } = over;
    //Tim 2 cai columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    //Neu khong ton tai 1 trong 2 column thi break tranh crash trang web
    if (!activeColumn || !overColumn) return;

    //Neu 2 column khac nhau thi code chay vao
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        //Tim vi tri index cua cai overCard trong column dich(cai noi ma active Card sap duoc tha)
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );

        //Logic tinh toan cho cardIndex moi
        let newCardIndex;

        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1;

        //Clone mang orderedColumnsState cu thanh mang moi
        const nextColumns = cloneDeep(prevColumns);

        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id == overColumn._id
        );

        if (nextActiveColumn) {
          //Xoa card o cai column active
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );

          //Cap nhat lai mang cardOrderIDs cho chuan du lieu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }

        if (nextOverColumn) {
          //Kiem tra xem card dang keo co ton tai o cai column hay chua
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          //Tiep theo them cai card dang keo vao vi tri column index moi
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          );
          //Cap nhat lai mang cardOrderIDs cho chuan du lieu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        // console.log(nextColumns);

        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event) => {
    if (activeDragItemData === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log("Hanh dong keo tha card - tam thoi khong lam gi ca");
      return;
    }
    // console.log("handleDragend: ", event);

    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      //Lay vi tri cu tu thang active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      //Lay vi tri moi tu thang over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumns(dndOrderedColumns);
    }
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      //cam bien
      sensors={sensors}
      //Thuat toan phat hien va cham
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => {
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2";
          },
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
