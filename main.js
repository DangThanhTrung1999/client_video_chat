const socket = io("https://server-video-trung.herokuapp.com/");
function openStream() {
  const config = { audio: true, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}
playStream = (idVideoTag, stream) => {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
};

var peer = new Peer();
peer.on("open", (id) => {
  $("#my-peer").append(id);
  $("#btnSignup").click(() => {
    const username = $("#txtUsername").val();
    socket.emit("NGUOI_DUNG-DK", { username, userId: id });
  });
});

socket.on("Danh_sach_online", (arrUser) => {
  $("#ulUser").html("");
  arrUser.forEach((user) => {
    const { username, userId } = user;
    $("#ulUser").append(`<li id='${userId}'>${username}</li>`);
  });
});
socket.on("dangKyThatBai", () => $("#error").html("Tên đã tồn tại"));
$("#btnCall").click(() => {
  const id = $("#remoteId").val();
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

$("#ulUser").on("click", "li", function () {
  let id=$(this).attr("id");
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});
