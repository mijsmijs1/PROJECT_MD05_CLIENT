import  { useEffect, useRef } from 'react'
import './chatbox.scss'
import { Chat, socketChat } from '@/sokets/chat.socket'
import { user } from '@/stores/slices/authen.slice'

export default function ChatBox({ data, user, setDisplayChat }: {
    data: Chat[],
    user: user,
    setDisplayChat: any
}) {
    let chatRef = useRef(null);
    console.log("chatRef", chatRef);
    useEffect(() => {
        // Khi component được render, đặt giá trị scrollTop để cuộn đến cuối cùng
        if (chatRef.current != null) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
            console.log("cuon");
        }
    }, [data]);


    return (
        <div className='chat_box'>

            <div className="right">
                <div className="top" >
                    <p onClick={() => {
                        setDisplayChat(false);
                        socketChat.disconnectChat();
                    }}>✕</p>
                    <span>
                        From: <span className="name">{data.find(item => item.memberId)?.memberId}</span>
                    </span>
                </div>

                <div className="chat" data-chat="person3" ref={chatRef}>
                    <div className="conversation-start">
                        <span>Today, 3:38 AM</span>
                    </div>
                    {
                        data?.map(message => {

                            return (<>
                                {
                                    message.memberId ? (
                                        <div className="bubble you">{message.content}</div>
                                    ) : <div className="bubble me">{message.content}</div>
                                }
                            </>)
                        })
                    }

                </div>
                <form className="write" onSubmit={(e) => {
                    e.preventDefault();
                    if ((e.target as any).content.value.length != 0) {
                        let value = (e.target as any).content.value;
                        socketChat.sendMessage(user.id, value);
                        (e.target as any).content.value = ""
                    }
                }}>
                    <a href="javascript:;" className="write-link attach" />
                    <input type="text" name="content" />
                    <a href="javascript:;" className="write-link smiley" />
                    <button className="write-link send" style={{ border: "none" }} type='submit'></button>

                </form>
            </div>


        </div>
    )
}
