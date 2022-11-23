const generateId = (id_1, id_2) => (id_1 > id_2 ? id_1 + id_2 : id_2 + id_1);

export default generateId;
