import './NoticeChatTyping.css';

export default function NoticeChatTyping({ yourInfo, typing }) {
	return typing ? (
		<div id="NoticeChatTyping">{`${yourInfo.userName} is typing...`}</div>
	) : null;
}
