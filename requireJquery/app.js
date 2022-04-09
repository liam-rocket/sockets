$(() => {
  var socket = io();

  $("form").submit(() => {
    // * jQuery (old)
    socket.emit("chatMessage", [$("#m").val(), $("#username").val()]);
    $("#m").val("");
    return false;
  });

  socket.on("chatMessage", (data) => {
    $("#messages").append($("<li>").text(`${data[1]} : ${data[0]}`));
  });

  // room joining
  $("#join").click((e) => {
    e.preventDefault();
    // alert("this is an alert");
    let room = prompt("which room would you like to join?");
    // calling the subscribe event and passing the room value to server
    socket.emit("subscribe", room);
  });

  socket.on("joinRoom", (room) => {
    $("#room").html(`You are in Room: ${room}`);
  });
});
