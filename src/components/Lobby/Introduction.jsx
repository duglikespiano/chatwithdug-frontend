import { RiMailSendFill } from 'react-icons/ri';
import './Introduction.css';

export default function Introduction() {
	const fetchTestRequestMail = () => {
		const data = {
			name: sessionStorage.getItem('name'),
			email: sessionStorage.getItem('email'),
		};
		fetch(
			`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/mail/testRequestMail`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		);
	};
	return (
		<div id="Introduction">
			Welcome to Chat with Dug!
			<div>This page is made up with tech stacks below!</div>
			<div>FrontEnd : HTML, CSS, React</div>
			<div>BackEnd : Node.js, Express, MySQL</div>
			<div>etc : Socket.io</div>
			<div />
			<div>Want to test this page but no one to do with?</div>
			<div>Just hit the mail image below! </div>
			<div>Dug will get notification by mail</div>
			<div>and come fly to be with you!</div>
			<div>
				<RiMailSendFill id="mailImage" onClick={fetchTestRequestMail} />
			</div>
			<div>Please enjoy your time!</div>
		</div>
	);
}
