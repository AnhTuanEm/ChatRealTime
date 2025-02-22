import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore"; // Thêm useAuthStore
import { Image, Send, X, Phone } from "lucide-react";
import toast from "react-hot-toast";
import VideoCall from "./VideoCall"; // Import component VideoCall

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false); // State để quản lý giao diện video call
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore(); // Lấy selectedUser từ useChatStore
  const { authUser } = useAuthStore(); // Lấy authUser từ useAuthStore

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleVideoCall = () => {
    if (!selectedUser) {
      toast.error("Please select a user to start a video call");
      return;
    }

    // Mở giao diện video call
    setIsVideoCallOpen(true);
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Nhập tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Nút điện thoại */}
        <button
          type="button"
          onClick={handleVideoCall}
          className="btn btn-sm btn-circle text-blue-500 hover:text-blue-600"
        >
          <Phone size={22} />
        </button>

        {/* Nút gửi tin nhắn */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {isVideoCallOpen && (
        <VideoCall
          selectedUser={selectedUser}
          authUser={authUser}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;