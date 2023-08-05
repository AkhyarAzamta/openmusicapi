const InvariantError = require('../../exceptions/InvariantError');
const { ActitivityPayloadSchema } = require('./schema');

const ActivitiesValidator = {
    validateActivityPayload: (payload) => {
        const validationResult = ActitivityPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ActivitiesValidator;