import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useGetMessage from '../../context/useGetMessage.js';
import Loading from '../../components/Loading.jsx';
import useGetSocketMessage from '../../context/useGetSocketMessage.jsx';

function Messages() {
    const { messages, loading } = useGetMessage();
    useGetSocketMessage();
    const lastMessageRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    }, [messages]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                messages?.messages?.length > 0 &&
                messages.messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))
            )}

            <div className="" style={{ minHeight: "calc(92vh - 8vh)" }}>
                {!loading && messages?.messages?.length === 0 && (
                    <div>
                        <p className="text-center font-bold mt-[20%]">Say! hi</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Messages;
