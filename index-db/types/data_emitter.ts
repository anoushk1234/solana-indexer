export type DataEmitter = {
  "version": "0.1.0",
  "name": "data_emitter",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "testEvent",
      "accounts": [],
      "args": []
    }
  ],
  "events": [
    {
      "name": "MyEvent",
      "fields": [
        {
          "name": "data",
          "type": "u64",
          "index": false
        },
        {
          "name": "label",
          "type": "string",
          "index": true
        }
      ]
    },
    {
      "name": "MyOtherEvent",
      "fields": [
        {
          "name": "data",
          "type": "u64",
          "index": false
        },
        {
          "name": "label",
          "type": "string",
          "index": true
        }
      ]
    }
  ]
};

export const IDL: DataEmitter = {
  "version": "0.1.0",
  "name": "data_emitter",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [],
      "args": []
    },
    {
      "name": "testEvent",
      "accounts": [],
      "args": []
    }
  ],
  "events": [
    {
      "name": "MyEvent",
      "fields": [
        {
          "name": "data",
          "type": "u64",
          "index": false
        },
        {
          "name": "label",
          "type": "string",
          "index": true
        }
      ]
    },
    {
      "name": "MyOtherEvent",
      "fields": [
        {
          "name": "data",
          "type": "u64",
          "index": false
        },
        {
          "name": "label",
          "type": "string",
          "index": true
        }
      ]
    }
  ]
};
