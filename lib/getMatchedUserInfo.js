const getMatchedUserInfo = (users, userLoggedInId) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedInId];

  const [id, user] = Object.entries(newUsers).flat();

  return { id, ...user };
};

export default getMatchedUserInfo;
