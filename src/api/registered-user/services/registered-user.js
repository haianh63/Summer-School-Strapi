'use strict';

/**
 * registered-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::registered-user.registered-user');
