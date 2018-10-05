define({ "api": [
  {
    "type": "amqp",
    "url": "<prefix>.message.adhoc",
    "title": "Send a message",
    "version": "1.0.0",
    "name": "message_adhoc",
    "group": "Message",
    "filename": "src/actions/message.adhoc.js",
    "groupTitle": "Message"
  },
  {
    "type": "amqp",
    "url": "<prefix>.message.predefined",
    "title": "Send a message using predefined account",
    "version": "1.0.0",
    "name": "message_predefined",
    "group": "Message",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>undefined</p>"
          }
        ]
      }
    },
    "filename": "src/actions/message.predefined.js",
    "groupTitle": "Message"
  }
] });