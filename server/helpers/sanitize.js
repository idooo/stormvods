var defaults = ['__v'];

module.exports = function(obj, fields) {
    try {
        obj = obj.toObject();
    }
    catch (e) {}

    fields = defaults.concat(fields || []);

    fields.forEach(function(fieldName) {
        if (typeof obj[fieldName] !== 'undefined') delete obj[fieldName]
    });

    return obj;
};