exports.checkIfIncludes = function (userId, array, remove) {
    const index = array.indexOf(userId);
    if (index >= 0) {
        if (remove == true) {
            array.splice(index, 1);
        } else {
            return array;
        }
    } else {
        if (!remove) {
            array.push(userId);
        }
    }
    return array;
}