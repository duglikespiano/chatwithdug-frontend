import { useEffect, useRef } from 'react';
import './ChatContentsBox.css';
import NoticeChatRoomLeave from './NoticeChatRoom/NoticeChatRoomLeave.jsx';

export default function ChatContentsBox({
	chatContents,
	myInfo,
	yourInfo,
	leave,
}) {
	const scrollRef = useRef();
	useEffect(() => {
		// 현재 스크롤 위치 === scrollRef.current.scrollTop
		// 스크롤 길이 === scrollRef.current.scrollHeight
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	});

	return (
		<div id="ChatContentsBox" ref={scrollRef}>
			{chatContents.map((item, i) => {
				return (
					<div
						key={i}
						className={
							item.fromSocketId === myInfo.userSocketId
								? 'myChats'
								: 'yourChats'
						}
					>
						<div className="name">{item.fromUserName}</div>
						<div className="chatContents">{item.text}</div>
					</div>
				);
			})}
			{leave ? <NoticeChatRoomLeave yourInfo={yourInfo} /> : null}
		</div>
	);
}
