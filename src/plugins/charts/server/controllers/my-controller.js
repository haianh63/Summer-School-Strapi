'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('charts')
      .service('myService')
      .getWelcomeMessage();
  },
});
