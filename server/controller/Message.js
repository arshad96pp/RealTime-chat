export const getAllMessages = async (req, res) => {
  try {
    res.send("MESSAGE IS OK ITS WORKING now");
  } catch (error) {
    console.log(error);
  }
};
