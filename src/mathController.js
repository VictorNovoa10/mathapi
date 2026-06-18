exports.add = (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a + b });
};

exports.subtract = (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a - b });
};

exports.multiply = (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a * b });
};

exports.divide = (req, res) => {
  const { a, b } = req.body;

  if (b === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }

  return res.json({ result: a / b });
};

exports.pow = (req, res) => {
  const { a, b } = req.body;
  res.json({ result: Math.pow(a, b) });
};
