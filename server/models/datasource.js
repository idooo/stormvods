var modelName = 'Datasource';

module.exports = function(mongoose, config) {

    var schema = mongoose.Schema({
        url: {
            type: String,
            trim: true,
            required: true
        },
        type: {
            type: String,
            required: true,
            default: 'PULL'
        },
        jsonlt: {
            type: Object
        },
        widget: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        creation_date: {
            type: Date,
            default: Date.now
        },
        raw_data: {
            type: String
        },
        last_update_date: {
            type: Date
        },
        last_update_status: {
            type: String
        },
        last_error: {
            type: String
        },
        interval: {
            type: Number,
            default: 60
        }
    });

    /**
     * Get list of datasources
     * @returns {Promise}
     */
    schema.statics.getDatasources = getList();

    var Datasource = mongoose.model(modelName, schema);

    return {
        name: modelName,
        model: Datasource
    };
};


/**
 * Generate the 'get collection' function with promises for scheme
 * @returns {Function}
 */
function getList() {
    return function(ids) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var query = {};
            if (typeof ids !== 'undefined') query = { _id: {$in: ids }};

            query = self.where(query);
            query.find(function (err, objects) {
                if (objects) resolve(objects);
                else {
                    if (err) reject(err);
                    else reject([]);
                }
            });
        });
    };
}