# WebSocket Specification:

### Goal
 1. Allow a WebSocket client to establish a connection to the MonoRail server via WebSocket protocol and communicate in real time. In order to provide a better user experience in the UI it should be able to subscribe and receive log output from nodes running workflows. Perhaps even MonoRail logs as well.

 2. There should also be a way for the client to subscript to various resource events such as newly created items, updated item, and removed item. Generally the client will only be reading data from the server, there are no plans to write updates through WebSockets, though this is a possibility in the future. However WebSocket clients should be able to query resource collection.

### Recommended NodeJS Library

[`Einaros WebSockets`](https://github.com/websockets/ws) — *The Einaros WebSocket module is a simple and fast WebSocket client and server implementation for NodeJS.*

### WebSocket URI
  `ws://` `[host]` `:` `[port]` `/` `[channel]` — *This is the URI used by the client to establish a WebSocket connection.*

  1. `[host]` — *WebSocket server host.*
  2. `[port]` — *WebSocket server port.*
  3. `[channel]` — *Path that designates which resource is going to be used. This is very imported because it is how the server will know which resources it should be providing to the client.*

### Resources of Interest
 * Workflow logs.
 * Workflow state changes.
 * Catalog updates.
 * SKU updates.
 * Node updates.

### JSON Message Protocol

All messages should be serialized JSON strings. A handler property must be provided to route the message.

`handler` — *A string used to determine which handler should be used for this message.*

### Request/Response Pattern

Continuations will not be supported by this specification, this means that the client and server will not be able to associate incoming messages with outgoing. The message handlers should be designed so that message order is non-deterministic and there can be no acknowledgement of a response too a given request. In the future continuations can be implemented on top of this specification, but there is currently no need.

### Server WebSocket Events

`connection` — A client has established a connection.

`close` — Connection was closed. Cleanup.

`error` — Encountered an error.

`message` — Received a message from the client.

### Server Broadcast Method

There should be a way for a server message handler to broadcast to all or a subset of all known connections.

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

### Message Handlers

Keep in mind that the resource for each these handlers should use is based on the path of the WebSocket connection. This means that a client could establish more than one connection the the server depending on how many resources it needs to negotiate.

##### Init/Session

*`@client` —> `init` —> `@server` —> `session` —> `@client`*

 * `{handler: init}` — *The client would like to exchange an ID for this connection from the server. Useful for session handling.*

 * `{handler: session, id: String}` — *The server is giving the client a session.*

##### Query/List

*`@client` —> `query` —> `@server` —> `list` —> `@client`*

 * `{handler: query, params: Object}` — *The client can query the server for a collection of a resource.*

 * `{handler: list, items: Array}` — *The server is giving the client a list or collection.*

##### Watch/List/Item/Remove

*`@client` —> `watch` —> `@server` —> `list|item|remove` —> `@client`*

 * `{handler: watch, params: Object}` — *The client wants the server to monitor an identifiable set of resources for changes.*

The server will send a lists, items, or removes until a matching stop is received or the connection closes.

 * `{handler: list, items: Array}` — *List of items.*

 * `{handler: item, data: Object}` — *Item data.*

 * `{handler: remove, params: Object}` — *Item(s) to remove.*

##### Stop

*`@client` —> `stop` —> `@server`*

 * `{handler: stop, params: Object}` — *The client wants to stop monitoring a resource it may or may not already be watching.*

##### Stop

*`@client` —> `all` —> `@server` —> `list` —> `@client`*

 * `{handler: all}` — *The client wants a list of all items.*

 * `{handler: list, items: Array}` — *The server is giving the client a list or collection.*

##### Stop

*`@client` —> `get` —> `@server` —> `item|remove` —> `@client`*

 * `{handler: get, params: Object}` — *The client would like an update on of a single identifiable resource.*

The server should respond with the item or tell the client to remove it.

 * `{handler: item, data: Object}` — *Item data.*

 * `{handler: remove, params: Object}` — *Item(s) to remove.*

### MongoDB Integration

A resource can point to a MongoDB collection. Then the server handlers should know that they should deal with a MongoDB collection except for watch and stop which will most likely use RabbitMQ.

### RabbitMQ Integration

A resource can point to a RabbitMQ topic. Then the query, all, get commands will be less relevant and should be ignore by the server. Unless there are logs that can be accessed.

### Server API
The `ws` library will provide most of this API, it doesn’t include a broadcast method but they give you an example implementation.

	WebSocketServer
    on(event:String, handler:Function) — 
    broadcast(data|String, skip:String|Array|Function) — 

	WebSocketConnection
    on(event:String, handler:Function) —
    send(data:String) —

### Client API

	WebSocketConnection
    events — EventEmitter isntance.
      on(event:String, handler:Function) — 
      once(event:String, handler:Function) — 
    wsConn — WebSocket instance.
      onopen() — 
      onclose() — 
      onerror() — 
      onmessage() — 
      send() — 
    connect() —
    disconnect() —
    ready(callback:Function) —
    init(callback:Function) —
    all() —
    query(params) —
    get(params) — 
    watch(params) —
    stop(params) — 
