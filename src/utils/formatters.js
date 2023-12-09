export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

//Phia FE se tu tao ra mot cai card dac biet: placeholder Card, khong lien quan den Back-end
//Card dac biet nay se duoc an o giao dien UI nguoi dung
//Cau truc Id cua cai card nay de Unique rat don gian, khong can phai lam random phuc tap
//columnId-placeholder-card (Moi column chi co the co toi da mot cai Placeholder Card)
//Quan trong khi phai tao: phai day du : {_id, boardId, columnId, FE_PlaceholderCard}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};
