import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const VideoCall = ({ selectedUser, authUser, onClose }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Kết nối Socket.IO
    socket.current = io("http://localhost:5001");

    // Lấy local media stream (camera và microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    // Xử lý sự kiện nhận cuộc gọi
    socket.current.on("incomingCall", (data) => {
      setIsCalling(true);
      peerConnection.current = createPeerConnection(data.from);
      peerConnection.current.addTrack(localStream.getTracks()[0], localStream);
      peerConnection.current.setRemoteDescription(data.signal);
    });

    // Xử lý sự kiện cuộc gọi được chấp nhận
    socket.current.on("callAccepted", (signal) => {
      peerConnection.current.setRemoteDescription(signal);
    });

    // Xử lý sự kiện kết thúc cuộc gọi
    socket.current.on("callEnded", () => {
      endCall();
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      socket.current.disconnect();
    };
  }, [localStream]);

  const createPeerConnection = (from) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("iceCandidate", {
          to: from,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startCall = () => {
    peerConnection.current = createPeerConnection(selectedUser._id);
    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    peerConnection.current
      .createOffer()
      .then((offer) => peerConnection.current.setLocalDescription(offer))
      .then(() => {
        socket.current.emit("callUser", {
          from: authUser._id,
          to: selectedUser._id,
          signal: peerConnection.current.localDescription,
        });
      })
      .catch((err) => console.error("Error creating offer:", err));
  };

  const acceptCall = () => {
    peerConnection.current
      .createAnswer()
      .then((answer) => peerConnection.current.setLocalDescription(answer))
      .then(() => {
        socket.current.emit("acceptCall", {
          to: selectedUser._id,
          signal: peerConnection.current.localDescription,
        });
      });
    setIsCalling(false);
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setRemoteStream(null);
    setIsCalling(false);
    onClose(); // Đóng giao diện video call
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          {/* Local Video */}
          <div className="relative">
            <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg" />
            <p className="text-white absolute bottom-2 left-2">You</p>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg" />
            <p className="text-white absolute bottom-2 left-2">{selectedUser?.fullName}</p>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex justify-center gap-4 mt-4">
          {isCalling ? (
            <>
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Accept Call
              </button>
              <button
                onClick={endCall}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                End Call
              </button>
            </>
          ) : (
            <button
              onClick={startCall}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Start Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;