# WebSocket Specification:

### Goals
 1. Allow a WebSocket client to establish a connection to the MonoRail server via WebSocket protocol and communicate in real time.

 2. Clients should be able to subscribe to RabbitMQ topics so that workflow status and logs can be seen in real time.

 3. Clients should be able to subscribe to database events, such as new documents, deletes, and updated documents.

### Recommended NodeJS Library

[`Einaros WebSockets`](https://github.com/websockets/ws) — *The Einaros WebSocket module is a simple and fast WebSocket client and server implementation for NodeJS.*

### WebSocket URI
  `ws://` `[host]` `:` `[port]` `/` `[channel]` — *This is the URI used by the client to establish a WebSocket connection.*

### MonoRail WebSocket Resources
 * Workflow logs.
 * Workflow state changes.
 * Catalog DB updates.
 * SKU DB updates.
 * Node DB updates.

### JSON Message Protocol

All messages should be serialized JSON strings. A handler property must be provided to route the message.

`handler` — *A string used to determine which handler should be used for this message.*

`type` — Optional — *Resource identifier for the client/server to know what the expected data type is for the message.*

There will be no need to continuations in this design. Request and response order of messages will be non-deterministic.

### Server WebSocket Events

`connection` — A client has established a connection.

`close` — Connection was closed. Cleanup.

`error` — Encountered an error.

`message` — Received a message from the client.

### Client WebSocket Events

`open` — WebSocket connection has been opened.

`close` — WebSocket connection has closed.

`error` — WebSocket connection encountered an error.

`message` — A message was received.

`ready*` — WebSocket connection is ready.

`init*` — WebSocket connection has initialized. A connection ID has been exchanged.

`[handler]*` — A message with the given [handler] was received.

	* — custom event handlers.

### Client Reconnection

Clients should have a connect method that can be used to reconnect to the server. This message should be called when the client connection closes or encounters and error.

##### Init/Session

*`@client` —> `init` —> `@server` —> `session` —> `@client`*

 * `{handler: init}` — *The client would like to exchange an ID for this connection from the server. Useful for session handling.*

 * `{handler: session, id: String}` — *The server is giving the client a session.*

##### Query/List

*`@client` —> `query` —> `@server` —> `list` —> `@client`*

 * `{handler: query, type: resource, params: Object}` — *The client can query the server for a collection of a resource.*

 * `{handler: list, type: resource, items: Array}` — *The server is giving the client a list or collection.*

##### Watch/List/Item/Remove

*`@client` —> `watch` —> `@server` —> `list|item|remove` —> `@client`*

 * `{handler: watch, type: resource, params: Object}` — *The client wants the server to monitor an identifiable set of resources for changes.*

The server will send a lists, items, or removes until a matching stop is received or the connection closes.

 * `{handler: list, type: resource, items: Array}` — *List of items.*

 * `{handler: item, type: resource, data: Object}` — *Item data.*

 * `{handler: remove, type: resource, params: Object}` — *Item(s) to remove.*

##### Stop

*`@client` —> `stop` —> `@server`*

 * `{handler: stop, type: resource, params: Object}` — *The client wants to stop monitoring a resource it may or may not already be watching.*

##### All/List

*`@client` —> `all` —> `@server` —> `list` —> `@client`*

 * `{handler: all}` — *The client wants a list of all items.*

 * `{handler: list, items: Array}` — *The server is giving the client a list or collection.*

##### Get/Item/Remove

*`@client` —> `get` —> `@server` —> `item|remove` —> `@client`*

 * `{handler: get, type: resource, params: Object}` — *The client would like an update on of a single identifiable resource.*

The server should respond with the item or tell the client to remove it.

 * `{handler: item, type: resource, data: Object}` — *Item data.*

 * `{handler: remove, type: resource, params: Object}` — *Item(s) to remove.*

### MongoDB Integration

A resource can point to a MongoDB collection. Then the server handlers should know that they should deal with a MongoDB collection except for watch and stop which will most likely use RabbitMQ.

### RabbitMQ Integration

A resource type can point to a RabbitMQ topic. Then the query, all, get commands will be less relevant and should be ignore by the server. Unless there are logs that can be accessed.

### Server API

The `ws` library will provide most of this API, it doesn’t include a broadcast method but they give you an example implementation.

`WebSocketServer`
  * `on(event:String, handler:Function)` — Subscribe function to event.
  * `broadcast(data|String, skip:String|Array|Function)` — Broadcast message to multiple connections.

`WebSocketConnection`
  * `on(event:String, handler:Function)` — Subscribe function to event.
  * `send(data:String)` — Publish a message to a specific client.

### Client API

`WebSocketConnection`
  * `events` — EventEmitter instance.
    * `on(event:String, handler:Function)` — Subscribe function to event.
    * `once(event:String, handler:Function)` — Subscribe function to event once.
  * `wsConn` — WebSocket instance.
    * `onopen()` — Event handler for connection open.
    * `onclose()` — Event handler for connection close.
    * `onerror()` — Event handler for connection error.
    * `onmessage()` — Event handler for connection message.
    * `send()` — Send a message to the WebSocket server.
  * `connect()` — Connect to the WebSocket server.
  * `disconnect()` — Disconnect from the WebSocket server.
  * `ready(callback:Function)` — Make connection ready and callback.
  * `init(callback:Function)` — Initialize WebSocket server connection and callback.
  * `all(type:String)` — Send all message to server.
  * `query(type:String, params:Object)` — Send query message to server.
  * `get(type:String, params:Object)` — Send get message to server.
  * `watch(type:String, params:Object)` — Send watch message to server.
  * `stop(type:String, params:Object)` — Send stop message to server.
