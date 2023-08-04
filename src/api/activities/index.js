const ActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'activities',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const activitiesHandler = new ActivitiesHandler(service, validator);
        server.route(routes(activitiesHandler));
    },
};