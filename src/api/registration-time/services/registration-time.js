'use strict';

/**
 * registration-time service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::registration-time.registration-time');
