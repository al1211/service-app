export const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json(result ?? { message: "Success" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};