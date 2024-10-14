"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSocket } from "@/store/SocketProvider";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleMessageSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!message) return toast.error("Message cannot be empty");
    sendMessage(message);
    setMessage("");
  };

  return (
    <section className="container mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="border min-h-48 rounded-md w-full">
          <div className="relative w-full px-5 py-5 flex flex-col gap-2">
            {messages.map((message: string, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "py-2 px-3 text-sm text-black w-fit max-w-[80%] rounded-lg",
                  idx % 2 === 0
                    ? "bg-gray-200 self-end"
                    : "bg-gray-300 self-start"
                )}
              >
                {message}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleMessageSend}
          className="w-full flex items-center mt-5 gap-4"
        >
          <Input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
          />
          <Button type="submit" size="sm" variant="secondary">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
