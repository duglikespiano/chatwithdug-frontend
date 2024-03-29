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
			if (event.nativeEvent.isComposing === false) {
				event.target.value = '';
			}
		}
	};

	const handleSubmit = (event) => {
		if (event.target.value.trim() !== '') {
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
		} else {
			chatTextInputBox.current.value = '';
			return;
		}
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
