
export const boardState = {
  /* board:{
    '_id': 1,
    'title': 'board01',
    'description': 'Day la board dau tien',
    'type': 'private',
    'boardOwner': null,
    'boardMember': null,
    'columns': [
      {
        '_id': '2',
        'boardId': 1,
        'title': 'Thu Nghiem Tao Cot',
        'cardOrderIds': [1, 2, 4],
        'columnOrderIds': null,
        'cards': [
          {
            '_id': 2,
            'boardId': 1,
            'columnId': 2,
            'title': 'Day la Card 01',
            'description': null,
            'cardOderIds': null,
            'comments': null,
            'attachments': null
          },
          {
            '_id': 3,
            'boardId': 1,
            'columnId': 2,
            'title': 'Day la Card 02',
            'description': null,
            'cardOderIds': null,
            'comments': null,
            'attachments': null
          },
          {
            '_id': 4,
            'boardId': 1,
            'columnId': 2,
            'title': 'Day la Card 04',
            'description': null,
            'cardOderIds': null,
            'comments': null,
            'attachments': null
          }
        ]
      }
    ],
    'columnOrderIds': ['2'],
    'err': null
  }
}*/
  _id: 1,
  title: 'Nguyen Tien Van Trello Web',
  description: 'Pro MERN stack Course',
  type: 'public', // 'private'
  ownerIds: [], // Những users là Admin của board
  memberIds: [], // Những users là member bình thường của board
  columnOrderIds: [], // Thứ tự sắp xếp / vị trí của các Columns trong 1 boards
  columns: [],
  listUsers:[]
}