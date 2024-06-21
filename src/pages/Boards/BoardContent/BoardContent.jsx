import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { sortByArrayOrder } from '~/utils/sorts'
import { DndContext, DragOverlay, closestCorners, defaultDropAnimationSideEffects, pointerWithin, getFirstCollision } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSensor, useSensors } from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'
//import { MouseSensor, TouchSensor } from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLib/dndkitSensor'
import { arangeBoardAPI } from '~/apis'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD:'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  //Them sensor
  const pointSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  })
  //uu tien su dung 2 loại sensor mouse va touch de co trai nghiem mobile
  const mySensors = useSensors(mouseSensor, touchSensor)
  //Quan ly bien danh sach cot sau khi sap xep su hook
  const [orderedColumn, setOrderedColumn] = useState([])
  //Cac bien quan li doi thuong duy nhat dang dc keo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setactiveDragItemType] = useState(null)
  const [activeDragItemData, setactiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  //Điểm va chạm cuối cùng trước đó
  const lastOverId =useRef(null)
  //sau nay goi API cap nhat thu tu khi board thay doi
  useEffect(() => {
    setOrderedColumn(sortByArrayOrder(board.columns, '_id', board.columnOrderIds))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumn.find(column => column?.cards.map(card => card._id)?.includes(cardId))
  }
  const moveCardBetweenTwoColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    flag,
    oldColumnId
  ) => {
    setOrderedColumn(prevColumns => {
      //Tinh vi tri tha card
      const overCardIndex=overColumn?.cards?.findIndex(card => card._id===overCardId)
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
      active.rect.current.translated.top >over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      //co ve nh lan dau ở sự kiện over giá trị này chưa đc tính toán đúng (luc nay nó =0) đến sự kiện end mới đúng
      const nextColumns =cloneDeep(prevColumns)
      //Chú ý hình như ở đây bị nhầm lẫn
      //Lúc này activeColumn đã là overColumn
      //Vì thế muốn lấy column cũ phải tìm thông qua columnId của card đang kéo activeDraggingCardData vì lúc này giá trị đó chưa update
      //Hoặc có thể ta đang hiểu sai nó có mục đích khác--> xem lại
      //Nếu sửa thì sửa cả activeColumn  activeDraggingCardData
      const nextActiveColumn =nextColumns?.find(column => column._id===activeColumn._id)
      const nextOverColumn = nextColumns?.find(column => column._id===overColumn._id)
      if (nextActiveColumn) {
        //Xóa card ở cột active sau đó cập nhật lại cardOderIds
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id!==activeDraggingCardId)
        nextActiveColumn.cardOrderIds= nextActiveColumn.cards.map(card => card._id)//go

      }
      if (nextOverColumn) {
        //Kiểm tra ở Comlumn mới đã tồn tại card chưa nếu có xóa đi
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id!==activeDraggingCardId)
        //Thay đổi columnId của card chuẩn bị thêm (dưới đây là cách ta clone ra bản mới không mutate bản cũ dùng ...)
        const rebuildActiveDraggingCardData={ ...activeDraggingCardData, columnId: nextOverColumn._id }
        //Thêm vào card vào cột mới và cập nhật lại cardOderIds
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData)
        nextOverColumn.cardOrderIds=nextOverColumn.cards.map(card => card._id)//go
      }
      //cade này bổ sung để gọi API
      //Lấy orderCardIds của cột source
      //Vì hiện taị nextActiveColumn tôi nghĩ là đang sai nên mới có đoạn code này
      //Sau nếu sửa lại thì không cần vì bản chaart nextActiveColumn là cái cột source và
      //nó đang đc cập nhật orderCardIds tử sự kiện over trc rồi không cần phải xóa nữa
      if (flag===true) {
        const oldActiveColumn =nextColumns?.find(column => column._id===oldColumnId)
        arangeBoardAPI({
          source:{ columnId:oldColumnId, oderCardIds:oldActiveColumn.cardOrderIds.join(',') },
          target:{ columnId:overColumn._id, oderCardIds:nextOverColumn.cardOrderIds.join(',') },
          cardId:activeDraggingCardId.toString()
        })
      }
      return nextColumns
    })

  }

  const handleDragStart = (event) => {
    console.log('handleDragStart:', event)
    setActiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  const handleDragOver = (event) => {
    //Nếu đối tượng đang kéo là column không xử lý gì cả trong sự kiện này
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //Nếu là CARD thì xử lý
    console.log('handleDragOver:', event)
    const { active, over } = event
    //Nếu không tồn tại Active và Over thì không xử lý
    if (!active || !over) return

    const { id : activeDraggingCardId, data:{ current: activeDraggingCardData } }= active
    const { id : overCardId }= over

    //Tìm 2 column active và over
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return //kiểm tra cho chắc

    //Sau đây là xử lý logic chho trường hợp kéo sang column khác còn trường hợp trong cùng column thì không xử lý
    //Vì việc xử lí cuối cùng vẫn nằm trong sự kiện DrangEnd
    if (activeColumn!==overColumn) {
      console.log('code chay vao day')
      moveCardBetweenTwoColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        false,
        oldColumnWhenDraggingCard._id
      )
    }


  }

  const handleDragEnd = (event) => {
    console.log('handleDragEnd:', event)
    console.log('activeDragItemType:', activeDragItemType)
    const { active, over } = event
    console.log('active:', active)
    console.log('over:', over)
    //Nếu không tồn tại Active và Over thì không xử lý
    if (!active || !over) return
    //xử lý kéo thả card
    console.log('activeDragItemType:', activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD)
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log('Hanh dong keo tha - Card tạm thời không làm gì')
      const { id : activeDraggingCardId, data:{ current: activeDraggingCardData } }= active// có lẽ vấn đề từ chỗ này
      const { id : overCardId }= over
      //Tìm 2 column active và over
      //chỗ này không thể dùng active trong sự kiện vì lúc này sau khi trải qua sự
      //kiên DragOver dữ liệu active đã bị cập nhật khi setOderedColumn vì thế dùng activeDragItemData
      console.log('activeDragItemId:', activeDragItemId)
      console.log('overCardId:', overCardId)
      //Chú ý hình như ở đây bị nhầm lẫn:
      //Lúc này activeColumn đã là overColumn
      //Vì thế muốn lấy column cũ phải tìm thông qua columnId của card đang kéo activeDraggingCardData vì lúc này giá trị đó chưa update
      const activeColumn = findColumnByCardId(activeDragItemId)
      const overColumn = findColumnByCardId(overCardId)
      console.log('activeColumn:', activeColumn)
      console.log('overColumn:', overColumn)
      if (!activeColumn || !overColumn) return //kiểm tra cho chắc
      console.log('activeDragItemData', activeDragItemData)
      //Xử lý nếu kéo cùng cột
      if (overColumn._id===oldColumnWhenDraggingCard._id ) {
        console.log('Kéo cùng cột')
        //nhấp cũng không xử lý
        if (active.id === over.id)
        {
          console.log('van1:')
          return []}
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id===activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id===overCardId)
        const dndOrderedCards= arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        //clone orderedColumns
        setOrderedColumn(prevColumns => {
          const nextColumns= cloneDeep(prevColumns)
          const targetColumn=nextColumns.find(column => column._id===overColumn._id)
          //Cập nhật list cards va thứ tự card cardOrderIds
          targetColumn.cards=dndOrderedCards
          targetColumn.cardOrderIds=dndOrderedCards.map(card => card._id)//go
          if (oldCardIndex!==newCardIndex) {
            arangeBoardAPI({
              source:{ columnId:oldColumnWhenDraggingCard._id, oderCardIds:targetColumn.cardOrderIds.join(',') },
              target:{ columnId:overColumn._id, oderCardIds:targetColumn.cardOrderIds.join(',') },
              cardId:activeDragItemId.toString()// Ở đây tôi convert sang string vì khi ép kiểu Integer bên java sang Long bị lỗi
            })
          }
          return nextColumns
        })

      } else {
        //Xử lý kéo khác cột
        moveCardBetweenTwoColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          true,
          oldColumnWhenDraggingCard._id
        )
        console.log('Kéo khác cột')
      }

    }
    //Xử lý khi kéo thả column
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumn.findIndex(c => c._id===active.id)
        const newColumnIndex = orderedColumn.findIndex(c => c._id===over.id)
        const dndOrderedColumn= arrayMove(orderedColumn, oldColumnIndex, newColumnIndex)
        const dndorderedColumnIds =dndOrderedColumn.map(c => c._id)
        // cho nay sau de goi API luu thu tu vao trong DB
        console.log('orderedColumn:', dndOrderedColumn)
        console.log('orderedColumnIds:', dndorderedColumnIds)
        arangeBoardAPI({ columnMove:{ columnOrderIds:dndorderedColumnIds.join(','), boardId:board._id.toString() } })
        setOrderedColumn(dndOrderedColumn)
      }
    }

    //khi khong keo cho ve null
    setActiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }
  const collisionDetectionStrategy =useCallback((args) => {
    //Nếu kéo thả Column thì sử dụng thuật toán va chạm closestCorners
    if (activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }
    //Tìm các điểm giao nhau với con trỏ
    const pointerIntersections = pointerWithin(args)
    //Nếu không va cham không làm gì để fix lỗi nhấp nháy ki kéo lên trên cùng
    if (!pointerIntersections?.length) return
    //Phát hiện và trả về mảng các va chạm
    //const intersections = pointerIntersections?.length > 0 ? pointerIntersections:rectIntersection(args)// k cần nữa
    //Tìm overId đầu tiên trong đám intersection
    let overId =getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      //lỗi xảy ra khi nó va chạm vào column trước khi va chạm với card
      //Để khắc phục lỗi này trong trường hợp va chạm với column ta cũng trả về card gần chỗ va chạm đó
      const checkColumn =orderedColumn.find(column => column._id===overId)
      if (checkColumn) {
        //Ghi đè overId từ column sang card
        overId= closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId)&&(checkColumn?.cardOrderIds.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current=overId
      return [{ id: overId }]
    }
    return lastOverId.current? [{ id: lastOverId.current }]: []
  }, [activeDragItemType, orderedColumn])
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      //Phát hiện va cham để khi kéo phần tử to nhận biết đc
      //collisionDetection={closestCorners}//sử dụng closestCorners xay ra loi
      //Vì thế cần custom thuật toán va chạm
      collisionDetection={collisionDetectionStrategy}

      sensors={mySensors} >
      <Box sx={{
        bgcolor:(theme) => (theme.palette.mode==='dark' ? '#34495e':'#1976d2'),
        width:'100%',
        height: (theme) => theme.trello.boardContentHeight,
        p:1
      }}>
        <ListColumns columns={orderedColumn} boardId={board._id} columnOrderIds ={board.columnOrderIds}/>
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/> }
          {(activeDragItemType===ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/> }
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
