const checkForDuplicates = async (props, Schema) => {
	const doc = await Schema.findOne(props);

	if (!doc) return false;
	else return true;
};

module.exports = checkForDuplicates;
