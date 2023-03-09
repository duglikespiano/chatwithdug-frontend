import { useRef } from 'react';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { callSocket } from '../Lobby.jsx';
import './ChatTextInputBox.css';
import NoticeChatTyping from './NoticeChatRoom/NoticeChatTyping.jsx';

export default function ChatTextInputBox({
	myInfo,
	yourInfo,
	roomNumber,
	leave,
	typing,
}) {
	const chatTextInputBox = useRef();
	const handleSubmit = (event) => {
		event.preventDefault();
		callSocket(
			'chatContents',
			myInfo.userName,
			myInfo.userSocketId,
			yourInfo.userName,
			yourInfo.userSocketId,
			chatTextInputBox.current.value,
			roomNumber
		);
		chatTextInputBox.current.value = '';
	};

	const handleChatTyping = () => {
		callSocket('typing', yourInfo.userSocketId, myInfo.userName);
	};

	return (
		<div id="ChatTextInputBox">
			<div>
				<NoticeChatTyping yourInfo={yourInfo} typing={typing} />
				<form onSubmit={handleSubmit}>
					<label htmlFor="chatText"></label>
					<input
						type="text"
						id="chatTextInput"
						name="chatText"
						maxLength="200"
						ref={chatTextInputBox}
						placeholder="type your message here.."
						disabled={leave}
						onChange={handleChatTyping}
					></input>
					<RiSendPlane2Fill id="chatTextSubmitButton" />
				</form>
			</div>
		</div>
	);
}
