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
	const keyCheck = (event) => {
		if (event.key === 'Enter') {
			if (event.nativeEvent.isComposing === false) {
				handleSubmit(event);
			}
		}
		if (event.key === 'Escape') {
			console.log('여기 두번 뜨나? esc');
			if (event.nativeEvent.isComposing === false) {
			}
		}
	};
	const handleSubmit = (event) => {
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
				<input
					type="text"
					id="chatTextInput"
					name="chatText"
					maxLength="200"
					ref={chatTextInputBox}
					placeholder="type your message here.."
					disabled={leave}
					onKeyDown={keyCheck}
					onChange={handleChatTyping}
				></input>
				<RiSendPlane2Fill id="chatTextSubmitButton" onClick={handleSubmit} />
			</div>
		</div>
	);
}
