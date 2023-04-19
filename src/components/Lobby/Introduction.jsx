import { RiMailLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import notificationExample from '../../images/notificationExample.png';
import './Introduction.css';

export default function Introduction() {
	const fetchTestRequestMail = () => {
		Swal.fire({
			title: 'You have sent notification mail!',
			text: 'The above image is an expample that Dug recieves.',
			imageUrl: notificationExample,
			imageWidth: 1200,
			imageHeight: 200,
			imageAlt: 'notificationExample',
		});

		const data = {
			name: sessionStorage.getItem('name'),
			email: sessionStorage.getItem('email'),
		};

		fetch(`${process.env.REACT_APP_BACKEND_URL}/mail/testRequestMail`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((res) => {
			if (res.status === 400) {
				Swal.fire({
					title: `Error occurred!`,
					icon: 'error',
					text: 'Please contact with dug!',
					showConfirmButton: true,
				});
			}
		});
	};
	return (
		<div id="Introduction">
			<h2>Welcome to Chat with Dug!</h2>
			<h3>This page is made up with tech stacks below.</h3>
			<h4>
				FrontEnd : <br />
				<img
					src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"
					alt="iconHTML5"
				/>
				<img
					src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"
					alt="iconCSS3"
				/>
				<img
					src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white"
					alt="iconJavascript"
				/>
				<img
					src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"
					alt="iconReact"
				/>{' '}
			</h4>

			<h4>
				BackEnd :<br />
				<img
					src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white"
					alt="iconJavascript"
				/>
				<img
					src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"
					alt="iconNodeJs"
				/>
				<img
					src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"
					alt="iconExpress"
				/>
				<img
					src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=MariaDB&logoColor=white"
					alt="iconMariaDB"
				/>
			</h4>
			<h4>
				etc :<br />
				<img
					src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"
					alt="iconSocket.io"
				/>
				<img
					src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"
					alt="iconGit"
				/>
				<img
					src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white"
					alt="iconPostman"
				/>
			</h4>
			<div />
			<br />

			<h3>Want to test this page but no one to do with?</h3>
			<h4>
				Just hit the mail image!{' '}
				<RiMailLine id="mailImage" onClick={fetchTestRequestMail} />
			</h4>
			<h4>Dug will get notification and come fly to be with you.</h4>
			<h4>Please enjoy your time~♫ </h4>
		</div>
	);
}
