import './NoticeChatRoomLeave.css';

export default function NoticeChatRoomLeave({ yourInfo }) {
	return (
		<div id="NoticeChatRoomLeave">
			{yourInfo.userName} has left from chat room!
		</div>
	);
}
