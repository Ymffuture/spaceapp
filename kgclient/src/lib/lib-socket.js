import { io } from "socket.io-client";

// One shared connection for the whole app — BlogView and CommentBox (and
// anything else that needs realtime updates) import this instead of each
// creating their own. Previously each created a separate connection,
// meaning every blog page opened two competing socket sessions.
//
// transports: ["websocket"] skips engine.io's XHR-polling transport
// entirely. That transport has a long-documented bug where a request
// object can be garbage-collected/reused mid-flight and throw
// "this.setData is not a function" — happens more often behind proxies
// like Render's, which is exactly this app's deployment. Modern browsers
// and Render both support WebSocket fine, so there's no real downside.
const socket = io("https://kgserver-bjy2.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
