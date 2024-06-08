'use strict';

/**
 * registration-time router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::registration-time.registration-time');
