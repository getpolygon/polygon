async function checkForDuplicates(props, Schema) {
  const doc = await Schema.findOne(props);
  if (doc === null) return false;
  else return true;
}

module.exports = checkForDuplicates;
