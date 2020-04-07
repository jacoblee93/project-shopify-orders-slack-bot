const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for Shopify orders.create event and
* sends a notification to a Slack channel
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {

  // Store API Responses
  const result = {};

  let blocks = [{
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*New order from* <mailto:${event.customer.email}|*${event.customer.email}*!>\n<${event.order_status_url}|View in Shopify>`
    },
    fields: [{
      type: 'mrkdwn',
      text: '*Item*'
    }, {
      type: 'mrkdwn',
      text: '*Price*'
    }].concat(...event.line_items.map((lineItem) => {
      return [{
        type: 'mrkdwn',
        text: `_${lineItem.quantity}x ${lineItem.name}_`
      }, {
        type: 'mrkdwn',
        text: `_$${lineItem.price}_`
      }];
    })).concat([{
      type: 'mrkdwn',
      text: '*Total*'
    }, {
      type: 'mrkdwn',
      text: `*$${event.total_line_items_price}*`
    }])
  }];

  result.slack = {};
  result.slack.message = await lib.slack.channels['@0.6.6'].messages.create({
    channel: `#general`,
    blocks: blocks
  });

  return result;

};